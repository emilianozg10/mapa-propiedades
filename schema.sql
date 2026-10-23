-- Base de datos D1 del mapa de propiedades. Cada propiedad se guarda como JSON.
CREATE TABLE IF NOT EXISTS propiedades (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  actualizado TEXT,
  actualizado_por TEXT
);
