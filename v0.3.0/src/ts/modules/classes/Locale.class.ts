export class Locale {

	public static autoLoadClass: boolean = true;
	public static autoloadedLocales: Locale[] = [];

	public decimalGroupSeparator: string
	public decimalGroupDigits: number
	public decimalSeparator: string
	public dateFormat: string
    public dateSeparator: string
    public dateLiteralFormat: string
	public currencySymbol: string
	public displayName: string

	private _language: string
	private _isoCode: string

	public constructor(language: string, isoCode: string) {
		this._language = language;
		this._isoCode = isoCode;
	}
	
	public getLang(): string {
		return this._language;
	}
	
	public getIsoCode(): string {
		return this._isoCode;
	}

}