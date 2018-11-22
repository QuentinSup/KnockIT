import { InputUIField } from './InputUIField';
import { LabelUIField } from './LabelUIField';
import { SelectUIField } from './SelectUIField';
import { TextUIField } from './TextUIField';
import { Option } from './classes/Option.class';


export interface IValidationRule {
	test(value: any): boolean
}

export class RegExpValidationRule implements IValidationRule {
    private regExp: RegExp
    constructor(regExp: RegExp) {
		this.regExp = regExp
    }
	public test(value: any): boolean {
		if (value && value != "") {
			if (this.regExp.test(value)) {
                // the value is valid
                return true
            } else {
                // the value is not valid
                return false
            }
		}
        return true
    }

}


export class ProgressBarUIField extends InputUIField {

    constructor(id: string, value: any) {
        super(id, value, false)
        this.inputTemplate = "progressBarTemplate"

        this.value.immediateSubscribe((v: number): void => {
            this.refresh()
        })

    }

    public refresh(): void {
        $('#' + this.uid + '-progressbar').progressbar({ value: this.value() })
    }

}

export class StatusUIField extends LabelUIField {

    public isRunning: KnockoutObservable<boolean> = ko.observable(false)

    constructor(id: string, value: any) {
		super(id, value, false)
        this.inputTemplate = "statusInputTemplate"

        this.isRunning.immediateSubscribe((b: boolean): void => {
            defer((): void => {
                if (b) {
                    $('#' + this.uid + '-progressbar').progressbar(<any>{ value: false });
                } else {
                    $('#' + this.uid + '-progressbar').progressbar('destroy');
                }
            });
        })
        
    }
}


export class CustomSelectUIField extends InputUIField {

    public static CUSTOM_CHOICE: string = "custom:"

    public options: KnockoutObservableArray<any> = ko.observableArray()
    public isCustomChoiceSelected: KnockoutObservable<boolean> = ko.observable(false)
    public selectUIField: KnockoutObservable<SelectUIField> = ko.observable<SelectUIField>()
    public customUIField: KnockoutObservable<InputUIField> = ko.observable<InputUIField>()

    constructor(id: string, choices: any, value: any, required?: boolean, readOnly?: boolean, customUIField?: InputUIField) {
        
        super(id, value, required, readOnly)

        this.selectUIField(new SelectUIField(id, null, null, required, readOnly))

        if(!customUIField) {
            customUIField = new TextUIField(CustomSelectUIField.CUSTOM_CHOICE + id, "", false, true)
        }
        this.customUIField(customUIField)

        // Use custom update choices
        this.updateChoices(choices)

        this.template = "customRowPropertyTemplate"
        this.selectUIField.immediateSubscribe((uiField: SelectUIField): void => {
            // TODO : unsubscription
            uiField.value.subscribe((v: any): void => {
                this.isCustomChoiceSelected(v == CustomSelectUIField.CUSTOM_CHOICE)
                if(!this.isCustomChoiceSelected()) {
                    this.value(v)
                } else {
                    this.value(CustomSelectUIField.CUSTOM_CHOICE + this.customUIField().value())
                }
            })
        })

        this.customUIField.immediateSubscribe((uiField: SelectUIField): void => {
            // TODO : unsubscription
            uiField.value.subscribe((v: any): void => {
                if(this.isCustomChoiceSelected()) {
                    this.value(CustomSelectUIField.CUSTOM_CHOICE + v)
                }
            })
        })

        this.isRequired.immediateSubscribe((b: boolean): void => {
            this.selectUIField().isRequired(true) 
        })

        this.isReadOnly.immediateSubscribe((b: boolean): void => {
            this.selectUIField().isReadOnly(b) 
            this.customUIField().isReadOnly(!this.isCustomChoiceSelected() || b)
        })

        this.isCustomChoiceSelected.immediateSubscribe((b: boolean): void => {
            this.customUIField().isRequired(b)
            this.customUIField().isReadOnly(this.isReadOnly() || !b)
        })

        this.value.immediateSubscribe((v: any): void => {
            if(this.isCustomValue(v)) {
                this.selectUIField().value(CustomSelectUIField.CUSTOM_CHOICE)
                this.customUIField().value(this.cleanCustomValue(v))
            } else {
                this.selectUIField().value(v)
            }
        })

    }

