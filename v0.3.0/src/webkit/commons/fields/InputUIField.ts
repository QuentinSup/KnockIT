/// <reference path="./classes/Tooltip.class.ts"/>

module fr.ca.cat.fields {

    export interface IUIField {
        isReadOnly: KnockoutSubscribable<boolean>
        isDisabled: KnockoutSubscribable<boolean>
        isRequired: KnockoutSubscribable<boolean>
        isVisible: KnockoutSubscribable<boolean>
        isEditable: KnockoutSubscribable<boolean>
        isLastInputValid: KnockoutSubscribable<boolean>
        hasChanged: KnockoutSubscribable<boolean>
        isFormValid: KnockoutSubscribable<boolean>
        isFocused: KnockoutSubscribable<boolean>
        hasBeenVisited: KnockoutSubscribable<boolean>
        hasWarns: KnockoutSubscribable<boolean>
        messages: KnockoutObservableArray<InputUIFieldMessage>
        showMessages: KnockoutSubscribable<boolean>
        applyChanges(): void
        cancelChanges(): void
        id: string
        isEmpty(): KnockoutSubscribable<boolean>
    }
    
    export class BaseUIField extends EventsBinder implements IDisposable  {
    
        public static defaultShowMessages: boolean = true
        
        /**
          * The parameter identifier.
          * @type {string}
          */
        public id: string
        /**
          * The parameter unique identifier.
          * @type {string}
          */
        public uid: string
    
        public tooltip: Tooltip        

        /**
        * The label for this property.
        * @type {ko.observable<string>}
        */
        public label: KnockoutObservable<string>
        public sub: KnockoutObservable<string>
        public formattedLabel: KnockoutComputed<string>
        public labelArgs: KnockoutObservable<any> = ko.observable<any>()
        public showLabel: KnockoutObservable<boolean> = ko.observable(true)        
        
        /* affiche un tag indiquant qu'un champ est obligatoire*/
        public showRequiredTag: KnockoutObservable<boolean> = ko.observable<boolean>(true);
        /* Libellé complémentaire pour un champ obligatoire*/
        public requiredTagLabel: KnockoutObservable<string> = ko.observable<string>("*");
        
        public validationConstraints: KnockoutObservableArray<InputUIFieldValidationConstraint>
        public unvalidatedConstraints: KnockoutObservableArray<InputUIFieldValidationConstraint> = ko.observableArray<InputUIFieldValidationConstraint>()
        public isConstraintsValid: KnockoutComputed<boolean>;
        public validationConstraintsInfos: KnockoutObservable<ValidationConstraintInfos> = ko.observable<ValidationConstraintInfos>();
        
        public messages: KnockoutObservableArray<InputUIFieldMessage> = ko.observableArray<InputUIFieldMessage>([])
        public showMessages: KnockoutObservable<boolean> = ko.observable<boolean>(BaseUIField.defaultShowMessages)
        
        public constructor(id: string, bShowLabel: boolean = true) {
        
            super();
            
            this.uid = getUID(id);
            this.id = id;
            
            this.label = app.i18n.getObservableString(id + '.label', '')
            this.sub = app.i18n.getObservableString(id + '.sub', '')
            this.tooltip = new Tooltip(this.uid + '-tooltip')
            this.tooltip.setText(this.id + '.tooltip')
                
            this.showLabel(bShowLabel);
            
            this.formattedLabel = ko.computed((): string => {
                return this.formatLabel(this.label());
            }, this)
            
            this.validationConstraints = ko.observableArray<InputUIFieldValidationConstraint>()
            this.isConstraintsValid = ko.computed<boolean>(this.validateConstraints, this);
                           
        }   
        
        public formatLabel(label: string): string {
            
            var labelArgs_: any = this.labelArgs();
            if(labelArgs_) {
                return utils.formatString(label, labelArgs_);
            }
            
            return label
        }
        
       /**
        * Add a warn constraint validation rule
        */
        public addWarnConstraint(name: string, fn: Function, messageFn?: Function): InputUIFieldValidationConstraint {
            return this.addConstraint(name, fn, messageFn, true);
        }
        
       /**
        * Add a constraint validation rule
        */
        public addConstraint(name: string, fn: Function, messageFn?: Function, isWarn: boolean = false): InputUIFieldValidationConstraint {
            var o: InputUIFieldValidationConstraint = new InputUIFieldValidationConstraint(name, fn, messageFn, isWarn)
            o.isValid = ko.computed(fn, this).extend({ throttle: 1 });
            this.validationConstraints.push(o)
            return o
        }
        
