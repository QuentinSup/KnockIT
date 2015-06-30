module kit.fields {

    export class CodePostalUIField extends InputUIField {

        public oSelectUIField: SelectUIField
        public oTextUIField: TextUIField
        public isLoadingValues: KnockoutObservable<boolean> = ko.observable(false)
        public sourceValueName: string
        public static onSearchFn: Function
        
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            
            super(id, value, required, readOnly)

            this.oSelectUIField = new SelectUIField(id + ".select", [], null, required, readOnly);
            this.oTextUIField = new TextUIField(id + ".text", "", false, readOnly);
            this.oTextUIField.setValidationRegExp(regexp.CdPost);

            this.oTextUIField.maxLength = 5;
            
            this.oSelectUIField.isEditable.dependsOn(this.isEditable);
            this.oTextUIField.isEditable.dependsOn(this.isEditable);
            
            this.inputTemplate = "ui-field-codepostal-template"

            this.isRequired.immediateSubscribe((b: boolean): void => {
                this.oTextUIField.isRequired(b)
                this.oSelectUIField.isRequired(b)
            })

            this.isReadOnly.immediateSubscribe((b: boolean): void => {
                this.oSelectUIField.isReadOnly(b) 
                this.oTextUIField.isReadOnly(b)
            })
                
            this.isDisabled.immediateSubscribe((b: boolean): void => {
                this.oSelectUIField.isDisabled(b) 
                this.oTextUIField.isDisabled(b)
            })

            this.value.immediateSubscribe((v: any): void => {
                if(this.autoValidate()) {
                    this.oTextUIField.value(v);
                }
            })
            
            this.oTextUIField.isFocused.immediateSubscribe((b: boolean): void => {
                if(this.oTextUIField.value()) {
                    this.oTextUIField.value(this.oTextUIField.value().rPad('0', 5));
                }
            })

            this.oSelectUIField.value.subscribe((v: string): void => {
                if(this.autoValidate()) {
                    this.autoValidate(false);
                    this.value(v);
                    this.autoValidate(true);
                }
            })
                
            this.oTextUIField.hasBeenVisited.subscribe((b: boolean): void => {
                if(b && !this.oTextUIField.hasChanged()) {
                    this.hasBeenVisited(true);    
                }
            });

            this.isLoadingValues.subscribe((b: boolean): void => {
                if(!b && this.oTextUIField.hasBeenVisited()) {
                    this.hasBeenVisited(true);
                }
            });
            
            this.oSelectUIField.hasBeenVisited.subscribe((b: boolean): void => {
                if(b) {
                    this.hasBeenVisited(true);
                }    
            });
                           
            this.oTextUIField.value.immediateSubscribe((v: string): void => {
                if(this.autoValidate()) {
                    this.isLoadingValues(true);
                    if(typeof(CodePostalUIField.onSearchFn) == "function") {
                        CodePostalUIField.onSearchFn.call(this, v, function(choices) {
                            this.oSelectUIField.updateChoices(choices)
                            this.isLoadingValues(false);
                        });
                    }
                }
            })
                
        }
        
        public forceValue(value: string) {
            super.forceValue(value);
            this.oTextUIField.applyChanges();
        }
        
        /**
         * Override forceValue
         */
        public forceValues(textValue: string, listValue: string): void {
            this.autoValidate(false);
            super.forceValue(listValue);
            this.autoValidate(true);
            this.oTextUIField.forceValue(textValue);
            this.isLoadingValues.subscribeOnce((b): void => {
                if(!b) {
                    this.oSelectUIField.forceValue(listValue);
                }    
            })
        }
        
        public getTextDataValue(): string {
            return this.oTextUIField.dataValue();
        }

        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        public isValidateValue(value): boolean {
            var isValid: boolean = super.isValidateValue(value);

            if(isValid && this.oSelectUIField /* prevent validation by constructor */) {
                isValid = this.oSelectUIField.isLastInputValid()
            }

            return isValid
        }
        
    }

}