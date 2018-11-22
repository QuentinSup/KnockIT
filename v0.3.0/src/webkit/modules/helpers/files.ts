import { Logger } from '@webkit/helper/logger'; 
import { Query } from '@webkit/helper/query'; 
     
let logger: Logger = Logger.getLogger('fr.ca.cat.helpers');
    
export function loadResource(resource: string, callback: Function, context?: any): void {

    if(logger.isTraceEnabled()) {
        logger.trace("Chargement de la ressource %s".format(resource));
    }
    
    var callbackHandler = function (text: string, status: string) {
        if (status == "success") {
            
            if(logger.isDebugEnabled()) {
                logger.debug("Chargement réussi de la ressource %s".format(resource));
            }
                
            if (callback) {
                callback.call(context || this, text)
            }
        } else {
            logger.error("Erreur lors du chargement de la ressource %s".format(resource));                
        }
    }

    if(!((resource || "").toLowerCase().startsWith('http'))) {
        resource = app.servicesPath + resource; 
    }
    
    Query.GET(resource, callback, context, { silent: true, upToDate: false });

}