        /**
         * 
         */
        public validateConstraints(checkAlls: boolean = true): boolean {

            var isValidated_: boolean = true;
            var unvalidatedConstraints = [];
            var infos: ValidationConstraintInfos = new ValidationConstraintInfos();
            var constraintsList: InputUIFieldValidationConstraint[] = this.validationConstraints()
            for(var i: number = 0, len: number = constraintsList.length; i < len; i++) {
                var constraint = constraintsList[i]
                if(!constraint.isValid()) {
                    unvalidatedConstraints.push(constraint)
                    if(!constraint.isWarn) {
                        isValidated_ = false
                    } else {
                        infos.hasWarns = true
                    }
                    if(!checkAlls && !isValidated_) {
                        break;    
                    }
                }
            }

            this.unvalidatedConstraints(unvalidatedConstraints);
            this.validationConstraintsInfos(infos);
            
            return isValidated_;
        
        }
        
        public dispose() {
            dispose(this.formattedLabel);
        }
        
        
    }
    
    /**
     * Constraint class for input validation rules
     */
    export class InputUIFieldValidationConstraint implements IDisposable {
    
        public name: string
        public fn: Function
        public isWarn: boolean
        public messageFn: Function
        public isValid: KnockoutComputed<boolean>
        
        public constructor(name: string, fn: Function, messageFn?: Function, isWarn: boolean = false) {
            this.name = name
            this.fn = fn
            this.isWarn = isWarn
            this.messageFn = messageFn
        }
        
        public dispose(): void {
            dispose(this.isValid);
        }
        
    }
    
    export class ValidationConstraintInfos {
    
        public hasWarns: boolean = false
        
        public constructor() {}
    }
    
    /**
     * Constraint class for input validation rules
     */
    export class InputUIFieldMessage {
    
        public text: string
        public isWarn: boolean
        
        public constructor(text: string, isWarn: boolean = false) {
            this.text = text
            this.isWarn = isWarn
        }
        
    }
    
    /**
     * A value for a property.
     * @param {Property} property The property.
     * @param {?(number|string)} value The value for this property.
     * @constructor
     */
    export class InputUIField extends BaseUIField implements IUIField, IDisposable {

        /**Label template utilisé par défault*/
        public static defaultLabelTemplate: string = "ui-field-label-template";
        /**template utilisé par défault*/
        public static defaultTemplate: string ="ui-field-template";
        /**Input template utilisé par défaut*/
        public static defaultInputTemplate: string ="ui-field-input-template"
        
        /**
         * A value to not be equals to
         * @type string | array
         */
        public wrongValue: any
        /**
         * A value that indicates whether this field is read-only or read-write.
         * @type {boolean}
         */
        public isReadOnly: KnockoutObservable<boolean> = ko.observable<boolean>(false)
        public isDisabled: KnockoutObservable<boolean> = ko.observable<boolean>(false)
        public isRequired: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        public isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        public isEditable: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        public autoValidate: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        public isEmpty: KnockoutObservable<boolean> = ko.observable<boolean>(true)

        /**
        * The value that indicates whether the field is focused
        * @type {ko.observable(boolean)}
        */
        public isFocused: KnockoutObservable<boolean> = ko.observable<boolean>(false)
        /**
         * The name attribute
         */
        public name: KnockoutObservable<string> = ko.observable<any>()
            
        /**
         * The validated value for this property.
         * @type {ko.observable(?(number|string))}
         */
        public oldValue: KnockoutObservable<any> = ko.observable<any>(null)

        /**
         * The validated value for this property.
         * @type {ko.observable(?(number|string))}
         */
        public value: KnockoutSubscribable<any> = null
        /**
         * The value that indicates whether the last input is valid.
         * @type {ko.observable(boolean)}
         */
        public isLastInputValid: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        /**
         * The boolean value result controlled by an external process
         */
        public externalValidationValue: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        /**
        * The value that indicates whether the value has changed.
        * @type {ko.observable(boolean)}
        */
        public hasChanged: KnockoutComputed<boolean>
        
        public dataValue: KnockoutComputed<any>
        /**
         * The value that indicates whether the field is valid.
         * @type {ko.observable(boolean)}
         */   
        public isFormValid: KnockoutComputed<boolean>
        /**
         * The value that indicates is the field has warning messages
         * @type {ko.observable(boolean)}
         */  
        public hasWarns: KnockoutObservable<boolean> = ko.observable<boolean>(false) 
        
        /**
        * The value that indicates whether the field has been visited by user.
        * @type {ko.observable(boolean)}
        */
        public hasBeenVisited: KnockoutObservable<boolean> = ko.observable<boolean>(false)
        
        public template: string = InputUIField.defaultTemplate;
        public labelTemplate: string = InputUIField.defaultLabelTemplate;
        public inputTemplate: string = InputUIField.defaultInputTemplate;
                
        public validationRule: KnockoutObservable<string> = ko.observable<string>()
        
        public dataName: string
        
        private _onBlurEventDefer: number
        private _validationRule: IValidationRule

        public placeholder: KnockoutObservable<string>

