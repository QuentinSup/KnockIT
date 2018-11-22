import { InputUIField } from '@webkit/form/InputUIField';
import { SelectUIField } from '@webkit/form/SelectUIField';
import { TextUIField } from '@webkit/form/TextUIField';

export class CodePostalUIField extends InputUIField {

    public oSelectUIField: SelectUIField
    public oTextUIField: TextUIField
    public isLoadingValues: KnockoutObservable<boolean> = ko.observable(false)
    public sourceValueName: string
    public static onSearchFn: Function
    
    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        
        super(id, value, required, readOnly)

        this.oSelectUIField = new SelectUIField(id + ".select", [], null, required, readOnly);
        this.oTextUIField = new TextUIField(id + ".text", null, false, readOnly);
        this.oTextUIField.inputType('tel');
        this.oTextUIField.setValidationRegExp(regexp.CdPost);

        this.oTextUIField.maxLength = 5;
        
        this.oSelectUIField.isEditable.dependsOn(this.isEditable);
        this.oTextUIField.isEditable.dependsOn(this.isEditable);
        
        this.inputTemplate = "ui-field-codepostal-template"

        this.oSelectUIField.isRequired.dependsOn(this.isRequired);
        this.oTextUIField.isRequired.dependsOn(this.isRequired);
        
        this.oSelectUIField.isReadOnly.dependsOn(this.isReadOnly);
        this.oTextUIField.isReadOnly.dependsOn(this.isReadOnly);
            
        this.oSelectUIField.isDisabled.dependsOn(this.isDisabled);
        this.oTextUIField.isDisabled.dependsOn(this.isDisabled);

        this.value.immediateSubscribe((v: any): void => {
            if(this.autoValidate()) {
                this.oTextUIField.value(v);
            }
        })
        
        this.isFocused = ko.computed<boolean>((): boolean => {
            return this.oTextUIField.isFocused() || this.oSelectUIField.isFocused(); 
        });
        
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
                if(v && v.length == 5) {
                    if(typeof(CodePostalUIField.onSearchFn) == "function") {
                        this.isLoadingValues(true);
                        CodePostalUIField.onSearchFn.call(this, v, function(choices) {
                            this.oSelectUIField.updateChoices(choices)
                            this.isLoadingValues(false);
                        });
                    }
                } else if(!v) {
                    this.oSelectUIField.updateChoices([]);
                }  
            }
        })
    }
    
    public forceValue(value: string) {
        super.forceValue(value);
        this.oTextUIField.applyChanges();
    }
    
    /**
     * Override cancelChanges
     */
    public cancelChanges(): void {
        this.oTextUIField.cancelChanges();
        this.hasBeenVisited(false);
    }
    
    /**
     * Override forceValue
     */
    public forceValues(textValue: string, listValue: string): void {
            this.autoValidate(false);
            super.forceValue(listValue);
            this.autoValidate(true);
            if((textValue != this.oTextUIField.value()) || !this.oSelectUIField.hasChoice(listValue)) {
                this.autoValidate(false);
                this.oTextUIField.forceValue(null);
                this.autoValidate(true);
                this.oTextUIField.forceValue(textValue);
                
                this.isLoadingValues.subscribeOnce((b): void => {
                    if(!b) {
                        this.oSelectUIField.forceValue(listValue);
                    }    
                })
            } else {
                this.oSelectUIField.forceValue(listValue);       
            }
    }
    
    public getTextDataValue(): string {
        return this.oTextUIField.dataValue();
    }
    
    public getSelectedOptionLabel(): string {
        return this.isDisabled()?null:this.oSelectUIField.selectedOptionText();
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