import { BaseField, IField, InputFieldMessage } from '@webkit/form/InputField';

export class GroupFields extends BaseField implements IField, IDisposable {
        
    public fields: KnockoutObservableArray<IField> = ko.observableArray<IField>()
    public enableNVisibleFields: KnockoutComputed<IField[]>;
    public lengthOfEnableNVisibleFields: KnockoutComputed<number>;
    
    public isLastInputValid: KnockoutSubscribable<boolean>
    public isDisabled: KnockoutSubscribable<boolean>
    public isReadOnly: KnockoutSubscribable<boolean>
    public isRequired: KnockoutSubscribable<boolean>
    public isEditable: KnockoutSubscribable<boolean>
    public isVisible: KnockoutSubscribable<boolean>
    public isFormValid: KnockoutSubscribable<boolean>
    public hasChanged: KnockoutSubscribable<boolean>
    public hasWarns: KnockoutSubscribable<boolean>
    public isEmpty: KnockoutSubscribable<boolean>
    public isFocused: KnockoutSubscribable<boolean>
    public hasBeenVisited: KnockoutObservable<boolean> = ko.observable<boolean>(false)
    
    private computedMessages: KnockoutComputed<InputFieldMessage[]>
    private hasBeenVisitedTrigger: boolean = false
  
    public constructor(id: string, fields: IField[] = [], showLabel: boolean = true) {
                
        super(id, showLabel)
        
        this.isRequired = this.createComputedBoolean('isRequired', true);
        this.isReadOnly = this.createComputedBoolean('isReadOnly', true, true);
        this.isDisabled = this.createComputedBoolean('isDisabled', true, true);
        this.isVisible  = this.createComputedBoolean('isVisible', true);
        this.isEditable = this.createComputedBoolean('isEditable', true);
        this.isFocused = this.createComputedBoolean('isFocused', true, false, 50);
        this.hasChanged = this.createComputedBoolean('hasChanged', true);
        this.hasWarns = this.createComputedBoolean('hasWarns', true);
        //this.hasBeenVisited = this.createComputedBoolean('hasBeenVisited', true);
        
        this.computedMessages = this.createComputedMessages();
        
        this.isLastInputValid = ko.computed((): boolean => {
            return this.readBoolean('isLastInputValid', true, true);
        });
        
        this.isFormValid = ko.computed((): boolean => {
            return this.readBoolean('isFormValid', true, true) && this.isConstraintsValid();
        });
        
        this.isEmpty = ko.computed((): boolean => {
            return this.readBoolean('isEmpty', true, true);
        });
        
        this.isFocused.subscribe((v: boolean): void => {
            if(!v) {
                defer((): void => {
                    this.hasBeenVisited(true);
                });
            }
        });
        
        this.fields(fields || [])
        
        this.enableNVisibleFields = ko.computed<IField[]>((): IField[] => {
            return this.fields().filter((val: IField): boolean => {
                return val.isVisible();
            });
        });
        
        this.lengthOfEnableNVisibleFields = ko.computed<number>((): number => {
            return this.enableNVisibleFields().length;
        });
            
    }
    
    public addField(PE_oField: IField): void {
        this.fields.push(PE_oField);
    }
        
    public removeAll(): void {
        this.fields.removeAll();
    }
    
    private createComputedBoolean(subscribableName: string, testValue: boolean, allCombined: boolean = false, throttle: number = null): KnockoutComputed<any> {
        return ko.computed({
                read:   (): boolean => {
                            return this.readBoolean(subscribableName, testValue, allCombined);
                        },
                write:  (b: boolean) => {
                            this.writeBoolean(subscribableName, b);
                        }

        }).extend({ throttle: throttle });
    }
    
    private createComputedMessages(): KnockoutComputed<InputFieldMessage[]> {
        return ko.computed((): InputFieldMessage[] => {
            let fields: IField[] = this.fields()
            let len: number = fields.length
            let ary: InputFieldMessage[] = []

            for(let i: number = 0; i < len; i++) {
                let field: IField = fields[i];
                ary = ary.concat(field.messages());
            }
            
            ary = ary.concat(this.messages());
            
            return ary;

        }, this);
    }
    
    private readBoolean(subscribableName: string, testValue: boolean = false, allCombined: boolean = false): any {
        let fields: IField[] = this.fields()
        let len: number = fields.length
        let isValid: boolean = !testValue

        for(let i: number = 0; i < len; i++) {
            let field: IField = fields[i];
            
            if(field[subscribableName].call(field) == testValue) {
                isValid = true
                if(!allCombined) {
                    break;
                }
            } else {
                if(allCombined) {
                    isValid = false;
                    break;
                }
            }
        }

        return isValid;
    }
    
    private writeBoolean(subscribableName: string, v: boolean): void {
        this.runFunction(subscribableName, v);
    }
    
    private runFunction(functionName: string, args: any = null): void {
        let fields: IField[] = this.fields()
        let len: number = fields.length

        for(let i: number = 0; i < len; i++) {
            let field: IField = fields[i];
            field[functionName].call(field, args)
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
        dispose(this.computedMessages);
    }
}