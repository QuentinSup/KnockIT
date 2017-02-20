module kit.manager {

	import Logger = helpers.Logger
	import Query = helpers.Query
	import Storage = helpers.Storage

    export enum TSupportedLanguages {
        fr_FR
    }

	export var SUPPORTED_LANGUAGES: { [key: string]: string } = {}

    /**
     * The default localization file.
     * @type {Object.<string, ko.observable(string)>}
     */
    var DEFAULT_LANGUAGE: string = TSupportedLanguages[TSupportedLanguages.fr_FR]

	export class I18n extends BaseManager {

        public uri: string = "/i18n/";
        
		public oListLocales: any = {};

		public isStringsReady: KnockoutObservable<boolean> = ko.observable(false)

		public localizedStrings: { [key: string]: string } = {}
		public localizedObservableStrings: { [key: string]: KnockoutObservable<string>} = {}
        
        private static oLogger = Logger.getLogger('kit.manager.I18n');
        
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
		        var oLocale_: Locale = new Locale(id, value.isoCode)
		        oLocale_.displayName = value.localeName
		        oLocale_.decimalGroupSeparator = value.format.decimal.groupSeparator
		        oLocale_.decimalGroupDigits = value.format.decimal.groupDigits
		        oLocale_.decimalSeparator = value.format.decimal.separator
		        oLocale_.currencySymbol = value.format.currency.symbol
		        oLocale_.dateFormat = value.format.date.format;
		        oLocale_.dateSeparator = value.format.date.separator;
		        oLocale_.dateLiteralFormat = value.format.date.literalFormat;
		        this.oListLocales[value.isoCode] = oLocale_;
		    })
		}
		
		public getCurrentLocale(): Locale {
			return this.getLocale(this.language());
		}
		
		public getLocale(isoCode: string): Locale {
			return this.oListLocales[isoCode];
		}

		public getSupportedLanguages(): any {
			return SUPPORTED_LANGUAGES
		}
	
		public loadStrings(lang?: string): void {
			var context, url: string

			var self = this

		    var stringsLoaded = function(json, status: string) {
			    if (this.requestedLanguage != self.language()) {
				    // The user changed the language between the request and the response
				    return
			    }
			    if (status == Query.Status.SUCCESS) {
	            
				    // Update the cache for each application
				    $.each(json, function(k, v) {
					    self.localizedStrings[k] = v
				    })

				    // Update the current resources language
				    self.language(this.requestedLanguage)
	                // Update the observable strings
	                self.updateObservableStrings()
				    self.isStringsReady(true)
				    
				    self.emit('change', self.language());

			    } else {
				    I18n.oLogger.fatal('Erreur lors du chargement des libellés %s: %s'.format(url, status));
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
	        $.each(this.localizedStrings, (k, v): void => {
	            var observableString = this.getObservableString(k)
                observableString(v)
	        })
	    }

		public getObservableString(key: string, defaultValue?: string): KnockoutObservable<string> {

			// Get the observable string with the given id
			var observableString: KnockoutObservable<string> = this.localizedObservableStrings[key];
	        
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
    		var locale: string = this.language()
    		if(SUPPORTED_LANGUAGES[locale]) {
    			return locale
    		}
    		return DEFAULT_LANGUAGE
    	}

        // return the browser language if this language is one of the supported ones
        // else it returns the default language set in the browserLanguageInfos.js file 
       public getLanguageFromBrowser(): string {
            var language = app.browser.getCurrentBrowserInfos().countryCode
            if(language) {
            	var oLocale_ = Object.findBy(this.oListLocales, 'getLang', language);
                if (oLocale_) {
                    return oLocale_.getIsoCode()
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

}