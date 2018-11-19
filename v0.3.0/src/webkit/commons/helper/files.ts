/**
 * @fileOverview This file defines the files manager.
 */
module fr.ca.cat.helpers {
     
    var oLogger_: Logger = Logger.getLogger('fr.ca.cat.helpers');
    
    export function loadResource(resource: string, callback: Function, context?: any): void {

        if(oLogger_.isTraceEnabled()) {
            oLogger_.trace("Chargement de la ressource %s".format(resource));
        }
        
        var callbackHandler = function (text: string, status: string) {
            if (status == "success") {
                
                if(oLogger_.isDebugEnabled()) {
                    oLogger_.debug("Chargement réussi de la ressource %s".format(resource));
                }
                    
                if (callback) {
                    callback.call(context || this, text)
                }
            } else {
                oLogger_.error("Erreur lors du chargement de la ressource %s".format(resource));                
            }
        }

        if(!((resource || "").toLowerCase().startsWith('http'))) {
            resource = app.servicesPath + resource; 
        }
        
        Query.GET(resource, callback, context, { silent: true, upToDate: false });

    }
    
}