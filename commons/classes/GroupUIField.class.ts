module fr.fwk.knockit {

    import IUIField = fields.IUIField
    import BaseUIField = fields.BaseUIField
    import InputUIFieldMessage = fields.InputUIFieldMessage
    
    export class GroupUIField extends BaseUIField implements IUIField, IDisposable {
        
        public oListOfUIField: KnockoutObservableArray<IUIField> = ko.observableArray<IUIField>()
        
        public isLastInputValid: KnockoutComputed<boolean>
        public isDisabled: KnockoutComputed<boolean>
        public isReadOnly: KnockoutComputed<boolean>
        public isRequired: KnockoutComputed<boolean>
        public isEditable: KnockoutComputed<boolean>
        public isVisible: KnockoutComputed<boolean>
        public isFormValid: KnockoutComputed<boolean>
        public hasChanged: KnockoutComputed<boolean>
        public hasWarns: KnockoutComputed<boolean>
        public isEmpty: KnockoutComputed<boolean>
        public isFocused: KnockoutComputed<boolean>
        public messages: KnockoutObservableArray<InputUIFieldMessage> = ko.observableArray<InputUIFieldMessage>();
        public showMessages: KnockoutComputed<boolean>
            
        private oComputedMessages: KnockoutComputed<void>
        private hasBeenVisitedTrigger: boolean = false
        public hasBeenVisited: KnockoutObservable<boolean> = ko.observable<boolean>(false)
        
        
        public constructor(id: string, PE_oListOfUIField: IUIField[] = [], bShowLabel: boolean = true) {
                    
            super(id, bShowLabel)
            
            this.isRequired = this.createComputedBoolean('isRequired', true);
            this.isReadOnly = this.createComputedBoolean('isReadOnly', true, true);
            this.isDisabled = this.createComputedBoolean('isDisabled', true, true);
            this.isVisible  = this.createComputedBoolean('isVisible', true);
            this.isEditable = this.createComputedBoolean('isEditable', true);
            this.isFocused = this.createComputedBoolean('isFocused', true, false, 50);
            this.hasChanged = this.createComputedBoolean('hasChanged', true);
            this.hasWarns = this.createComputedBoolean('hasWarns', true);
            //this.hasBeenVisited = this.createComputedBoolean('hasBeenVisited', true);
            this.showMessages = this.createComputedBoolean('showMessages', true);
            
            this.oComputedMessages = this.createComputedMessages();
            
            this.isLastInputValid = ko.computed((): boolean => {
                return this.readBoolean('isLastInputValid', false);
            });
            
            this.isFormValid = ko.computed((): boolean => {
                return this.readBoolean('isFormValid', false);
            });
            
            this.isEmpty = ko.computed((): boolean => {
                return this.readBoolean('isEmpty', false);
            });
            
            this.isFocused.subscribe((v: boolean): void => {
                if(!v) {
                    defer((): void => {
                        this.hasBeenVisited(true);
                    });
                }
            });
            
            this.oListOfUIField(PE_oListOfUIField)
                
        }
        
        public addUIField(PE_oUIField: IUIField): void {
            this.oListOfUIField.push(PE_oUIField);
        }
        
        private createComputedBoolean(subscribableName: string, testValue: boolean, allCombined: boolean = false, throttle: number = -1): KnockoutComputed<any> {
            return ko.computed({
                    read:   (): boolean => {
                                return this.readBoolean(subscribableName, testValue, allCombined);
                            },
                    write:  (b: boolean) => {
                                this.writeBoolean(subscribableName, b);
                            }

            }).extend({ throttle: throttle });
        }
        
        private createComputedMessages(): KnockoutComputed<void> {
            return ko.computed((): void => {
                var oListOfUIFieldArray_: IUIField[] = this.oListOfUIField()
                var len_: number = oListOfUIFieldArray_.length
                var ary_: InputUIFieldMessage[] = []
    
                for(var i_: number = 0; i_ < len_; i_++) {
                    var oInputUIField_: IUIField = oListOfUIFieldArray_[i_];
                    ary_ = ary_.concat(oInputUIField_.messages());
                }
                
                this.messages(ary_);

            }, this);
        }
        
        private readBoolean(subscribableName: string, testValue: boolean = false, allCombined: boolean = false): any {
            var oListOfUIFieldArray_ = this.oListOfUIField()
            var len_: number = oListOfUIFieldArray_.length
            var isValid_: boolean = !testValue

            for(var i_: number = 0; i_ < len_; i_++) {
                var oInputUIField_ = oListOfUIFieldArray_[i_];
                 
                if(oInputUIField_[subscribableName].call(oInputUIField_) == testValue) {
                    isValid_ = (allCombined?isValid_:true) && testValue
                }
            }
            
            return isValid_;
        }
        
        private writeBoolean(subscribableName: string, v: boolean): void {
            this.runFunction(subscribableName, v);
        }
        
        private runFunction(functionName: string, args: any = null): void {
            var oListOfUIFieldArray_ = this.oListOfUIField()
            var len_: number = oListOfUIFieldArray_.length

            for(var i_: number = 0; i_ < len_; i_++) {
                var oInputUIField_ = oListOfUIFieldArray_[i_];
                 
                oInputUIField_[functionName].call(oInputUIField_, args)
                
            }      
        }
        
        public applyChanges(): void {
            this.runFunction('applyChanges');
        }
        
        public cancelChanges(): void {
            this.runFunction('cancelChanges');
        }

        /**
         * Libère correctement la mémoire
         */
        public dispose(): void {
            dispose(this.isLastInputValid);
            dispose(this.isRequired);
            dispose(this.isReadOnly);
            dispose(this.hasChanged);
            dispose(this.isVisible);
            dispose(this.isDisabled);
            dispose(this.isEditable);
            dispose(this.isEmpty);
            dispose(this.isFormValid);
            dispose(this.isFocused);
            dispose(this.messages);
            dispose(this.showMessages);
            dispose(this.oComputedMessages);
        }

    }
    
}