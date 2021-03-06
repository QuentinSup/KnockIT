module kit.fields {

    export class ToggleUIField extends InputUIField {
    
        public textForTrue: KnockoutObservable<string>
        public textForFalse: KnockoutObservable<string>
        public valueForTrue: string = null;
        public valueForFalse: string = null;
        public isChecked: KnockoutComputed<boolean>;
        
        constructor(id: string, valueForTrue: any, valueForFalse: any, required?: boolean, readOnly?: boolean) {
            super(id, null, required, readOnly)
            // Resources Manager
            this.valueForTrue = valueForTrue;
            this.valueForFalse = valueForFalse;
            this.textForTrue    = app.i18n.getObservableString(id + '.on', '')
            this.textForFalse   = app.i18n.getObservableString(id + '.off', '')
            this.inputTemplate  = "ui-field-text-toggle"
            
            this.isChecked = ko.computed<boolean>({
                read: (): boolean => {
                        return this.value() == this.valueForTrue;
                },
                write: (b: boolean): void => {
                    this.value(b?this.valueForTrue:this.valueForFalse);     
                }
            });
            
            this.isChecked(false);
            
        }

        public isValidateValue(value): boolean {
            var isValid: boolean = false

            if ((value == this.valueForTrue) || (value == this.valueForFalse)) {
                isValid = true
            }
            return isValid
        }

    }
}