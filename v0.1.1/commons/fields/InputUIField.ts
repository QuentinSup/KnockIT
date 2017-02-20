/// <reference path="./classes/Tooltip.class.ts"/>

module kit.fields {

    export interface IUIField {
        isReadOnly: KnockoutObservable<boolean>
        isDisabled: KnockoutObservable<boolean>
        isRequired: KnockoutObservable<boolean>
        isVisible: KnockoutObservable<boolean>
        isEditable: KnockoutObservable<boolean>
        isLastInputValid: KnockoutObservable<boolean>
        hasChanged: KnockoutComputed<boolean>
        isFormValid: KnockoutComputed<boolean>
        isFocused: KnockoutObservable<boolean>
        hasBeenVisited: KnockoutObservable<boolean>
        hasWarns: KnockoutObservable<boolean>
        messages: KnockoutObservableArray<InputUIFieldMessage>
        showMessages: KnockoutObservable<boolean>
        applyChanges(): void
        cancelChanges(): void
        id: string
        isEmpty(): boolean
    }
    
    export class BaseUIField implements IDisposable  {
    
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
        public formattedLabel: KnockoutComputed<string>
        public labelArgs: KnockoutObservable<any> = ko.observable<any>()
        public showLabel: KnockoutObservable<boolean> = ko.observable(true)

        public constructor(id: string, bShowLabel: boolean = true) {
        
            this.uid = getId(id);
            this.id = id;
            
            this.label = app.i18n.getObservableString(id + '.label', '')
            this.tooltip = new Tooltip(this.uid + '-tooltip')
            this.tooltip.setText(this.id + '.tooltip')
                
            this.showLabel(bShowLabel);
            
            this.formattedLabel = ko.computed((): string => {
                return this.formatLabel(this.label());
            }, this)
                           
        }   
        
        public formatLabel(label: string): string {
            
            var labelArgs_: any = this.labelArgs();
            if(labelArgs_) {
                return utils.formatString(label, labelArgs_);
            }
            
            return label
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

        public static defaultShowMessages: boolean = true
        
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
        public isEmpty: KnockoutComputed<boolean>
        public messages: KnockoutObservableArray<InputUIFieldMessage> = ko.observableArray<InputUIFieldMessage>([])
        public showMessages: KnockoutObservable<boolean> = ko.observable<boolean>(InputUIField.defaultShowMessages)
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
            
        public template: string = "ui-field-template"
        public labelTemplate: string = "ui-field-label-template"
        public inputTemplate: string = "ui-field-input-template"
                
        public validationRule: KnockoutObservable<string> = ko.observable<string>()
        public validationConstraints: KnockoutObservableArray<InputUIFieldValidationConstraint> = ko.observableArray<InputUIFieldValidationConstraint>()
        public unvalidatedConstraints: KnockoutObservableArray<InputUIFieldValidationConstraint> = ko.observableArray<InputUIFieldValidationConstraint>()
        
        public dataName: string
        
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
                                
            // Do not add throttle here !!
            this.hasChanged = ko.computed(this.computeHasChanged, this)
            this.isEmpty = ko.computed(this.computeIsEmpty, this)
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
            var value = this.dataValue()
            var unvalidatedConstraints: InputUIFieldValidationConstraint[] = []
            var bV_: boolean = this.isValidateValue(value)
            var bC_: boolean = false 
            var infos_: ValidationConstraintInfos = new ValidationConstraintInfos()
            if(bV_) {
                bC_ = this.isValidateConstraintsValue(value, unvalidatedConstraints, infos_)
            }
            this.hasWarns(infos_.hasWarns);
            this.unvalidatedConstraints(unvalidatedConstraints)
            this.isLastInputValid(bV_ && bC_ && this.externalValidationValue())
        }

        /**
         * Computes the value that indicates whether the value has changed.
         * @type {function():boolean}
         * @return boolean
         */
        private computeHasChanged(): boolean {
            return (this.oldValue() != this.value())
        }
        
        private computeIsEmpty(): boolean {
            var value: any = this.value()
            return this.valueIsEmpty(value)
        }
        
        private computeIsFormValid(): boolean {
            var isDisabled_ = this.isDisabled();
            var isLastInputValid_ = this.isLastInputValid();
            return isDisabled_ || isLastInputValid_;
        }
        
        /**
         * 
         */
        public isValidateConstraintsValue(value: any, unvalidatedConstraints?: InputUIFieldValidationConstraint[], infos: ValidationConstraintInfos = new ValidationConstraintInfos()): boolean {
            var checkAlls: boolean = true
            var isValidated_: boolean = true;
            
            if(!isset(unvalidatedConstraints)) {
                checkAlls = false
                unvalidatedConstraints = []
            }
            
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
                    if(!isValidated_ && !checkAlls) {
                        return false
                    }
                }
            }
            return isValidated_;
        
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
            o.isValid.subscribe((): void => {
                this.validateValue();
            });
            this.validationConstraints.push(o)
            return o
        }
        
        public getDataValue(): string {
            if(!this.isDisabled()) {
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
            this.forceValue(this.oldValue())
        }
        
        public dispose() {
            super.dispose();
            dispose(this.isEmpty);
            dispose(this.validationConstraints);
            dispose(this.formattedLabel);
        }
        
    }
}