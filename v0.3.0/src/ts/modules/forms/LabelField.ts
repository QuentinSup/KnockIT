import { InputField } from '@webkit/form/InputField';

export class LabelField extends InputField {

    public className: KnockoutObservable<string> = ko.observable(null)

    constructor(id: string, value: any, required: boolean = false) {
        super(id, value, required, true)
        this.inputTemplate = "labelInputTemplate"
    }
}