import { Logger } from '@webkit/helper/logger';
import { Query } from '@webkit/helper/query';
import { Storage } from '@webkit/helper/storage';
import { BaseManager } from '@webkit/core/Manager.class';
import { Locale } from '@webkit/core/Locale.class';
import { Locale_en } from '@webkit/core/locale/en';

export let SUPPORTED_LANGUAGES: { [key: string]: string } = {}
export let DEFAULT_LANGUAGE: string

let logger: Logger = Logger.getLogger('i18n');

export interface ILocaleConfiguration {
	localeName :string
	isoCode: string
	format: {
		decimal: {
			groupSeparator: string
			groupDigits: number
			separator: string
		},
		date: {
			format: string
			separator: string
			literalFormat: string
		},
		currency: {
			symbol: string
		}
	}
}

export class I18n extends BaseManager {

    public uri: string = "/i18n/";
    public useRemoteUrl: boolean = false;
	public isStringsReady: KnockoutObservable<boolean> = ko.observable(false)
	public localizedStrings: { [key: string]: string } = {}
	public localizedObservableStrings: { [key: string]: KnockoutObservable<string>} = {}
    public locales: { string: Locale } = <any>{};
    /**
	 * The current resources language.
	 * @type {ko.observable(string)}
	 */
	public language: KnockoutObservable<string> = ko.observable<string>()

	constructor(defaultLanguage: string = "en") {
		super()
		DEFAULT_LANGUAGE = defaultLanguage;

		window['i18n'] = this;

	}

	private initLocales() {

		// Default locale
		this.addLocale(new Locale_en());

		// Load from autoloaded locales instances
		$.each(Locale.autoloadedLocales, (i: number, locale: Locale): void => {

			if(logger.isDebugEnabled()) {
				logger.debug("Add locale from autoloader", locale);
			}

			this.addLocale(locale);
		});
		// Load from configuration locales global var
		$.each(window['locales_def'] || {}, (id: string, localeConf: ILocaleConfiguration): void => {
	        let locale: Locale = new Locale(id, localeConf.isoCode)
	        locale.displayName = localeConf.localeName
	        locale.decimalGroupSeparator = localeConf.format.decimal.groupSeparator
	        locale.decimalGroupDigits = localeConf.format.decimal.groupDigits
	        locale.decimalSeparator = localeConf.format.decimal.separator
	        locale.currencySymbol = localeConf.format.currency.symbol
	        locale.dateFormat = localeConf.format.date.format;
	        locale.dateSeparator = localeConf.format.date.separator;
	        locale.dateLiteralFormat = localeConf.format.date.literalFormat;

	        if(logger.isDebugEnabled()) {
				logger.debug("Add locale from global configuration", locale);
			}

	    	this.addLocale(locale);
	    })
	}

	private initLanguage(defaultLanguage?: string) {
		let locale: Locale		
		if(defaultLanguage) {
			locale = this.getLocaleByLang(defaultLanguage);
		}
		if(!locale) {
			locale = this.getLocaleByLang(this.getBrowserLanguage());
		}

        if (locale) {
    		this.language(locale.getLang());    
    		this.isReady(true);
    		return;
        }
        
        logger.error("Error loading language '%s'".format(defaultLanguage));
        this.emit('initError', defaultLanguage);
	} 
	
	public getCurrentLocale(): Locale {
		return this.getLocale(this.language());
	}
	
	public getLocale(isoCode: string): Locale {
		return this.locales[isoCode];
	}

	public getLocaleByLang(lang: string): Locale {
		return Object.findBy(this.locales, 'getLang', lang);
	}

	public getSupportedLanguages(): any {
		return SUPPORTED_LANGUAGES
	}

	public addLocale(locale) {
		SUPPORTED_LANGUAGES[locale.getIsoCode()] = locale.getLang();
		this.locales[locale.getIsoCode()] = locale;
	}

	public loadJsonStrings(json: any) {
	    // Update the cache for each
	    $.each(json, (k: string, v: string): void => {
		    this.localizedStrings[k] = v
	    })
	    // Update the observables strings
	    this.updateObservableStrings();
	    this.isStringsReady(true);
	}

	public loadLanguageAsJson(lang: string, json: any) {
		this.loadJsonStrings(json);
	    // Update the current resources language
	    this.language(lang)
	}

	public loadLanguage(lang: string): void {
		
		// Load i18n from js global var i18n
		let globalI18n: any = window['i18n_def'];
		if(globalI18n && globalI18n[lang]) {
			this.loadLanguageAsJson(lang, globalI18n[lang]);
			return;
		}

		if(this.useRemoteUrl) {
			// Get the url
			let url: string = this.getRemoteUrl(lang)

			// Load the strings
		    Query.GETasJson(url, (json, status: string): void => {
			    if (lang != this.language()) {
				    // The user changed the language between the request and the response
				    return
			    }
		    	if (status == Query.Status.SUCCESS) {
            
	            	// Update the current language
				    this.loadLanguageAsJson(lang, json);
				    
				} else {
				    logger.fatal('Erreur lors du chargement des libellés %s: %s'.format(url, status));
	                this.emit('initError', lang);
	                throw 'Erreur lors du chargement des libellés %s: %s'.format(url, status);
	            }
		    }, null, { upToDate: false });
		    return;
  
        }

        logger.warn('No internationalized message found (lang: %s)'.format(lang))

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

	/**
	 * Gets the localized string for the given key.
	 * @param {string} key The key of the desired label.
	 * @return {string} The localized string.
	 * @see getString
	 */
	public _(key: string, defaultValue?: string): string {
		return this.getString(key, defaultValue);
	}

	public getCurrentLanguage(): string {
		let lang: string = this.language()
		if(SUPPORTED_LANGUAGES[lang]) {
			return lang
		}
		return null
	}

    // return the browser language if this language is one of the supported ones
    // else it returns the default language set in the browserLanguageInfos.js file 
   public getBrowserLanguage(): string {
        return app.browser.getCurrentBrowserInfos().countryCode
    }


    public static getStringOrKey(str: string, key: string): string {
        return (str === null || str === undefined) ? key : str;
    }

    public getRemoteUrl(language: string): string {
        return app.servicesPath + this.uri + app.context.page + "/" + language;
    }
    
	public init(): void {

		this.initLocales();

        this.language.subscribe((lang: string): void => {
			this.loadLanguage(lang)
			this.emit('change', lang);
			this.isReady(true)
        })

        this.initLanguage(DEFAULT_LANGUAGE);

	}

}