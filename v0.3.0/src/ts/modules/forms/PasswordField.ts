import { TextField } from '@webkit/form/TextField';

export class PasswordField extends TextField {

    constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
        super(id, value, required, readOnly)
        this.inputType('password');
    }
    
}