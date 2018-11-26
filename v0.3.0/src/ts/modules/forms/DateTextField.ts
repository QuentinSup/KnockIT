import { NumericField, TNumericTypes } from '@webkit/form/NumericField';
import { IField } from '@webkit/form/InputField';
import { TextField } from '@webkit/form/TextField';
import { DateField } from '@webkit/form/DateField';
import { Locale } from '@webkit/core/Locale.class';
    
export class DateTextFieldTypes {
    public static day: DateTextFieldTypes   = new DateTextFieldTypes("day", "dd", 1, 2, 1, 31);
    public static month: DateTextFieldTypes = new DateTextFieldTypes("month", "mm", 1, 2, 1, 12);
    public static year: DateTextFieldTypes  = new DateTextFieldTypes("year", "yyyy", 4, 4);
   
    public id: string;
    public minLength: number;
    public maxLength: number;
    public minimum: number;
    public maximum: number;
    public placeHolder: string;
    
    constructor(id: string, placeHolder: string, minLength: number, maxLength: number, minimum: number = null, maximum: number = null){
        this.id = id;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.minimum = minimum;
        this.maximum = maximum;
        this.placeHolder = placeHolder;
    }
}

export class DateTextField extends NumericField {

    public oNextField: TextField = null;
    private dateType: DateTextFieldTypes;

    constructor (id: string, dateType: DateTextFieldTypes, oNextField?: TextField) {
        super(id + '.' + dateType.id, null, TNumericTypes.PositiveInteger, false, false);
        
        this.minLength      = dateType.minLength;
        this.maxLength      = dateType.maxLength;
        this.minimum        = dateType.minimum;
        this.maximum        = dateType.maximum;
        this.dateType       = dateType;
        this.oNextField   = oNextField;
        
        this.placeholder =  app.i18n.getObservableString(dateType.placeHolder);
        
        this.isFocused.subscribe((b: boolean): void => {
            if(b) {
                try {
                    $('#' + this.uid).select();
                } catch(e) {}
            }
        });
        
    }
    
    /**
     * Format a value to display it
     * @param value the value to display
     * @return the formatted value
     * @override
     */
    public formatValue(value: string): string {
        if(!this.valueIsEmpty(value) && !isNaN(value)) {
            return CString(value).lPad("0", 2);
        }
        return super.formatValue(value);
    }
    
    /**
     * Unformat a value seized by the user
     * @param value the value seized
     * @return the unformatted value
     * @override
     */
    public cleanFormatValue(value: string): string {
        value = super.cleanFormatValue(value);
        if(this.valueIsEmpty(value)) {
            return "";
        }
        return isNaN(value)?value:CString(Number(value));
    }
    
    public onKeyUpEventHandler(e: Event): boolean {
        if(!!this.oNextField){
            let val: any = $('#' + this.uid).val();
            if(this.isValidateValue(val) && (this.value() != val) && (CString(val).length >= this.maxLength)) {
                $("#" + this.oNextField.uid).focus();
            }
        }
        return super.onKeyUpEventHandler(e);
    }
    
}

export class DateMultiFieldField extends DateField {
    
    public oTextFieldDay: DateTextField
    public oTextFieldMonth: DateTextField
    public oTextFieldYear: DateTextField
    
    public separator: KnockoutObservable<string> = ko.observable<string>()
    
    private _koUpdateValue: KnockoutComputed<void>
    private _koIsFocusedMainField: KnockoutComputed<void>
    private _koComputeIsLastInputValid: KnockoutComputed<boolean>
    private _koComputeYearIsValid: KnockoutComputed<boolean>
    private _koComputeMonthIsValid: KnockoutComputed<boolean>
    private _koComputeDayIsValid: KnockoutComputed<boolean>  
    
    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        super(id, value, required, readOnly)
        this.inputTemplate = "ui-field-date-multifield-template"
        
        var locale: Locale = app.i18n.getCurrentLocale();
        this.separator(locale.dateSeparator);
        
        this.value.immediateSubscribe((v: any): void => {
            var date: Date = utils.parseLiteralDate(v, app.i18n.getCurrentLocale())
                
            if(date){
                this.oTextFieldDay.value(date.getDate());
                this.oTextFieldMonth.value(date.getMonth() + 1);
                this.oTextFieldYear.value(date.getFullYear());
            }
        })
        
