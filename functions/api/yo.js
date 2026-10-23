// Quién está viendo la página y si puede editar.
export const onRequestGet = ({ data }) => Response.json({ email: data.email, puedeEditar: data.puedeEditar });
