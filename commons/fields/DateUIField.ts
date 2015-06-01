module fr.fwk.knockit.fields {

    export class DateUIField extends TextUIField {

        public minDate: KnockoutObservable<Date> = ko.observable<Date>()
        public maxDate: KnockoutObservable<Date> = ko.observable<Date>()
        public date: KnockoutComputed<Date> = null

        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
                
            this.inputTemplate = "ui-field-date-template"
            
            this.minDate.subscribe((d: Date): void => {
                if(this.autoValidate()) {
                    this.validateValue();
                }
            });
            
            this.maxDate.subscribe((d: Date): void => {
                if(this.autoValidate()) {
                    this.validateValue();
                }
            });
            
            this.date = ko.computed((): Date => {
                return this.parseDate(this.value())
            })
        }
        
        public parseDate(value: string): Date {
            return utils.parseLiteralDate(value, app.i18n.getCurrentLocale())
        }

        public formatValue(value: string): string {
            var oDate_: Date = utils.parseLiteralDate(value, app.i18n.getCurrentLocale());
            if(oDate_) {
                return utils.formatDate(oDate_, app.i18n.getCurrentLocale().dateFormat);
            }
            return value;
        }
        
        public cleanFormatValue(value: string): string {
            var oDate_: Date = utils.parseLiteralDate(value, app.i18n.getCurrentLocale());
            if(oDate_) {
                return utils.formatDate(oDate_, "ddmmyyyy");
            }
            return value;
        }
        
        public isValidateValue(value: string): boolean {
            var bValid_: boolean = super.isValidateValue(value)
            if(bValid_ && !this.valueIsEmpty(value)) {
                var oDate_: Date = this.parseDate(value)
                bValid_ = oDate_ != null
            }
            return bValid_;
        }
        
        public isValidateConstraintsValue(value: string, unvalidatedConstraints?: InputUIFieldValidationConstraint[], infos?: ValidationConstraintInfos): boolean {
            var bValid_: boolean = true
            if(!this.valueIsEmpty(value)) {
                var oDate_: Date = this.parseDate(value);
                if(oDate_ != null) {
                    bValid_ = super.isValidateConstraintsValue(oDate_.getTime(), unvalidatedConstraints, infos);
                }
            
                if(bValid_) {
                    var oMinDate_ = this.minDate();
                    var oMaxDate_ = this.maxDate();
                    bValid_ = oDate_ != null
                    bValid_ = bValid_ && (!oMinDate_ || (oMinDate_.isPast(oDate_) || oMinDate_.isSameDate(oDate_)))
                    bValid_ = bValid_ && (!oMaxDate_ || (oMaxDate_.isFuture(oDate_) || oMaxDate_.isSameDate(oDate_)))
                }
            }
            
            return bValid_;
        }

    }
    
}