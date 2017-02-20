module kit {
    
    export var Locales: any = { 
        "en":
            {
                "localeName": "English",
                "isoCode":"en_US",
                "unsupportedBrowserMsg":"The browser you are using is not supported by this application. We advise you to use a supported browser among those in the list here-below",
                "unsupportedBrowserVersionMsg":"The browser version you are using is not supported by this application. We advise you to upgrade your browser to a newer version.",
                "format": {
                    "decimal": {
                        "groupSeparator": ",",
                        "groupDigits": 3,
                        "separator": "."
                    },
                    "date": {
                        "format": "yyyy-mm-dd",
                        "separator": "-",
                        "literalFormat": "YMD"
                    },
                    "currency": {
                        "symbol": "€"
                    }
                }
            },
        "fr":
            {
                "localeName": "Français",
                "isoCode":"fr_FR",
                "isDefaultLanguage":"true",
                "unsupportedBrowserMsg":"Le navigateur que vous utilisez n'est pas supporté par cette application. Nous vous conseillons d'utiliser plutôt un des navigateurs de la liste ci-dessous",
                "unsupportedBrowserVersionMsg":"La version du navigateur que vous utilisez n'est pas supportée par cette application. Nous vous conseillons de mettre à jour votre navigateur à une version plus récente.",
                "format": {
                    "decimal": {
                        "groupSeparator": " ",
                        "groupDigits": 3,
                        "separator": ","
                    },
                    "date": {
                        "format": "dd/mm/yyyy",
                        "separator": "/",
                        "literalFormat": "DMY"
                    },
                    "currency": {
                        "symbol": "€"
                    }
                }
            }
        };
 }