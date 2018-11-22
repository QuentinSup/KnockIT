import { NumericUIField, TNumericTypes } from '@webkit/form/NumericUIField';
import { IUIField } from '@webkit/form/InputUIField';
import { TextUIField } from '@webkit/form/TextUIField';
import { DateUIField } from '@webkit/form/DateUIField';
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

export class DateTextUIField extends NumericUIField {

    public oNextUIField: TextUIField = null;
    private dateType: DateTextFieldTypes;

    constructor (id: string, dateType: DateTextFieldTypes, oNextUIField?: TextUIField) {
        super(id + '.' + dateType.id, null, TNumericTypes.PositiveInteger, false, false);
        
        this.minLength      = dateType.minLength;
        this.maxLength      = dateType.maxLength;
        this.minimum        = dateType.minimum;
        this.maximum        = dateType.maximum;
        this.dateType       = dateType;
        this.oNextUIField   = oNextUIField;
        
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
        if(!!this.oNextUIField){
            var val_: string = $('#' + this.uid).val();
            if(this.isValidateValue(val_) && (this.value() != val_) && (CString(val_).length >= this.maxLength)) {
                $("#" + this.oNextUIField.uid).focus();
            }
        }
        return super.onKeyUpEventHandler(e);
    }
    
}

export class DateMultiFieldUIField extends DateUIField {
    
    public oTextUIFieldDay: DateTextUIField
    public oTextUIFieldMonth: DateTextUIField
    public oTextUIFieldYear: DateTextUIField
    
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
                this.oTextUIFieldDay.value(date.getDate());
                this.oTextUIFieldMonth.value(date.getMonth() + 1);
                this.oTextUIFieldYear.value(date.getFullYear());
            }
        })
        
        this.oTextUIFieldYear  = new DateTextUIField(id, DateTextFieldTypes.year);
        this.oTextUIFieldMonth = new DateTextUIField(id, DateTextFieldTypes.month, this.oTextUIFieldYear);
        this.oTextUIFieldDay   = new DateTextUIField(id, DateTextFieldTypes.day, this.oTextUIFieldMonth);
        
        this._koComputeIsLastInputValid = ko.pureComputed((): boolean => {
            var sYear_: string = this.oTextUIFieldYear.dataValue();
            var bIsValidYear_: boolean  = this.oTextUIFieldYear.isValidateValue(sYear_);
            var sMonth_: string = this.oTextUIFieldMonth.dataValue();
            var bIsValidMonth_: boolean = this.oTextUIFieldMonth.isValidateValue(sMonth_);
            var sDay_: string = this.oTextUIFieldDay.dataValue();
            var bIsValidDay_: boolean = this.oTextUIFieldDay.isValidateValue(sDay_);
            return bIsValidYear_ && bIsValidMonth_ && bIsValidDay_;
        }).extend({ throttle: 0 });
       
        this.broadcastEvents(this.oTextUIFieldYear);
        this.broadcastEvents(this.oTextUIFieldMonth);
        this.broadcastEvents(this.oTextUIFieldDay);
                    
        this.hasBeenVisited.subscribe((b: boolean): void => {
            if(!b) {
                this.oTextUIFieldDay.hasBeenVisited(false);
                this.oTextUIFieldMonth.hasBeenVisited(false);
                this.oTextUIFieldYear.hasBeenVisited(false);
            }
        });
                    
        this._koIsFocusedMainField = ko.computed((): void => {
            if(this.oTextUIFieldDay.isFocused() || this.oTextUIFieldMonth.isFocused() || this.oTextUIFieldYear.isFocused()) {
                this.isFocused(true);
            } else {
                this.isFocused(false);
            }
        });
        
        
        this._koUpdateValue = ko.computed((): void => {
            var locale: Locale = app.i18n.getCurrentLocale();
            var bIsValid_: boolean      = this._koComputeIsLastInputValid();
            var oDayValue_: number      = this.oTextUIFieldDay.dataValue();
            var oMonthValue_: number    = this.oTextUIFieldMonth.dataValue();
            var oYearValue_: number     = this.oTextUIFieldYear.dataValue();
            if(!bIsValid_) {
                if(this.oTextUIFieldDay.isEmpty() || this.oTextUIFieldMonth.isEmpty() || this.oTextUIFieldYear.isEmpty()){
                    this.value("");
                }else{
                    this.value("-");
                }
            } else {
                this.value(CString(oDayValue_).lPad('0', 2) + this.separator() + CString(oMonthValue_).lPad('0', 2) + this.separator() + oYearValue_);
            }  
        });
    }
    
    private broadcastEvents(uiField: IUIField): void {
        uiField.isEditable.dependsOn(this.isEditable);
        uiField.isRequired.dependsOn(this.isRequired);
        uiField.isReadOnly.dependsOn(this.isReadOnly);
        uiField.isDisabled.dependsOn(this.isDisabled);
    }
            
    /**
     * @Override cancelChanges
     */
    public applyChanges(): void {
        this.autoValidate(false);
        this.oTextUIFieldDay.applyChanges();
        this.oTextUIFieldMonth.applyChanges();
        this.oTextUIFieldYear.applyChanges();
        super.applyChanges();
        this.autoValidate(true);
    }
    
    /**
     * @Override cancelChanges
     */
    public cancelChanges(): void {
        this.autoValidate(false);
        this.oTextUIFieldDay.cancelChanges();
        this.oTextUIFieldMonth.cancelChanges();
        this.oTextUIFieldYear.cancelChanges();
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