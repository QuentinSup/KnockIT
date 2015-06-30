module kit.fields {

    export class ToggleUIField extends InputUIField {
    
        public textForTrue: KnockoutObservable<string>
        public textForFalse: KnockoutObservable<string>

        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
            // Resources Manager
            this.textForTrue = app.i18n.getObservableString("yes")
            this.textForFalse = app.i18n.getObservableString("no")
            this.inputTemplate = "checkboxInputTemplate"
        }

        public isValidateValue(value): boolean {
            var isValid: boolean = false

            if ((value === "true") || (value === true) || (value === "false") || (value === false)) {
                isValid = true
            }
            return isValid
        }

        public checked(): boolean {
            return !this.isReadOnly()
        }

    }
}