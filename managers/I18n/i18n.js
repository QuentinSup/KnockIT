/// <reference path="classes/Locale.class.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fr;
(function (fr) {
    var fwk;
    (function (fwk) {
        var knockit;
        (function (knockit) {
            var manager;
            (function (manager) {
                var Logger = knockit.helpers.Logger;
                var Query = knockit.helpers.Query;
                (function (TSupportedLanguages) {
                    TSupportedLanguages[TSupportedLanguages["fr_FR"] = 0] = "fr_FR";
                })(manager.TSupportedLanguages || (manager.TSupportedLanguages = {}));
                var TSupportedLanguages = manager.TSupportedLanguages;
                manager.SUPPORTED_LANGUAGES = {};
                /**
                 * The default localization file.
                 * @type {Object.<string, ko.observable(string)>}
                 */
                var DEFAULT_LANGUAGE = TSupportedLanguages[TSupportedLanguages.fr_FR];
                var LOCALE_PATH = "${path}/i18n/${device}/${app}/${page}/${lang}";
                var I18n = (function (_super) {
                    __extends(I18n, _super);
                    function I18n(browserLanguageInfos) {
                        var _this = this;
                        _super.call(this);
                        this.oListLocales = {};
                        this.isStringsReady = ko.observable(false);
                        this.localizedStrings = {};
                        this.localizedObservableStrings = {};
                        /**
                         * The current resources language.
                         * @type {ko.observable(string)}
                         */
                        this.language = ko.observable();
                        $.each(browserLanguageInfos, function (id, value) {
                            manager.SUPPORTED_LANGUAGES[value.isoCode] = value.localeName;
                            if (value.defaultLanguage == "true") {
                                DEFAULT_LANGUAGE = value.isoCode;
                            }
                            var oLocale_ = new manager.Locale(id, value.isoCode);
                            oLocale_.displayName = value.localeName;
                            oLocale_.decimalGroupSeparator = value.format.decimal.groupSeparator;
                            oLocale_.decimalGroupDigits = value.format.decimal.groupDigits;
                            oLocale_.decimalSeparator = value.format.decimal.separator;
                            oLocale_.currencySymbol = value.format.currency.symbol;
                            oLocale_.dateFormat = value.format.date.format;
                            oLocale_.dateSeparator = value.format.date.separator;
                            oLocale_.dateLiteralFormat = value.format.date.literalFormat;
                            _this.oListLocales[value.isoCode] = oLocale_;
                        });
                    }
                    I18n.prototype.getCurrentLocale = function () {
                        return this.getLocale(this.language());
                    };
                    I18n.prototype.getLocale = function (isoCode) {
                        return this.oListLocales[isoCode];
                    };
                    I18n.prototype.getSupportedLanguages = function () {
                        return manager.SUPPORTED_LANGUAGES;
                    };
                    I18n.prototype.loadStrings = function (lang) {
                        var context, url;
                        var self = this;
                        var stringsLoaded = function (json, status) {
                            if (this.requestedLanguage != self.language()) {
                                // The user changed the language between the request and the response
                                return;
                            }
                            if (status == Query.Status.SUCCESS) {
                                // Update the cache for each application
                                $.each(json, function (k, v) {
                                    self.localizedStrings[k] = v;
                                });
                                // Update the current resources language
                                self.language(this.requestedLanguage);
                                // Update the observable strings
                                self.updateObservableStrings();
                                self.isStringsReady(true);
                                self.emit('change', self.language());
                            }
                            else {
                                I18n.oLogger.fatal('Erreur lors du chargement des libellés %s: %s'.format(url, status));
                                throw 'Erreur lors du chargement des libellés %s: %s'.format(url, status);
                            }
                        };
                        // Set the language
                        lang = lang || this.language() || DEFAULT_LANGUAGE;
                        if (manager.SUPPORTED_LANGUAGES[lang]) {
                            // Get the url of the strings
                            url = I18n.getStringsUrl(lang);
                            // Set the context
                            context = {
                                requestedLanguage: lang
                            };
                            // Load the strings
                            Query.GETasJson(url, stringsLoaded, context, { upToDate: false });
                        }
                    };
                    I18n.prototype.updateObservableStrings = function () {
                        var _this = this;
                        $.each(this.localizedStrings, function (k, v) {
                            var observableString = _this.getObservableString(k);
                            observableString(v);
                        });
                    };
                    I18n.prototype.getObservableString = function (key, defaultValue) {
                        // Get the observable string with the given id
                        var observableString = this.localizedObservableStrings[key];
                        if (!observableString) {
                            if (isset(defaultValue)) {
                                observableString = this.localizedObservableStrings[defaultValue];
                                if (!observableString) {
                                    observableString = ko.observable(defaultValue);
                                }
                            }
                            else {
                                // Create a new observable string with the localized string
                                observableString = this.localizedObservableStrings[key] = ko.observable();
                                observableString(this.getString(key, key));
                            }
                        }
                        return observableString;
                    };
                    /**
                     * Gets the localized string for the given key.
                     * @param {string} key The key of the desired label.
                     * @return {string} The localized string.
                     */
                    I18n.prototype.getString = function (key, defaultValue) {
                        return I18n.getStringOrKey(this.localizedStrings[key], isset(defaultValue) ? defaultValue : key);
                    };
                    I18n.prototype.getCurrentLanguage = function () {
                        var locale = this.language();
                        if (manager.SUPPORTED_LANGUAGES[locale]) {
                            return locale;
                        }
                        return DEFAULT_LANGUAGE;
                    };
                    // return the browser language if this language is one of the supported ones
                    // else it returns the default language set in the browserLanguageInfos.js file 
                    I18n.prototype.getLanguageFromBrowser = function () {
                        var language = knockit.helpers.browser.getBrowserInfos().countryCode;
                        if (language) {
                            var oLocale_ = Object.findBy(this.oListLocales, 'getLang', language);
                            if (oLocale_) {
                                return oLocale_.getIsoCode();
                            }
                        }
                        return DEFAULT_LANGUAGE;
                    };
                    I18n.getStringOrKey = function (str, key) {
                        return (str === null || str === undefined) ? key : str;
                    };
                    I18n.getStringsUrl = function (language) {
                        return knockit.utils.formatString(LOCALE_PATH, {
                            "path": app.servicesPath,
                            "device": app.context.device,
                            "app": app.context.app,
                            "page": app.context.page,
                            "lang": language
                        });
                    };
                    I18n.prototype.init = function () {
                        var _this = this;
                        this.language.subscribe(function (lang) {
                            if (manager.SUPPORTED_LANGUAGES[lang]) {
                                _this.loadStrings(lang);
                            }
                        });
                        this.language(this.getLanguageFromBrowser());
                        ko.computed(function () {
                            if (_this.isStringsReady()) {
                                _this.isReady(true);
                            }
                        }, this);
                    };
                    I18n.oLogger = Logger.getLogger('kit.manager.I18n');
                    return I18n;
                })(knockit.BaseManager);
                manager.I18n = I18n;
            })(manager = knockit.manager || (knockit.manager = {}));
        })(knockit = fwk.knockit || (fwk.knockit = {}));
    })(fwk = fr.fwk || (fr.fwk = {}));
})(fr || (fr = {}));
