import { InputField } from '@webkit/form/InputField';
import { SelectField } from '@webkit/form/SelectField';
import { TextField } from '@webkit/form/TextField';

export class CodePostalField extends InputField {

    public oSelectField: SelectField
    public oTextField: TextField
    public isLoadingValues: KnockoutObservable<boolean> = ko.observable(false)
    public sourceValueName: string
    public static onSearchFn: Function
    
    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        
        super(id, value, required, readOnly)

        this.oSelectField = new SelectField(id + ".select", [], null, required, readOnly);
        this.oTextField = new TextField(id + ".text", null, false, readOnly);
        this.oTextField.inputType('tel');
        this.oTextField.setValidationRegExp(regexp.CdPost);

        this.oTextField.maxLength = 5;
        
        this.oSelectField.isEditable.dependsOn(this.isEditable);
        this.oTextField.isEditable.dependsOn(this.isEditable);
        
        this.inputTemplate = "ui-field-codepostal-template"

        this.oSelectField.isRequired.dependsOn(this.isRequired);
        this.oTextField.isRequired.dependsOn(this.isRequired);
        
        this.oSelectField.isReadOnly.dependsOn(this.isReadOnly);
        this.oTextField.isReadOnly.dependsOn(this.isReadOnly);
            
        this.oSelectField.isDisabled.dependsOn(this.isDisabled);
        this.oTextField.isDisabled.dependsOn(this.isDisabled);

        this.value.immediateSubscribe((v: any): void => {
            if(this.autoValidate()) {
                this.oTextField.value(v);
            }
        })
        
        this.isFocused = ko.computed<boolean>((): boolean => {
            return this.oTextField.isFocused() || this.oSelectField.isFocused(); 
        });
        
        this.oTextField.isFocused.immediateSubscribe((b: boolean): void => {
            if(this.oTextField.value()) {
                this.oTextField.value(this.oTextField.value().rPad('0', 5));
            }
        })

        this.oSelectField.value.subscribe((v: string): void => {
            if(this.autoValidate()) {
                this.autoValidate(false);
                this.value(v);
                this.autoValidate(true);
            }
        })
            
        this.oTextField.hasBeenVisited.subscribe((b: boolean): void => {
            if(b && !this.oTextField.hasChanged()) {
                this.hasBeenVisited(true);    
            }
        });

        this.isLoadingValues.subscribe((b: boolean): void => {
            if(!b && this.oTextField.hasBeenVisited()) {
                this.hasBeenVisited(true);
            }
        });
        
        this.oSelectField.hasBeenVisited.subscribe((b: boolean): void => {
            if(b) {
                this.hasBeenVisited(true);
            }    
        });
                       
        this.oTextField.value.immediateSubscribe((v: string): void => {
            if(this.autoValidate()) {
                if(v && v.length == 5) {
                    if(typeof(CodePostalField.onSearchFn) == "function") {
                        this.isLoadingValues(true);
                        CodePostalField.onSearchFn.call(this, v, function(choices) {
                            this.oSelectField.updateChoices(choices)
                            this.isLoadingValues(false);
                        });
                    }
                } else if(!v) {
                    this.oSelectField.updateChoices([]);
                }  
            }
        })
    }
    
    public forceValue(value: string) {
        super.forceValue(value);
        this.oTextField.applyChanges();
    }
    
    /**
     * Override cancelChanges
     */
    public cancelChanges(): void {
        this.oTextField.cancelChanges();
        this.hasBeenVisited(false);
    }
    
    /**
     * Override forceValue
     */
    public forceValues(textValue: string, listValue: string): void {
            this.autoValidate(false);
            super.forceValue(listValue);
            this.autoValidate(true);
            if((textValue != this.oTextField.value()) || !this.oSelectField.hasChoice(listValue)) {
                this.autoValidate(false);
                this.oTextField.forceValue(null);
                this.autoValidate(true);
                this.oTextField.forceValue(textValue);
                
                this.isLoadingValues.subscribeOnce((b): void => {
                    if(!b) {
                        this.oSelectField.forceValue(listValue);
                    }    
                })
            } else {
                this.oSelectField.forceValue(listValue);       
            }
    }
    
    public getTextDataValue(): string {
        return this.oTextField.dataValue();
    }
    
    public getSelectedOptionLabel(): string {
        return this.isDisabled()?null:this.oSelectField.selectedOptionText();
    }

    /**
     * Validates the value for the property.
     * @param {?(number|string)} value The value for this property.
     * @type {function({?(number|string)})}
     */
    public isValidateValue(value): boolean {
        var isValid: boolean = super.isValidateValue(value);
        return isValid
    }
    
}