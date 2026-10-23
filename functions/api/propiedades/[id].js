// PUT: guarda los cambios de una propiedad. DELETE: la elimina.
export async function onRequestPut({ request, env, params, data }){
  const p = await request.json();
  delete p._id; delete p._mod; delete p._by;
  const now = new Date().toISOString();
  const r = await env.DB.prepare("UPDATE propiedades SET data = ?, actualizado = ?, actualizado_por = ? WHERE id = ?").bind(JSON.stringify(p), now, data.email, params.id).run();
  if (!r.meta.changes) return Response.json({ error: "No existe esa propiedad." }, { status: 404 });
  return Response.json({ id: params.id, actualizado: now });
}

export async function onRequestDelete({ env, params }){
  await env.DB.prepare("DELETE FROM propiedades WHERE id = ?").bind(params.id).run();
  return new Response(null, { status: 204 });
}
