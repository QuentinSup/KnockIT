import { Locale } from '@webkit/core/Locale.class';

export class Locale_fr extends Locale {

	constructor() {
		super('fr', 'fr_FR');
		this.displayName = "Français";
		this.decimalSeparator = ",";
		this.decimalGroupSeparator = " ";
		this.decimalGroupDigits = 3;
		this.dateFormat = "dd/mm/yyyy";
		this.dateSeparator = "/";
		this.dateLiteralFormat = "DMY";
		this.currencySymbol = "€";
	}

}