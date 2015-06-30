module kit.fields {

    export class LabelUIField extends TextUIField {

        public className: KnockoutObservable<string> = ko.observable(null)

        constructor(id: string, value: any, required: boolean = false) {
            super(id, value, required, true)
            this.inputTemplate = "labelInputTemplate"
        }
    }
    
}