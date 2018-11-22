import { TextUIField } from '@webkit/form/TextUIField';

export class TextSearchUIField extends TextUIField {

    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        super(id, value, required, readOnly)
            
        this.inputTemplate = "ui-field-textsearch-template"

    }
    
    public onKeyDownEventHandler(e: any): boolean {
        if((e.which || e.keyCode) == 13) {
            defer((): void => {
                this.onSearch();
            }, 100);
        }
        return super.onKeyDownEventHandler(e);
    }
    
    public onSearch() {
        if(this.isValidateValue(this.dataValue())) {
            this.emit('search', this.dataValue());
        } else {
            this.emit('searchError', this.dataValue());
        }
    }
    
}