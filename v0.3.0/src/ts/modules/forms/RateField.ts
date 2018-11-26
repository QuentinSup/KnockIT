import { NumericField, TNumericTypes } from '@webkit/form/NumericField';
    
export class RateField extends NumericField {

    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        super(id, value, TNumericTypes.PositiveDouble, required, readOnly)
    	this.minimum = 0
    	this.digits = 2
        this.unit('%');
    }
            
}