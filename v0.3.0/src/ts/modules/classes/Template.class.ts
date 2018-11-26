import { EventsBinder } from '@webkit/core/EventsBinder.class';

export class Template extends EventsBinder implements IDisposable {

    public templateName: KnockoutObservable<string> = ko.observable<string>();
    
    constructor(templateName) {
        
        super();
        this.templateName(templateName);
    }

    public dispose(): void {
        dispose(this.templateName);
    }

}