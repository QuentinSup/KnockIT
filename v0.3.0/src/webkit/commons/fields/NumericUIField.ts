module fr.ca.cat.fields {
        
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
		public text: KnockoutComputed<string>
		public static defaultInputTemplate: string ="ui-field-numeric-template";
        
        /**
         * Constructor
         */
        constructor(id: string, value: any, formatType: TNumericTypes, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
            
            this.setValidationRegExp(NumericUIField.getNumericRegExp(formatType));
            this.inputTemplate = NumericUIField.defaultInputTemplate;
            this.inputType('tel');
            this.pattern('[0-9]*'); // Permit to show numeric virtual keyboard
            
            this.text = ko.computed<string>((): string => {
                return this.formattedValue() + "&nbsp;" + this.unit();
            }).extend({ throttle: 100 });
            
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
                
                if (isValid) {
                    var numbr: number = Number(value)
                    var maxLimit: number = this.maximum;
                    if (maxLimit || maxLimit === 0) {
                        if (this.isMaximumExcluded) {
                            isValid = numbr < maxLimit;
                        } else {
                            isValid = numbr <= maxLimit;
                        }
                    }
                }
                
            }
            
            return isValid

        }
        
        /**
         * Format a value to display it
         * @param value the value to display
         * @return the formatted value
         * @override
         */
        public formatValue(value: string): string {
            if(isNaN(value)) {
                return value;
            }
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
			} else if (CString(value).trim() == "") {
                return "";
            }
            
            var n: number = Number(CString(value).replaceAll(" ", "").replaceAll(",", "."));
        	return isNaN(n)?value:CString(n.round(this.digits));
        }
        
        /**
         * Surcharge spécifique pour exclure les blancs de toute longueur.
         */
        public valueIsEmpty(value): boolean {
            return (typeof (value) == "undefined") || value == null || (CString(value)/*.trim()*/ == "")
        }
        
        /**
         * Surcharge la fonction pour retourner une valeur numérique
         */
         public getDataValue(): any {
            var v: string = super.getDataValue();
            if(isset(v) && !this.valueIsEmpty(v) && !isNaN(v)) {
                return CFloat(v);
            }
            return null;
        }   


    }
}