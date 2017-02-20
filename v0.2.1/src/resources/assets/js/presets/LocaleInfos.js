;if(!window.browserLocaleInfos) {
	window.browserLocaleInfos = {
		"Browsers": [{
			name: "Chrome",
			minVersion: 24.0
		},
		{
			name: "Explorer",
			minVersion: 8.0
		},
		{
			name: "Firefox",
			minVersion: 15.0
		},
		{
			name: "Opera",
			minVersion: 11.6
		},
		{
			name: "Safari",
			minVersion: 7.0
		},
		{
			name: "IEMobile",
			minVersion: 11.0
		}
	],
	"Locales": { 
		"en":
			{
	            "localeName": "English",
				"isoCode":"en_US",
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
		}
	};
}