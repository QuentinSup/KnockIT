module kit.agilitedigitale.components {
    
    export class WebKitFieldElement extends DefaultElement {
      
        public constructor() {
            super('webkit-field');    
        }
        
        private createFieldFromHTMLElement(domElement): void {
            var $domElement = $(domElement);
            var name: string            = $domElement.attr('name');
            var required: boolean       = !!$domElement.attr('required');
            var defaultValue: string    = $domElement.attr('defaultValue');
            var fieldType: string       = ($domElement.attr('type') || "text").toLowerCase(); 
            
            domElement.innerHTML = "<div data-bind=\"field: { type: '" + fieldType + "', name: '" + name + "', required: " + required + ", defaultValue: '" + defaultValue + "' }\"></div>";
        }
        
        public create(domElement: HTMLElement): void {
            this.createFieldFromHTMLElement(domElement);
        }

    };
}