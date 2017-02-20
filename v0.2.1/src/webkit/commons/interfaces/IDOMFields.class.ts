module kit {

    import InputUIField = fields.InputUIField; 
    
    export interface IDOMField {
        fields: InputUIField[]
        onDOMField(fieldType: string, name: string, field: InputUIField);    
    }
    
}