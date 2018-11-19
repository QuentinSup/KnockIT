module fr.ca.cat {

    import IUIField = fields.IUIField
    import InputUIField = fields.InputUIField
    import InputUIFieldValidationConstraint = fields.InputUIFieldValidationConstraint
    import InputUIFieldMessage = fields.InputUIFieldMessage

    export class FieldsValidatorDigest extends GroupUIField implements IDisposable {
        
        private oComputed: KnockoutComputed<void>
        public messagesArgs: KnockoutObservable<any> = ko.observable<any>();
        public inspectChilds: KnockoutObservable<boolean> = ko.observable<boolean>(true);
        
        public constructor(PE_oListOfIUIField: IUIField[] = [], messagesArgs: any = {}, inspectChilds: boolean = true) {
            
            super(null, PE_oListOfIUIField) 
                
            this.messagesArgs(messagesArgs);
            this.inspectChilds(inspectChilds);
            
            this.oComputed = ko.computed((): void => {
                var oListOfIUIFieldArray_: IUIField[]  = this.oListOfUIField()
                var messagesArgs_: any = this.messagesArgs();
                var bRecursive_: boolean = this.inspectChilds();
                this.treatListOfFields(oListOfIUIFieldArray_, messagesArgs_, bRecursive_);
            }).extend({ throttle: 0 });
                            
        }
        
        /**
         * Ajoute un champ au validateur
         */
        public addField(field: IUIField) {
            this.oListOfUIField.push(field);    
        }
        
        public addUIFields(PE_oListOfIUIField: IUIField[] = []) {
            var oListOfIUIFieldArray_: IUIField[]  = this.oListOfUIField() || [];
            this.oListOfUIField(oListOfIUIFieldArray_.concat(PE_oListOfIUIField));
        }
        
        
        public treatListOfFields(oListOfIUIFieldArray: IUIField[], messagesArgs: any, bRecursive: boolean): void {
            var len_: number = oListOfIUIFieldArray.length

            for(var i_: number = 0; i_ < len_; i_++) {
                var oIUIField_: IUIField = oListOfIUIFieldArray[i_];
                var oObservableString_ = null
                    
                oIUIField_.messages.removeAll();
                
                var oInputUIField_: InputUIField = <InputUIField>oIUIField_;
                var bConstraintsTriggered_: boolean = false;
                if(oInputUIField_.unvalidatedConstraints) {
                   var oUnvalidatedConstraintsList_: InputUIFieldValidationConstraint[] = oInputUIField_.unvalidatedConstraints();
                   for(var j_: number = 0, len2 = oUnvalidatedConstraintsList_.length; j_ < len2; j_++) {
                        var oValidationConstraint_: InputUIFieldValidationConstraint = oUnvalidatedConstraintsList_[j_];
                       
                        if(!oValidationConstraint_.isWarn) {
                            bConstraintsTriggered_ = true;
                        }
                        if(oValidationConstraint_.name) {
                            var str_: string = "";
                            var strId_: string = oIUIField_.id + '.constraints.' + oValidationConstraint_.name;
    
                            
                            if(typeof(oValidationConstraint_.messageFn) == 'function') {
                                str_ = oValidationConstraint_.messageFn.call(oInputUIField_, strId_);
                            } else {
                                oObservableString_ = app.i18n.getObservableString(strId_);
                                str_ = oObservableString_();
                            }
                            
                            var message_: string = utils.formatString(str_, messagesArgs);
                            oIUIField_.messages.push(new InputUIFieldMessage(message_, oValidationConstraint_.isWarn));
                        }
                   }
                }
                
                if(!oIUIField_.isFormValid() && !bConstraintsTriggered_) {
                    if(oIUIField_.isEmpty() && oIUIField_.isRequired()) {
                        oObservableString_ = app.i18n.getObservableString(oIUIField_.id + '.required', 'form.field.required');
                        var message_: string = utils.formatString(oObservableString_(), messagesArgs);
                        oIUIField_.messages.push(new InputUIFieldMessage(message_));
                    } else {
                       oObservableString_ = app.i18n.getObservableString(oIUIField_.id + '.invalid', 'form.field.invalid');
                       var message_: string = utils.formatString(oObservableString_(), messagesArgs);
                       oIUIField_.messages.push(new InputUIFieldMessage(message_));
                    }
                }
                
                if((<any>oIUIField_).oListOfUIField && bRecursive) {
                    // Traitement récursifs des enfants
                    this.treatListOfFields((<any>oIUIField_).oListOfUIField(), messagesArgs, bRecursive);   
                }
                
            } 
        }
   
        public dispose(): void {
            super.dispose();
            dispose(this.messagesArgs);
            dispose(this.oComputed);
        }
        
    }
   
        
    
}