        constructor(id: string, value: any, required: boolean = true, readOnly: boolean = false) {

            super(id)
            
            this.value = this.getValuable()
            this.dataValue = ko.computed(this.getDataValue, this)
                
            this.isReadOnly(readOnly)
            this.isRequired(required)
            
            this.oldValue(value)
            this.value(value)

            this.placeholder = app.i18n.getObservableString(id + '.placeholder', '')
            this.name = app.i18n.getObservableString(id + '.name', '')

            this.dataName = id.right(id.length - id.lastIndexOf(".") - 1)
            this.autoValidate.subscribe(function (b: boolean) {
                if (b) {
                    this.validateValue()
                }
            }, this)

            this.validationRule.subscribe(function (rule: string) {
                this.setValidationRule(rule)
                if (this.autoValidate()) {
                    this.validateValue()
                }
            }, this);
            
            this.isRequired.subscribe((b: boolean): void => {
                if (this.autoValidate()) {
                    this.validateValue()
                }
            }, this)
                
            this.isDisabled.subscribe((b: boolean): void => {
                if (this.autoValidate()) {
                    this.validateValue()
                }
            }, this)
                
            this.dataValue.immediateSubscribe((value: any): void => {
                if (this.autoValidate()) {
                    this.validateValue()
                }
                this.isEmpty(this.valueIsEmpty(value));
            }, this)
                
            this.validationConstraints.subscribe((): void => {
                if (this.autoValidate()) {
                    this.validateValue()
                }
            }, this)
                
            this.externalValidationValue.subscribe((): void => {
                if (this.autoValidate()) {
                    this.validateValue()
                }
            }, this)
            
            this.isConstraintsValid.subscribe((): void => {
                if (this.autoValidate()) {
                    this.validateValue()
                }
            }, this)
                                
            // Do not add throttle here !!
            this.hasChanged = ko.computed(this.computeHasChanged, this)
            this.isFormValid = ko.computed(this.computeIsFormValid, this)

        }
        
        public getValuable(): KnockoutSubscribable<any> {
            return ko.observable<any>(null)
        }

        public setValidationRegExp(regExp: RegExp): IValidationRule {
            return this._validationRule = regExp?new RegExpValidationRule(regExp):null
        }

        public valueIsEmpty(value): boolean {
            return (typeof (value) == "undefined") || value == null || (CString(value).trim() == "")
        }

        public isValidateValue(value): boolean {
            var isRequired:boolean = !this.isDisabled() && this.isRequired() 
            var hasValue: boolean = !this.valueIsEmpty(value)
            var b = (!isRequired) || (isRequired && hasValue)
            if (b && hasValue) {
                if(this._validationRule) {
                    b = this._validationRule.test(CString(value))
                }
            }
            
            return b
        }

        /**
        * Validation function to trigger
        * @type {function()}
        */
        public validateValue(): void {
            var value = this.value()
            var unvalidatedConstraints: InputUIFieldValidationConstraint[] = []
            var bV_: boolean = this.isValidateValue(value)
            var bC_: boolean = false 
            var infos_: ValidationConstraintInfos = new ValidationConstraintInfos()
            if(bV_) {
                bC_ = this.isConstraintsValid();
            }
            this.hasWarns(this.validationConstraintsInfos().hasWarns);
            this.isLastInputValid(bV_ && bC_ && this.externalValidationValue());
        }

        /**
         * Computes the value that indicates whether the value has changed.
         * @type {function():boolean}
         * @return boolean
         */
        private computeHasChanged(): boolean {
            return (this.oldValue() != this.value())
        }
        
        private computeIsFormValid(): boolean {
            var isDisabled_ = this.isDisabled();
            var isLastInputValid_ = this.isLastInputValid();
            return isDisabled_ || isLastInputValid_;
        }

        public getDataValue(): any {
            var isDisabled_: boolean = this.isDisabled();
            if(!isDisabled_) {
                return this.value();
            }
            return null
        }        

        /**
         * Set value and apply changes in one call
         */
        public forceValue(value): void {
            this.value(value)
            this.applyChanges()
        }

        public applyChanges(): void {
            this.oldValue(this.value())
        }

        public cancelChanges(): void {
            this.hasBeenVisited(false);
            this.forceValue(this.oldValue())
        }

        public onBlurEventHandler(e: Event): boolean {
            this._onBlurEventDefer = defer((): void => {
                this.isFocused(false);
                this.hasBeenVisited(true);
            }, 100);
            return true;
        }
        
        public onFocusEventHandler(e: Event): boolean {
            clearTimeout(this._onBlurEventDefer);
            this.isFocused(true);
            return true;
        }
        
        public dispose() {
            super.dispose();
            dispose(this.isEmpty);
            dispose(this.validationConstraints);
            dispose(this.formattedLabel);
            clearTimeout(this._onBlurEventDefer);
        }
        
    }
}