        this.oTextFieldYear  = new DateTextField(id, DateTextFieldTypes.year);
        this.oTextFieldMonth = new DateTextField(id, DateTextFieldTypes.month, this.oTextFieldYear);
        this.oTextFieldDay   = new DateTextField(id, DateTextFieldTypes.day, this.oTextFieldMonth);
        
        this._koComputeIsLastInputValid = ko.pureComputed((): boolean => {
            var sYear_: string = this.oTextFieldYear.dataValue();
            var bIsValidYear_: boolean  = this.oTextFieldYear.isValidateValue(sYear_);
            var sMonth_: string = this.oTextFieldMonth.dataValue();
            var bIsValidMonth_: boolean = this.oTextFieldMonth.isValidateValue(sMonth_);
            var sDay_: string = this.oTextFieldDay.dataValue();
            var bIsValidDay_: boolean = this.oTextFieldDay.isValidateValue(sDay_);
            return bIsValidYear_ && bIsValidMonth_ && bIsValidDay_;
        }).extend({ throttle: 0 });
       
        this.broadcastEvents(this.oTextFieldYear);
        this.broadcastEvents(this.oTextFieldMonth);
        this.broadcastEvents(this.oTextFieldDay);
                    
        this.hasBeenVisited.subscribe((b: boolean): void => {
            if(!b) {
                this.oTextFieldDay.hasBeenVisited(false);
                this.oTextFieldMonth.hasBeenVisited(false);
                this.oTextFieldYear.hasBeenVisited(false);
            }
        });
                    
        this._koIsFocusedMainField = ko.computed((): void => {
            if(this.oTextFieldDay.isFocused() || this.oTextFieldMonth.isFocused() || this.oTextFieldYear.isFocused()) {
                this.isFocused(true);
            } else {
                this.isFocused(false);
            }
        });
        
        
        this._koUpdateValue = ko.computed((): void => {
            var locale: Locale = app.i18n.getCurrentLocale();
            var bIsValid_: boolean      = this._koComputeIsLastInputValid();
            var oDayValue_: number      = this.oTextFieldDay.dataValue();
            var oMonthValue_: number    = this.oTextFieldMonth.dataValue();
            var oYearValue_: number     = this.oTextFieldYear.dataValue();
            if(!bIsValid_) {
                if(this.oTextFieldDay.isEmpty() || this.oTextFieldMonth.isEmpty() || this.oTextFieldYear.isEmpty()){
                    this.value("");
                }else{
                    this.value("-");
                }
            } else {
                this.value(CString(oDayValue_).lPad('0', 2) + this.separator() + CString(oMonthValue_).lPad('0', 2) + this.separator() + oYearValue_);
            }  
        });
    }
    
    private broadcastEvents(Field: IField): void {
        Field.isEditable.dependsOn(this.isEditable);
        Field.isRequired.dependsOn(this.isRequired);
        Field.isReadOnly.dependsOn(this.isReadOnly);
        Field.isDisabled.dependsOn(this.isDisabled);
    }
            
    /**
     * @Override cancelChanges
     */
    public applyChanges(): void {
        this.autoValidate(false);
        this.oTextFieldDay.applyChanges();
        this.oTextFieldMonth.applyChanges();
        this.oTextFieldYear.applyChanges();
        super.applyChanges();
        this.autoValidate(true);
    }
    
    /**
     * @Override cancelChanges
     */
    public cancelChanges(): void {
        this.autoValidate(false);
        this.oTextFieldDay.cancelChanges();
        this.oTextFieldMonth.cancelChanges();
        this.oTextFieldYear.cancelChanges();
        super.cancelChanges();
        this.autoValidate(true);
    }
    
    public dispose() {
        super.dispose();
        dispose(this._koUpdateValue);
        dispose(this._koIsFocusedMainField);
        dispose(this._koComputeIsLastInputValid);
        dispose(this._koComputeYearIsValid)
        dispose(this._koComputeMonthIsValid)
        dispose(this._koComputeDayIsValid)
    }

}