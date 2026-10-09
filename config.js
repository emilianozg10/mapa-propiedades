// Configuración de conexión. Ningún valor aquí es secreto: son identificadores públicos.
// Mientras clientId esté vacío, la página funciona en "modo demostración" con datos ficticios.
window.APP_CONFIG = {
  // Entra ID (los entrega TI al registrar la aplicación)
  clientId: "",            // ID de la aplicación (cliente)
  tenantId: "",            // ID del directorio (inquilino)

  // SharePoint
  siteUrl: "",             // Ej. "https://cecom.sharepoint.com/sites/Inmuebles"
  listName: "Propiedades", // Nombre de la lista con los datos
  photoLibrary: "Fotos propiedades", // Biblioteca de documentos para las fotos

  // Satélite: si TI entrega una clave de Azure Maps, se usa; si no, se usa la imagen de Esri.
  azureMapsKey: "",

  // Permiso de Microsoft Graph. Si TI usa el permiso restringido a un sitio, cambiar a "Sites.Selected".
  graphScope: "Sites.ReadWrite.All",

  // Cada cuántos segundos se buscan cambios hechos por la otra persona
  refreshSeconds: 30
};
