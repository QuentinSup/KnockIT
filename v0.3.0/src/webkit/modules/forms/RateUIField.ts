import { NumericUIField, TNumericTypes } from '@webkit/form/NumericUIField';
    
export class RateUIField extends NumericUIField {

    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        super(id, value, TNumericTypes.PositiveDouble, required, readOnly)
    	this.minimum = 0
    	this.digits = 2
        this.unit('%');
    }
            
}