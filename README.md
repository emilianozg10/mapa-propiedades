# Mapa de Propiedades

Mapa interactivo para administrar un portafolio de inmuebles. Muestra cada propiedad en un mapa de calles o satelital y permite consultar y editar su ficha. Los datos viven en una **Lista de SharePoint** y se accede con la cuenta de Microsoft de la organización.

Este repositorio contiene **solo el código**. No incluye datos de propiedades; sin iniciar sesión con una cuenta autorizada, la página no muestra información.

## Funciones

- Mapa con capas **Calles** (OpenStreetMap), **Satélite** e **Híbrido**.
- Pines por estatus: rentada, no rentada, uso interno.
- Ficha: foto, subarrendador, número predial, m², estatus, renta, antigüedad del inquilino, dirección y observaciones.
- Alta, edición, cambio de ubicación del pin, fotos y eliminación.
- Búsqueda, filtros por estatus, resumen y exportación a Excel.
- Los cambios de otros usuarios aparecen solos cada 30 segundos.

Sin configurar, la página abre en **modo demostración** con datos ficticios guardados solo en el navegador.

## Configuración (`config.js`)

| Campo | Qué es |
|---|---|
| `clientId` | ID de la aplicación registrada en Entra ID |
| `tenantId` | ID del directorio (inquilino) |
| `siteUrl` | URL del sitio de SharePoint, por ejemplo `https://empresa.sharepoint.com/sites/Inmuebles` |
| `listName` | Nombre de la lista (por defecto `Propiedades`) |
| `photoLibrary` | Biblioteca de documentos para fotos (por defecto `Fotos propiedades`) |
| `azureMapsKey` | Opcional. Clave de Azure Maps para la imagen satelital; si se deja vacía se usa Esri |
| `graphScope` | `Sites.ReadWrite.All` o `Sites.Selected` |

Ningún valor de `config.js` es secreto: la aplicación es de tipo SPA y no usa contraseñas ni secretos de cliente.

## Registro en Entra ID (TI)

1. **Registros de aplicaciones → Nuevo registro**. Tipos de cuenta: solo este directorio.
2. **Plataforma: Aplicación de página única (SPA)**. URI de redirección: la URL pública de esta página (GitHub Pages), con la barra final.
3. **Permisos de API → Microsoft Graph → Delegados**: `Sites.ReadWrite.All` (o `Sites.Selected` y conceder acceso al sitio específico). Otorgar consentimiento de administrador si la política lo requiere.
4. Entregar el ID de la aplicación y el ID del directorio.

## Lista de SharePoint

Columnas que la página reconoce (por nombre visible):

`Folio` (o Título), `Nombre`, `Subarrendador`, `Predial`, `M2` (número), `Estatus` (Rentada / No rentada / Uso interno), `Renta` (número), `FechaContrato` (texto DD/MM/AAAA), `Direccion`, `Latitud` (número), `Longitud` (número), `Precision`, `Observaciones`.

Se puede crear con **Nueva lista → Desde CSV** usando un archivo con esos encabezados.

Fotos: biblioteca `Fotos propiedades`; cada foto se guarda como `<folio>.jpg`.

## Teams

En el chat o canal: **+ → Sitio web**, pegar la URL de la página. Si la ventana de inicio de sesión no abre dentro de Teams, la página ofrece abrirla en el navegador.

## Atribuciones

Mapas © colaboradores de OpenStreetMap. Imágenes satelitales © Esri, Maxar, Earthstar Geographics (o © Microsoft Azure Maps si se configura).
