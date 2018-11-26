import { TextField } from '@webkit/form/TextField';

export class EmailField extends TextField {
    
    public static EMAIL_LIST_DELIMITER: string = ";"

    public allowMultiple: KnockoutObservable<boolean> = ko.observable(false)

    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        super(id, value, required, readOnly)
        //this.inputType('email');
        this.allowMultiple.subscribe((): void => {
            if (this.autoValidate()) {
                this.validateValue()
            }
        })
    }

    public isValidateValue(value): boolean {
        var b: boolean = super.isValidateValue(value)
        if (b && value) {
            value = value.replace(",", EmailField.EMAIL_LIST_DELIMITER)
            var emailsAsArray = value.split(EmailField.EMAIL_LIST_DELIMITER)
            var i, anEmail
            var emailsCount = emailsAsArray.length
            var isListValid = true
            var reg = regexp.Email

            if (!this.allowMultiple() && emailsCount > 1) {
                isListValid = false
            } else {
                for (i = 0; i < emailsCount; i++) {
                    anEmail = emailsAsArray[i];
                    if (anEmail.trim() !== '' && !reg.test(anEmail.trim())) {
                        isListValid = false
                        break;
                    }
                }
            }

            return isListValid
        }
        return b

    }
	
	public getDataValue(): string {
        var v: string = super.getDataValue();
        
        if (typeof(v) == "string") {
            return v.trim();
        }
        
        return v;
    }

}