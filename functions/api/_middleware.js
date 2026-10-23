// Verifica que cada llamada a /api venga autenticada por Cloudflare Access.
// Variables de entorno: TEAM_DOMAIN (ej. "cecom.cloudflareaccess.com"), POLICY_AUD (etiqueta AUD de la aplicación de Access),
// EDITORES (correos separados por coma que pueden editar).

const enc = new TextEncoder();
let certsCache = { at: 0, keys: [] };

const b64url = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=")), c => c.charCodeAt(0));

async function getKeys(team){
  if (Date.now() - certsCache.at < 3600_000 && certsCache.keys.length) return certsCache.keys;
  const r = await fetch(`https://${team}/cdn-cgi/access/certs`);
  const { keys } = await r.json();
  certsCache = { at: Date.now(), keys };
  return keys;
}

async function verify(token, env){
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) throw new Error("token mal formado");
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64url(p)));
  const jwk = (await getKeys(env.TEAM_DOMAIN)).find(k => k.kid === header.kid);
  if (!jwk) throw new Error("llave desconocida");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(s), enc.encode(`${h}.${p}`));
  if (!ok) throw new Error("firma inválida");
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error("token vencido");
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (env.POLICY_AUD && !aud.includes(env.POLICY_AUD)) throw new Error("audiencia incorrecta");
  return payload;
}

export async function onRequest(ctx){
  const { request, env } = ctx;
  const token = request.headers.get("Cf-Access-Jwt-Assertion") || "";
  try{
    if (!env.TEAM_DOMAIN) throw new Error("Falta configurar TEAM_DOMAIN");
    const claims = await verify(token, env);
    const email = String(claims.email || "").toLowerCase();
    const editores = String(env.EDITORES || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
    ctx.data.email = email;
    ctx.data.puedeEditar = editores.includes(email);
  }catch(e){
    return Response.json({ error: "No autorizado", detalle: e.message }, { status: 403 });
  }
  if (!["GET", "HEAD"].includes(request.method) && !ctx.data.puedeEditar)
    return Response.json({ error: "Tu correo solo tiene permiso de consulta." }, { status: 403 });
  return ctx.next();
}
