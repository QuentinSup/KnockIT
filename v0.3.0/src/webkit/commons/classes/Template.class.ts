module fr.ca.cat {
    
    import Logger = helpers.Logger;
    
    var oLogger: Logger = Logger.getLogger('fr.ca.cat.Template');
    
    export class Template extends EventsBinder implements IDisposable {

        public templateName: KnockoutObservable<string> = ko.observable<string>();
        
        constructor(templateName) {
            
            super();
            this.templateName(templateName);
        }

        public dispose(): void {
            //N/A
        }

    }

}