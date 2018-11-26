export abstract class AbstractBinding implements KnockoutBindingHandler {
    
    private _name: string;

    public options: any = {};
    
    public constructor(name: string) {
        this._name = name;
    }
    
    public getName(): string {
        return this._name;
    }
    
}