import { InputField } from '@webkit/form/InputField';

export class GridPasswordField extends InputField {

    public oRandomChars: KnockoutComputed<string[]>;
    public oObfuscatedPassword: KnockoutComputed<string>;
    public oTabChars: KnockoutObservable<string> = ko.observable<string>("0123456789");
    public oGridSize: KnockoutObservable<number> = ko.observable<number>();
    public oMaxLength: KnockoutObservable<number> = ko.observable<number>(0);
    private sObfuscatedChar: string = "*";
    
    /**
     * Constructeur
     */
    constructor(id: string, required: boolean = false, gridSize: number = 16) {
        super(id, null, required, false)
        this.inputTemplate  = "ui-field-gridpassword-template";

        this.oGridSize(gridSize);
        
        this.oObfuscatedPassword = ko.computed<string>((): string => {
            var sValue_: string = this.value() || "";
            return "".rPad(this.sObfuscatedChar, sValue_.length);    
        });
        
        this.oRandomChars = ko.computed<string[]>((): string[] => {
            return this.oTabChars().rPad(" ", this.oGridSize()).shake().split("");
        });
        
        this.oMaxLength.subscribe((): void => {
            if (this.autoValidate()) {
                this.validateValue()
            }
        });
    }

    /**
     * Evenement lors du clique sur un bouton
     */
    public onClickChar(char: string): void {
        var sValue_: string = this.value() || "";
        var n_: number = this.oMaxLength();
        if((n_ <= 0) || (sValue_.length < n_)) {
            this.value(sValue_ + char);
        }
    }
    
    /**
     * @Override
     */
    public isValidateValue(value): boolean {
        var b_: boolean = super.isValidateValue(value);
        var s_: string = value || "";
        var n_: number = this.oMaxLength?this.oMaxLength():0;
        return b_ && ((n_ <= 0) || (s_.length <= n_));
    }

    /**
     * Efface la saisie
     */
    public clear(): void {
        this.value(null);
    }
    
    /**
     * Annuler la dernière entrée
     */
    public cancel(): void {
        var s_: string = this.value() || "";
        this.value(s_.left(s_.length - 1));
    }

}