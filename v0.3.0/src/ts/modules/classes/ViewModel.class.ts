import { EventsBinder } from '@webkit/core/EventsBinder.class';

export class ViewModel extends EventsBinder implements IDisposable {

    private _bindings: any[] = []

    public strings: any = {}

    constructor(stringsToRegister: string[]) {
        
        super();
        
        app.i18n.ready((): void => {
            if (stringsToRegister != null) {
                this.addStringsToModel(stringsToRegister)
            }
        })
    }

    public addStringToModel(id: string): void {
        this.strings[id] = app.i18n.getObservableString(id)
    }

    public addStringsToModel(ids: string[]): void {
        for (let i: number = 0, length: number = ids.length; i < length; i++) {
            this.addStringToModel(ids[i])
        }
    }

    public dispose(): void {
        this.clearBindings();
    }

    public applyBindings(element: string, bindings: string)
    public applyBindings(element: JQuery, bindings?: string)
    public applyBindings(element: string, bindings?: any)
    public applyBindings(element: JQuery, bindings?: any)
    public applyBindings(element: any, bindings?: any): JQuery {
        let $element: JQuery = $(element)
        if(isset(bindings)) {
            $element.attr('data-bind', bindings)
        }
        ko.applyBindings(this, $element[0])
        this._bindings.push($element[0])
        return $element
    }

    public removeBindings(element: string)
    public removeBindings(element: JQuery)
    public removeBindings(element: any): void {
        let $element = $(element)
        ko.removeNode($element[0])
    }

    public clearBindings(): void {
        $.each(this._bindings, (i: number, element: any): void => {
            this.removeBindings(element)
        })
        this._bindings.removeAll()
    }

}