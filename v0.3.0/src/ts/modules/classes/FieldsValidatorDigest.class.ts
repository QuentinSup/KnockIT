import { IField, InputField, InputFieldValidationConstraint, InputFieldMessage } from '@webkit/form/InputField';
import { GroupFields } from '@webkit/core/GroupFields.class';

export class FieldsValidatorDigest extends GroupFields implements IDisposable {
        
    private _computed: KnockoutComputed<void>

    public messagesArgs: KnockoutObservable<any> = ko.observable<any>();
    public inspectChilds: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    
    public constructor(fields: IField[] = [], messagesArgs: any = {}, inspectChilds: boolean = true) {
        
        super(null, fields) 
            
        this.messagesArgs(messagesArgs);
        this.inspectChilds(inspectChilds);
        
        this._computed = ko.computed((): void => {
            let fields: IField[]  = this.fields()
            let messagesArgs: any = this.messagesArgs();
            let isRecursive: boolean = this.inspectChilds();
            this.treatListOfFields(fields, messagesArgs, isRecursive);
        }).extend({ throttle: 0 });
                        
    }
        
    /**
     * Ajoute un champ au validateur
     */
    public addField(field: IField) {
        this.fields.push(field);    
    }
        
    public addFields(fields: IField[] = []) {
        let oListOfIFieldArray_: IField[]  = this.fields() || [];
        this.fields(oListOfIFieldArray_.concat(fields));
    }
        
        
    public treatListOfFields(oListOfIFieldArray: IField[], messagesArgs: any, bRecursive: boolean): void {
        let len: number = oListOfIFieldArray.length

        for(let i: number = 0; i < len; i++) {
            let field: IField = oListOfIFieldArray[i];
            let observable: KnockoutObservable<string> = null
                
            field.messages.removeAll();
            
            let input: InputField = <InputField>field;
            let isContraintsTriggered: boolean = false;
            if(input.unvalidatedConstraints) {
               let oUnvalidatedConstraintsList_: InputFieldValidationConstraint[] = input.unvalidatedConstraints();
               for(let j: number = 0, len2 = oUnvalidatedConstraintsList_.length; j < len2; j++) {
                    let validationConstraint: InputFieldValidationConstraint = oUnvalidatedConstraintsList_[j];
                   
                    if(!validationConstraint.isWarn) {
                        isContraintsTriggered = true;
                    }
                    if(validationConstraint.name) {
                        let str: string = "";
                        let strId: string = field.id + '.constraints.' + validationConstraint.name;

                        
                        if(typeof(validationConstraint.messageFn) == 'function') {
                            str = validationConstraint.messageFn.call(input, strId);
                        } else {
                            observable = app.i18n.getObservableString(strId);
                            str = observable();
                        }
                        
                        let message: string = utils.formatString(str, messagesArgs);
                        field.messages.push(new InputFieldMessage(message, validationConstraint.isWarn));
                    }
               }
            }
            
            if(!field.isFormValid() && !isContraintsTriggered) {
                if(field.isEmpty() && field.isRequired()) {
                   observable = app.i18n.getObservableString(field.id + '.required', 'form.field.required');
                } else {
                   observable = app.i18n.getObservableString(field.id + '.invalid', 'form.field.invalid');
                }
                let message: string = utils.formatString(observable(), messagesArgs);
                field.messages.push(new InputFieldMessage(message));
            }
            
            if((<any>field).oListOfField && bRecursive) {
                // Traitement récursifs des enfants
                this.treatListOfFields((<any>field).oListOfField(), messagesArgs, bRecursive);   
            }
            
        } 
    }
   
    public dispose(): void {
        super.dispose();
        dispose(this.messagesArgs);
        dispose(this._computed);
    }
    
}