    public isCustomValue(v: string): boolean {
        return v && v.indexOf(CustomSelectUIField.CUSTOM_CHOICE) != -1
    }

    public cleanCustomValue(v: string): string {
        if(this.isCustomValue(v)) {
            return v.substring(CustomSelectUIField.CUSTOM_CHOICE.length);
        }
        return v
    }

    public getCustomOption(): Option {
        return this.selectUIField().options().findBy('value', CustomSelectUIField.CUSTOM_CHOICE)    
    }

    public hasCustomOption(): boolean {
        return this.getCustomOption() != null
    }

    private addRemoveCustomChoice(bAdd: boolean): void {
        
        if(bAdd) {
            if(!this.hasCustomOption()) {
                this.selectUIField().addChoices([CustomSelectUIField.CUSTOM_CHOICE])
            }
        } else {
            var opt: Option = this.getCustomOption()
            if(opt) {
                this.selectUIField().removeChoices([CustomSelectUIField.CUSTOM_CHOICE])
            }
        }
    }

    /**
     * Validates the value for the property.
     * @param {?(number|string)} value The value for this property.
     * @type {function({?(number|string)})}
     */
    public isValidateValue(value): boolean {
        var isValid: boolean = super.isValidateValue(value);

        if(isValid && this.selectUIField /* prevent validation by constructor */) {
            isValid = this.selectUIField().isLastInputValid() && this.customUIField().isLastInputValid()
        }

        return isValid
    }

    /**
     * Update this select with the given choices.
     */
    public updateChoices(newChoices: any): void {
        
        this.selectUIField().updateChoices(newChoices)
        this.addRemoveCustomChoice(true)
        
    }

}


export class AutoCompleteUIField extends TextUIField {

    public valuesList: KnockoutObservableArray<any> = ko.observableArray()

    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
		super(id, value, required, readOnly)
        this.inputTemplate = "autoCompleteInputTemplate"
    }
}

export class SelectCondUIField extends SelectUIField {

    public condUIField: InputUIField
    public condValue: string
    
    constructor(id: string, condUIField: InputUIField, condValue: string, choices: any, value: any, required?: boolean, readOnly?: boolean) {
        super(id, choices, value, required, readOnly)
        this.condUIField = condUIField
        this.condValue = condValue
        this.inputTemplate = "ui-field-selectcond-template"
                   
        this.condUIField.value.immediateSubscribe((v: any): void => {
            this.isReadOnly(v != this.condValue)
            this.validateValue()
        })
        
        this.isReadOnly.subscribe((b: boolean): void => {
            if(this.autoValidate()) {
                this.validateValue()
            }
        })
            
        this.value.subscribe((v: any): void => {
            if(v) {
                this.condUIField.value(this.condValue);
            }
        })

    }
    
    /**
     * Validates the value for the property.
     * @param {?(number|string)} value The value for this property.
     * @type {function({?(number|string)})}
     */
    public isValidateValue(value): boolean {
        if(!this.condUIField) return false;
        var isValid: boolean = super.isValidateValue(value);
        if(!this.condUIField.value() || !this.isReadOnly()) {
            return isValid
        }
        return true
    }
    
}



export class ActionUIField extends InputUIField {

    public action: Function

    constructor(id: string, label: string, action: Function, context?: any, readOnly?: boolean) {
		super(id, null, false, readOnly)

        this.inputTemplate = "buttonTemplate"
        // Resources Manager
        this.value = app.i18n.getObservableString(label)

        if (context) {
			this.action = (vm, jqEvent) => {
				action.call(context, vm, jqEvent);
			}
        } else {
			this.action = action
        }
	}
}