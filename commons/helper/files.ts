/**
 * @fileOverview This file defines the files manager.
 */
module kit.helpers {
     
    var oLogger_: Logger = Logger.getLogger('kit.helpers');
    
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

        Query.GET(app.servicesPath + resource, callback, context, { silent: true });

    }
    
}