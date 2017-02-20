module kit.fields {
    
    import Locale = manager.Locale
    
    export enum TNumericTypes {
        Integer,
        PositiveInteger,
        Double,
        PositiveDouble
    }
    
    export class NumericUIField extends TextUIField {

		public locale: KnockoutObservable<Locale> = ko.observable<Locale>()

        public minimum: number = null
        public maximum: number = null
        public isMinimumExcluded: boolean = false
        public isMaximumExcluded: boolean = false
        public unit: KnockoutObservable<string> = ko.observable<string>()
		public digits: number = 2
		
        /**
         * Constructor
         */
        constructor(id: string, value: any, formatType: TNumericTypes, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
            
            this.setValidationRegExp(NumericUIField.getNumericRegExp(formatType))
            this.inputTemplate = "ui-field-numeric-template"
            //this.inputType('number');
        }

        /**
         * Get the reg expression from a format type
         * @param the format type
         * @return the RegExp or undefined
         */
        private static getNumericRegExp(formatType: TNumericTypes): RegExp {
            switch (formatType) {
                case TNumericTypes.Integer: return regexp.Integer
                case TNumericTypes.PositiveInteger: return regexp.PositiveInteger
                case TNumericTypes.Double: return regexp.Double
                case TNumericTypes.PositiveDouble: return regexp.PositiveDouble
            }
        }

        /**
         * Check if the value is validated, included commons controls
         * @param value the value to check
         * @return true or false
         * @override
         */
        public isValidateValue(value): boolean {

            if(!super.isValidateValue(value)) {
            	return false;
            }
            
            var isValid: boolean = true;

            if (!this.valueIsEmpty(value)) {
                if(!is_numeric(value)) {
            	   isValid = false;
                }
            }
            
            return isValid

        }
        
        /**
         * Check constraints
         */
        public isValidateConstraintsValue(value: any, unvalidatedConstraints?: InputUIFieldValidationConstraint[], infos?: ValidationConstraintInfos): boolean {
        
            if(!super.isValidateConstraintsValue(value, unvalidatedConstraints, infos)) {
                return false;
            }
            
            var isValid: boolean = true;
            
            if(this.valueIsEmpty(value)) {
               return true;
            } 
            
            var numbr: number = Number(value)
                    
            var minLimit: number = this.minimum;
            if (minLimit || minLimit === 0) {
                if (this.isMinimumExcluded) {
                    isValid = numbr > minLimit;
                } else {
                    isValid = numbr >= minLimit;
                }
            }

            if (isValid) {
                var maxLimit: number = this.maximum;
                if (maxLimit || maxLimit === 0) {
                    if (this.isMaximumExcluded) {
                        isValid = numbr < maxLimit;
                    } else {
                        isValid = numbr <= maxLimit;
                    }
                }
            }

            return isValid;
        
        }
        
        /**
         * Format a value to display it
         * @param value the value to display
         * @return the formatted value
         * @override
         */
        public formatValue(value: string): string {
        	if(this.locale && !this.valueIsEmpty(value)) {
        		return utils.formatDecimal(value, this.digits, this.locale());
        	}
            return value;
        }
        
        /**
         * Unformat a value seized by the user
         * @param value the value seized
         * @return the unformatted value
         * @override
         */
        public cleanFormatValue(value: string): string {
            if(this.valueIsEmpty(value)) {
                return value;
            }
            var n: number = Number(CString(value).replaceAll(" ", "").replaceAll(",", "."));
        	return isNaN(n)?value:CString(n.round(this.digits));
        }

    }
}