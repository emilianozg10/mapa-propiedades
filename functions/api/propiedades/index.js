// GET: todas las propiedades. POST: crea una propiedad nueva.
const fila = r => ({ ...JSON.parse(r.data), _id: r.id, _mod: r.actualizado, _by: r.actualizado_por });

export async function onRequestGet({ env }){
  const { results } = await env.DB.prepare("SELECT id, data, actualizado, actualizado_por FROM propiedades").all();
  return Response.json(results.map(fila), { headers: { "Cache-Control": "no-store" } });
}

export async function onRequestPost({ request, env, data }){
  const p = await request.json();
  delete p._id; delete p._mod; delete p._by;
  const base = String(p.folio || p.nombre || "prop").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "prop";
  let id = base, i = 2;
  while (await env.DB.prepare("SELECT 1 FROM propiedades WHERE id = ?").bind(id).first()) id = `${base}-${i++}`;
  const now = new Date().toISOString();
  await env.DB.prepare("INSERT INTO propiedades (id, data, actualizado, actualizado_por) VALUES (?, ?, ?, ?)").bind(id, JSON.stringify(p), now, data.email).run();
  return Response.json({ id }, { status: 201 });
}
