module kit.fields {

    export enum TTextCase {
        none,
        upper,
        lower,
        proper
    }
    
    export class TextUIField extends InputUIField {

        public maxLength: number = 1000
        public minLength: number = 0

        /**
         * The formatted Value
         */
        public formattedValue: KnockoutComputed<string>
        public hasTextChanged: KnockoutComputed<boolean>
        public pattern: KnockoutObservable<string> = ko.observable<string>();
        public useFormat: KnockoutObservable<boolean> = ko.observable<boolean>(true);
        
        public defaultAutoValidationDelay: number = 2000;
        
        private _autoValidationDelay: number = this.defaultAutoValidationDelay;
        private _previousAutoValidationTimeset: number
        private _autoValidationTimecount: number
        private _autoValidationCountset: number
        private _autoValidationDelayTimeout: number
        private _autoValidationCoeff: number = 1.50
        
        public autoTrim: KnockoutObservable<boolean> = ko.observable<boolean>(true);
        public textCase: KnockoutObservable<TTextCase> = ko.observable(TTextCase.none);
        public inputType: KnockoutObservable<string> = ko.observable<string>('text'); //=> Disabled because of bug on IE8 when settings 'type' attribute
        public valueUpdateOn: KnockoutObservable<string> = ko.observable<string>('change')

        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
            this.inputTemplate = "ui-field-text-template"
            this.hasTextChanged = ko.computed(this.computeHasTextChanged, this)
            this.formattedValue = ko.computed({
                read: (): string => {
                    if(this.isFocused()) {
                        return this.value()
                    }
                    return this.useFormat()?this.formatValue(this.dataValue()):this.dataValue();
                },
                write: (v: string): void => {
                    this.value(v)
                }
            }, this)

            this.value.subscribe((v: string): void => {
                this._updateValue(v);
                if(!this.hasBeenVisited() && this.isFocused()) {
                    defer((): void => {
                        this.hasBeenVisited(true);
                    });
                }
            });
           
            this.isFocused.subscribe((v: boolean): void => {
                if(!v) {
                    this.validateValue();
                }
            });
        
            this.textCase.immediateSubscribe((v: TTextCase): void => {
                this._updateValue();
            });

            this.autoTrim.subscribe((b: boolean): void => {
                this._updateValue();        
            });
            
        }
        
        private _updateValue(v?: string): void {
            var sCurrentValue_: string = v || this.value();
            var sNewValue_: string = this.transform(sCurrentValue_);
            if(sNewValue_ != sCurrentValue_) {
                this.value(sNewValue_);   
            }       
        }
        
        public transform(value: string): string {
            if(!value || typeof(value) != "string") {
                return value;
            }
            
            if(this.autoTrim()) {
                value = value.trim();    
            }
            
            switch(<any>this.textCase()) {
                case TTextCase.upper: 
                case TTextCase[TTextCase.upper]: return value.toUpperCase();
                case TTextCase.lower: 
                case TTextCase[TTextCase.lower]: return value.toLowerCase();
                case TTextCase.proper: 
                case TTextCase[TTextCase.proper]: return value.toProperCase();   
            }
            return value;
        }
    
        public formatValue(value: string): string {
            return value
        }
                
        public cleanFormatValue(value: string): string {
            return value
        }
        
        public getDataValue(): string {
            var v: string = super.getDataValue()
            if(isset(v)) {
                return CString(this.cleanFormatValue(v))
            }
            return null;
        }   

        public isValidateValue(value): boolean {
            var b: boolean = super.isValidateValue(value)
            if (b && !this.valueIsEmpty(value)) {
                value = CString(value);
                if ((this.minLength && value.length < this.minLength) || (this.maxLength && value.length > this.maxLength)) {
                    b = false
                }
            }
            return b
        }
        
        private computeHasTextChanged(): boolean {
            var oldValue = '' + (this.oldValue() == null || this.oldValue() == undefined ? '' : this.oldValue())
            var value = '' + (this.value() == null || this.value() == undefined ? '' : this.value())
            return (oldValue != value)
        }
        
        /**
         * Override
         */
        public onFocusEventHandler(e: Event): boolean {
            this._autoValidationCountset = 1;
            this._autoValidationTimecount = this.defaultAutoValidationDelay;
            this._autoValidationDelay = this.defaultAutoValidationDelay;
            return super.onFocusEventHandler(e);
        }
        
        public onBlurEventHandler(e: Event): boolean {
            clearTimeout(this._autoValidationDelayTimeout);
            return super.onBlurEventHandler(e);
        }
        
        public onKeyDownEventHandler(e: Event): boolean {
            var t_: number = new Date().getTime();
            if(this._previousAutoValidationTimeset > 0) {
                var lDiff_: number = t_ - this._previousAutoValidationTimeset;
                if(lDiff_ > 50 && lDiff_ <= this._autoValidationDelay * 2) {
                    this._autoValidationCountset++;
                    this._autoValidationTimecount += lDiff_;
                    this._autoValidationDelay = this._autoValidationTimecount / this._autoValidationCountset * this._autoValidationCoeff;
                }
            }
            this._previousAutoValidationTimeset = t_;
            clearTimeout(this._autoValidationDelayTimeout);
            return true;
        }
        
        public onKeyUpEventHandler(e: Event): boolean {
            clearTimeout(this._autoValidationDelayTimeout);
            this._autoValidationDelayTimeout = defer((): void => {
                defer((): void => {
                    if(this.isValidateValue($(e.target).val())) {
                        $(e.target).triggerHandler('change');    
                    } else {
                        this._autoValidationDelayTimeout = defer((): void => {
                            $(e.target).triggerHandler('change');    
                        }, this.defaultAutoValidationDelay);
                    }
                });
            }, this._autoValidationDelay);
            return true;            
        }

        public dispose() {
            super.dispose();
            dispose(this.formattedValue);
        }
    }
    
}