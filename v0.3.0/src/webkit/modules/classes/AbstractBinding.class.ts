export abstract class AbstractBinding implements KnockoutBindingHandler {
    
    private name: string;
    public options: any = {};
    
    public constructor(name: string) {
        this.name = name;
    }
    
    public getName(): string {
        return this.name;
    }
    
}