/// <reference path="./classes/Option.class.ts"/>

module fr.fwk.knockit.fields {
   
    export class SelectUIField extends TextUIField {

        private choices: any[] = []
        private outputValue: KnockoutSubscribable<any>
        private valuableValue: KnockoutComputed<string>
        private _valueToSet: string = null
        private _valueToForce: string = null
        private _computedOptions: KnockoutComputed<void>
        public options: KnockoutObservableArray<any> = ko.observableArray()
        public view: KnockoutObservable<string> = ko.observable('default')
        public inline: KnockoutObservable<boolean> = ko.observable<boolean>(false)
        public selectedOptionText: KnockoutObservable<string> = ko.observable<string>()
        private __optionsThrottle: number;
        private _oldChoicesStringified: string;
        
        constructor(id: string, choices: any, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
            this.inputTemplate = "ui-field-select-template"
            this.updateChoices(choices)
            
            this.options.subscribe((): void => {                
                if(this.autoValidate()) {
                    this.validateValue();
                }
            });
            
            this.options.subscribe((): void => {

                clearTimeout(this.__optionsThrottle);
                this.__optionsThrottle = defer((): void => {
                    var options_: any = this.options(); // Le computed s'enregistre sur l'observable
                    if(this._valueToForce != null) {
                        this.forceValue(this._valueToForce);
                    }
                    if(this._valueToSet != null) {
                        if(this.isValidateValue(this._valueToSet)) {
                            var v_: string = this._valueToSet;
                            this._valueToSet = null;
                            this.outputValue(v_);
                        }
                    }

                    this.value.notifySubscribers(this.value());
                });
                   
            }); //.extend({ throttle: 0 }); // Utilisation du throttle pour laisser le temps à l'IHM de rafraichir la liste des options du select
            
            this.value.immediateSubscribe((v: string): void => {
                var options_ = this.options();
                var option_ = options_[this.choices.indexOf(v)];
                this.selectedOptionText(option_?option_.text():'');
                if(this.choices.length == 1 && this.choices[0] == v) {
                    this.hasBeenVisited(true);
                }
            });

        }

        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        public isValidateValue(value): boolean {
            var isValid: boolean = super.isValidateValue(value);
            if(isValid && !this.valueIsEmpty(value)) {
                var choices = this.choices
                if (choices) {
                    isValid = (choices.indexOf(String(value)) > -1);
                }
            }

            return isValid
        }
        
        
        public getValuable(): KnockoutSubscribable<any> {
            this.outputValue = super.getValuable();
            this.valuableValue = ko.computed<string>({
                read: function () {
                    var value: string = this.outputValue();
                    if (this.isValidateValue(value)) {
                        return value;
                    }
                    return null;
                },
                write: function (value: string) {

                    if (value != null && !this.isValidateValue(value)) {
                        this._valueToSet = value;
                        value = this.choices?this.choices[0] || null:null;
                    }
                    if(this.outputValue() != value) {
                        this.outputValue(value);
                    }                    
                    this.outputValue.notifySubscribers();
                },
                owner: this
            });
            return this.valuableValue;
        }
        
        /**
         * Set value and apply changes in one call
         */
        public forceValue(value): void {
            if(this.isValidateValue(value)) {
                super.forceValue(value);
                this._valueToForce = null;
            } else {
                this.oldValue(value);
                this.value(value);
                this._valueToForce = value;
            }
        }
        
        /**
         * Construit une liste d'éléments Option
         */
        public getListOfOptions(newChoices: any): Option[] {
            var options: any[]
            options = []

            if (newChoices) {
                if (!$.isArray(newChoices)) {
                
                    $.each(newChoices, (v, k): void => {
                        options.push(new Option(CString(v).trim(), CString(k).trim()))
                    });

                } else {
                    var choicesCount = newChoices.length
                    for (var choiceIndex: number = 0; choiceIndex < choicesCount; choiceIndex++) {
                        var choice = CString(newChoices[choiceIndex]).trim();
                        options.push(new Option(choice, choice, this.id + '.list[' + choice + ']'))
                    }
                }
            }

            return options;
        }

        public addChoices(newChoices: any): void {
            var options: Option[] = this.getListOfOptions(newChoices);
            var options_: Option[] = this.options().concat(options);
            this.updateListOfChoices(options_);
            this.options(options_);

        }

        public removeChoices(oldchoices: any): void {

            var options: any[], optionsList: Option[]
            options = []
            optionsList = this.options()

            if (oldchoices) {
                if (!$.isArray(oldchoices)) {
                
                    $.each(oldchoices, (v, k): void => {
                        var opt: Option = optionsList.findBy('value', v);
                        if(opt) {
                            options.push(opt)
                        }
                    });

                } else {
                    var choicesCount = oldchoices.length
                    for (var choiceIndex = 0; choiceIndex < choicesCount; choiceIndex++) {
                        var choice = oldchoices[choiceIndex]
                        var opt: Option = optionsList.findBy('value', choice);
                        if(opt) {
                            options.push(opt)
                        }
                    }
                }
            }

            this.options().removeAll(options)     
            this.updateListOfChoices();       
            this.options.valueHasMutated()

        }

        /**
         * Update this select with the given choices.
         */
        public updateChoices(newChoices: any): void {

            var strNewChoices = JSON.stringify(newChoices)
            
            if(this._oldChoicesStringified == strNewChoices) {
                return;
            }
            
            this._oldChoicesStringified = strNewChoices;
            
            var value_: string = null;
            if(this._valueToSet == null && this._valueToForce == null) {
                value_ = this.outputValue();
            }
            
            this.options().removeAll()
            this.choices.removeAll()

            this.addChoices(newChoices)
                
            if(value_ != null) {
                this.outputValue(value_);
            }

        }

        public viewRadiosOptionClickFunction(option: Option, e: any): void {
              this.value(option.value)
              this.hasBeenVisited(true)
        }
        
        
        /**
         * Retourne si la liste contient la valeur
         */
        public hasChoice(choice: string[]): boolean
        public hasChoice(choice: string): boolean
        public hasChoice(choice: any): boolean {
            return this.choices.contains(choice);
        }
        
        public sort(compareFn?: (a: Option, b: Option) => number): Option[] {
            
            if(!compareFn) {
                compareFn = function(a: Option, b: Option): number {
                    return a.text().toLowerCase() > b.text().toLowerCase()?1:-1
                }
            }
            
            var oOptionsList_ = this.options()
            var returnValue: Option[] = oOptionsList_.sort(compareFn)
            
            this.updateListOfChoices();
            this.options.valueHasMutated()
                
            return returnValue
        }
        
        private updateListOfChoices(options: Option[] = this.options()): void {
            this.choices = [];
            
            for(var i: number = 0, len: number = options.length; i < len; i++) {
                var option_: Option = options[i];
                this.choices.push(option_.value);
            }
        }
        
        public listCount(): number {
            return this.choices.length;
        }
 
        /**
         * Sélectionne la première page.
         */
        public selectFirst(): void {
            if(this.listCount() > 0) {
                this.value(this.options()[0].value);
            }
        }
        
        public dispose(): void {
            super.dispose();
            dispose(this.valuableValue);
            dispose(this._computedOptions);
        }

    }
    
}