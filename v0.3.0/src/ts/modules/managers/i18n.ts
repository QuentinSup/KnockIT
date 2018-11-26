import { Logger } from '@webkit/helper/logger';
import { Query } from '@webkit/helper/query';
import { Storage } from '@webkit/helper/storage';
import { BaseManager } from '@webkit/core/Manager.class';
import { Locale } from '@webkit/core/Locale.class';

export enum TSupportedLanguages {
    fr_FR
}

export let SUPPORTED_LANGUAGES: { [key: string]: string } = {}


let logger: Logger = Logger.getLogger('i18n');

/**
 * The default localization file.
 * @type {Object.<string, ko.observable(string)>}
 */
let DEFAULT_LANGUAGE: string = TSupportedLanguages[TSupportedLanguages.fr_FR]

export class I18n extends BaseManager {

    public uri: string = "/i18n/";
    
	public locales: { string?: Locale } = {};

	public isStringsReady: KnockoutObservable<boolean> = ko.observable(false)

	public localizedStrings: { [key: string]: string } = {}
	public localizedObservableStrings: { [key: string]: KnockoutObservable<string>} = {}
    
        
    /**
	 * The current resources language.
	 * @type {ko.observable(string)}
	 */
	public language: KnockoutObservable<string> = ko.observable<string>()

	constructor(browserLanguageInfos: any) {
		super()
	    $.each(browserLanguageInfos, (id: string, value: any): void => {
	        SUPPORTED_LANGUAGES[value.isoCode] = value.localeName
	        if (value.defaultLanguage == "true") {
	            DEFAULT_LANGUAGE = value.isoCode
	        }
	        let locale: Locale = new Locale(id, value.isoCode)
	        locale.displayName = value.localeName
	        locale.decimalGroupSeparator = value.format.decimal.groupSeparator
	        locale.decimalGroupDigits = value.format.decimal.groupDigits
	        locale.decimalSeparator = value.format.decimal.separator
	        locale.currencySymbol = value.format.currency.symbol
	        locale.dateFormat = value.format.date.format;
	        locale.dateSeparator = value.format.date.separator;
	        locale.dateLiteralFormat = value.format.date.literalFormat;
	        this.locales[value.isoCode] = locale;
	    })
	}
	
	public getCurrentLocale(): Locale {
		return this.getLocale(this.language());
	}
	
	public getLocale(isoCode: string): Locale {
		return this.locales[isoCode];
	}

	public getSupportedLanguages(): any {
		return SUPPORTED_LANGUAGES
	}

	public loadStrings(lang?: string): void {
		let context, url: string
		let self = this

	    let stringsLoaded = function(json, status: string) {
		    if (this.requestedLanguage != self.language()) {
			    // The user changed the language between the request and the response
			    return
		    }
		    if (status == Query.Status.SUCCESS) {
            
			    // Update the cache for each application
			    $.each(json, function(k: string, v: string) {
				    self.localizedStrings[k] = v
			    })

			    // Update the current resources language
			    self.language(this.requestedLanguage)
                // Update the observable strings
                self.updateObservableStrings()
			    self.isStringsReady(true)
			    
			    self.emit('change', self.language());

		    } else {
			    logger.fatal('Erreur lors du chargement des libellés %s: %s'.format(url, status));
                self.emit('initError');
                throw 'Erreur lors du chargement des libellés %s: %s'.format(url, status);
		    }
	    }

		// Set the language
		lang = lang || this.language() || DEFAULT_LANGUAGE

        if(SUPPORTED_LANGUAGES[lang]) {

		    // Get the url of the strings
		    url = this.getStringsUrl(lang)

		    // Set the context
		    context = {
			    requestedLanguage : lang
		    }

		    // Load the strings
		    Query.GETasJson(url, stringsLoaded, context, { upToDate: false });
        }
	}

    private updateObservableStrings(): void {
        $.each(this.localizedStrings, (k: string, v: string): void => {
            let observableString = this.getObservableString(k)
            observableString(v)
        })
    }

	public getObservableString(key: string, defaultValue?: string): KnockoutObservable<string> {

		// Get the observable string with the given id
		let observableString: KnockoutObservable<string> = this.localizedObservableStrings[key];
        
		if (!observableString) {
        
            if(isset(defaultValue)) {
                observableString = this.localizedObservableStrings[defaultValue];
                if (!observableString) {
                    observableString = ko.observable<string>(defaultValue)
                }
            } else {
				// Create a new observable string with the localized string
	            observableString = this.localizedObservableStrings[key] = ko.observable<string>()
                observableString(this.getString(key, key))
            }

		}
        
		return observableString
	}

	/**
	 * Gets the localized string for the given key.
	 * @param {string} key The key of the desired label.
	 * @return {string} The localized string.
	 */
	public getString(key: string, defaultValue?: string): string {
	  return I18n.getStringOrKey(this.localizedStrings[key], isset(defaultValue)?defaultValue:key)
	}

	public getCurrentLanguage(): string {
		let locale: string = this.language()
		if(SUPPORTED_LANGUAGES[locale]) {
			return locale
		}
		return DEFAULT_LANGUAGE
	}

    // return the browser language if this language is one of the supported ones
    // else it returns the default language set in the browserLanguageInfos.js file 
   public getLanguageFromBrowser(): string {
        let language: string = app.browser.getCurrentBrowserInfos().countryCode
        if(language) {
        	let locale: Locale = Object.findBy(this.locales, 'getLang', language);
            if (locale) {
                return locale.getIsoCode()
            }
        }
        return DEFAULT_LANGUAGE
    }


    public static getStringOrKey(str: string, key: string): string {
        return (str === null || str === undefined) ? key : str;
    }

    public getStringsUrl(language: string): string {
        return app.servicesPath + this.uri + app.context.page + "/" + language;
    }
    
	public init(): void {
        
        this.language.subscribe((lang: string): void => {
        	if(SUPPORTED_LANGUAGES[lang]) {
            	this.loadStrings(lang)
            }
        })

        this.language(this.getLanguageFromBrowser());

	    ko.computed((): void => {
            if (this.isStringsReady()) {
		        this.isReady(true)
            }
	    }, this)

	}

}