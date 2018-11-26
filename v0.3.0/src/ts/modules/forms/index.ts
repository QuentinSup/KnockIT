
export interface IValidationRule {
	test(value: any): boolean
}

export class RegExpValidationRule implements IValidationRule {
    private regExp: RegExp
    constructor(regExp: RegExp) {
		this.regExp = regExp
    }
	public test(value: any): boolean {
		if (value && value != "") {
			if (this.regExp.test(value)) {
                // the value is valid
                return true
            } else {
                // the value is not valid
                return false
            }
		}
        return true
    }

}