import { GroupFields } from '@webkit/core/GroupFields.class';
import { InputField } from '@webkit/form/InputField';
    
export class ScreenSequence extends GroupFields {

    public static defaultAnimationIn: any = 'appear';
    public static defaultAnimationOut: any = 'disappear';
    public static defaultAnimationError: any = { animation: 'shake', whenAppear: false };
    
    public id: string
    public templateName: KnockoutObservable<string> = ko.observable<string>()
    public isSubmited: KnockoutObservable<boolean> = ko.observable<boolean>(false)
    public animationIn: any;
    public animationOut: any;
    public animationError: any;
    public data: any
    
    constructor(id: string, templateName: string, fields: InputField[], data: any = {}, animationIn: any = ScreenSequence.defaultAnimationIn, animationOut: any = ScreenSequence.defaultAnimationOut, animationError: any = ScreenSequence.defaultAnimationError) {
    
        super(null, fields);
        
        this.id = id;
        this.data = data;
        this.animationIn = animationIn;
        this.animationOut = animationOut;
        this.animationError = animationError;
        
        this.templateName(templateName);
        
    }
    
    public show(): boolean {
        this.emit('show');
        return true;
    }
    
    public hide(): boolean {
        this.emit('hide');
        return true;
    }
    
    public beforeSubmit(): boolean {
        return true;
    }
            
    public submit(): boolean {
    
        this.isSubmited(true);
        this.emit('validate');
        
        if(this.isFormValid()) {            
            this.emit('submit');
            return true;
        }
        
        return false;

    }
    
    public afterRender(): void {
        this.emit('afterRender');    
    }

}

export class ScreenSequenceView extends ScreenSequence {
    
    // @Override
    public isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    
    constructor(id: string, templateName: string, data: any = {}, animationIn: any = ScreenSequence.defaultAnimationIn, animationOut: any = ScreenSequence.defaultAnimationOut, animationError: any = ScreenSequence.defaultAnimationError) {

        super(id, templateName, null, data, animationIn, animationOut, animationError);
        
    }
    
}