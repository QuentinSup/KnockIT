module fr.ca.cat {


	export class Locale {

		public decimalGroupSeparator: string
		public decimalGroupDigits: number
		public decimalSeparator: string
		
		public dateFormat: string
        public dateSeparator: string
        public dateLiteralFormat: string
		
		public currencySymbol: string
	
		public displayName: string

		private language: string
		private isoCode: string
	
		public constructor(language: string, isoCode: string) {
			this.language = language;
			this.isoCode = isoCode;
		}
		
		public getLang(): string {
			return this.language;
		}
		
		public getIsoCode(): string {
			return this.isoCode;
		}
	
	}



}