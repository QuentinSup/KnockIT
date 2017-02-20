module kit.fields {

    export class PasswordUIField extends TextUIField {

        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)
            this.inputTemplate = "ui-field-password-template"
        }

    }
    
}