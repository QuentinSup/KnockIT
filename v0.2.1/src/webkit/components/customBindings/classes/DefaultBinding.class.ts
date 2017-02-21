module kit.components {
    
    export abstract class DefaultBinding implements KnockoutBindingHandler {
        
        private name: string;
        public options: any = {};
        
        public constructor(name: string) {
            this.name = name;
        }
        
        public getName(): string {
            return this.name;
        }
        
    }

}