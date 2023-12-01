export default class NotFoundDocumentError {
      static createError(entity) {
        const error = Error(`No se encontro un ${entity} en la bd`);
    
        throw error;
      }
    }