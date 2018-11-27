import { Locale } from '@webkit/core/Locale.class';

export class Locale_en extends Locale {

	constructor() {
		super('en', 'en_US');
		this.displayName = "English";
		this.decimalSeparator = ".";
		this.decimalGroupSeparator = ",";
		this.decimalGroupDigits = 3;
		this.dateFormat = "yyyy-mm-dd";
		this.dateSeparator = "-";
		this.dateLiteralFormat = "YMD";
		this.currencySymbol = "€";
	}

}