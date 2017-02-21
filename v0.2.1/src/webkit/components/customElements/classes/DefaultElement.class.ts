module kit.components {
    
    export interface RegisterCallbacksInterface {
        create(domElement: HTMLElement)
        attach(domElement: HTMLElement)
        detach(domElement: HTMLElement)
        addAttribute(domElement: HTMLElement)
        removeAttribute(domElement: HTMLElement)
        modifyAttribute(domElement: HTMLElement)
    }
    
    export abstract class DefaultElement implements RegisterCallbacksInterface {
        
        private tagName: string;
        
        public constructor(tagName: string) {
            this.tagName = tagName;
        }
        
        public getTagName(): string {
            return this.tagName;
        }
        
        public abstract create(domElement: HTMLElement);
        
        public attach(domElement: HTMLElement) {}
        public detach(domElement: HTMLElement) {}
        public addAttribute(domElement: HTMLElement) {}
        public removeAttribute(domElement: HTMLElement) {}
        public modifyAttribute(domElement: HTMLElement) {}
        
    }

}