export default class NotFoundDocumentError {
      static createError(entity) {
        const error = new Error(`No se encontro un ${entity} en la bd`);
    
        throw error;
      }
    }