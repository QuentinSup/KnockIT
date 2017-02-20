module kit.fields {

    export class TextSearchUIField extends TextUIField {

        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
                
            this.inputTemplate = "ui-field-textsearch-template"

        }
        
        public onSearch() {
           this.emit('search', this.dataValue()); 
        }
        
    }
    
}