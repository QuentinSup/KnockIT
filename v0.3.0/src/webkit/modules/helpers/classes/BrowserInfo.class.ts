var UNKNOWN: string = "Unknown"

var dataOS: any[] = [{
    pattern: navigator.platform,
    subString: "Win",
    identity: "Windows"
}, {
    pattern: navigator.platform,
    subString: "Mac",
    identity: "Mac"
}, {
    pattern: navigator.userAgent,
    subString: "iPhone",
    identity: "iPhone/iPod"
}, {
    pattern: navigator.platform,
    subString: "Linux",
    identity: "Linux"
}]

var dataBrowser: any[] = [{
    pattern: navigator.userAgent,
    subString: "Chrome",
    identity: "Chrome"
}, {
    pattern: navigator.userAgent,
    subString: "OmniWeb",
    versionSearch: "OmniWeb/",
    identity: "OmniWeb"
}, {
    pattern: navigator['vendor'],
    subString: "Apple",
    identity: "Safari",
    versionSearch: "Version"
}, {
    prop: window['opera'],
    identity: "Opera",
    versionSearch: "Version"
}, {
    pattern: navigator['vendor'],
    subString: "iCab",
    identity: "iCab"
}, {
    pattern: navigator['vendor'],
    subString: "KDE",
    identity: "Konqueror"
}, {
    pattern: navigator.userAgent,
    subString: "Firefox",
    identity: "Firefox"
}, {
    pattern: navigator['vendor'],
    subString: "Camino",
    identity: "Camino"
}, {
    pattern: navigator.userAgent,
    subString: "MSIE",
    identity: "Explorer",
    versionSearch: "MSIE"
}, {
    pattern: navigator.userAgent,
    subString: "IEMobile",
    identity: "IEMobile",
    versionSearch: "rv"
}, {
    pattern: navigator.userAgent,
    subString: "Trident/",
    identity: "Explorer",
    versionSearch: "rv"
}, {
    pattern: navigator.userAgent,
    subString: "Gecko",
    identity: "Mozilla",
    versionSearch: "rv"
}, { // for newer Netscapes (6+)
    pattern: navigator.userAgent,
    subString: "Netscape",
    identity: "Netscape"
}, { // for older Netscapes (4-)
    pattern: navigator.userAgent,
    subString: "Mozilla",
    identity: "Netscape",
    versionSearch: "Mozilla"
}]

export var getBrowserLanguage = function(): string {

    var browserLanguage: string = navigator['language']
	if (!browserLanguage) {
        browserLanguage = navigator['userLanguage']
	}
       
	return browserLanguage
    
}

export class BrowserInfo {

    public browser: string
    public version: number
    public OS: string
    public language: string
    public countryCode: string

    private versionSearchString: string

	constructor() {

        this.browser = this.searchString(dataBrowser) || UNKNOWN
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || -1;
		this.OS = this.searchString(dataOS) || UNKNOWN
        this.language = getBrowserLanguage()
        this.countryCode = this.language.substr(0, this.language.indexOf('-')) || this.language
        
        //window.alert(navigator.userAgent + "> " + this.browser + " " + this.version);

	}
    
    /** Détermine si on est PROBABLEMENT sur la version ModernUI (on ne peut pas en être sûr, merci Microsoft) */
    public isProbablyModernUI(): boolean {
        
        
        /* URL : http://stackoverflow.com/questions/10964966/detect-ie-version-in-javascript */
        var isIE: boolean = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) ;
        
        /* URL : http://stackoverflow.com/questions/8751479/javascript-detect-metro-ui-version-of-ie */
        
        /** Metro doesn't allow any activex content, but desktop IE can have it set to disabled as well */
        function isActiveXEnabled() {
            var supported = null;        
            try {
                supported = !!new ActiveXObject("htmlfile");
            } catch (e) {
                supported = false;
            }
        
            return supported;
        }
        
        /** Metro will always be in full screen mode, however Desktop IE can also run in full screen mode, but this could be used as supporting evidence of Metro mode */
        function isFullScreen() {
            return (window.innerWidth == screen.width && window.innerHeight == screen.height);
        }
        
        return isIE && !isActiveXEnabled() && isFullScreen() ;
    }
    
    private searchString(data: any): string {
        for (var i: number = 0; i < data.length; i++) {
            var dataString = data[i].pattern
			var dataProp = data[i].prop
			this.versionSearchString = data[i].versionSearch || data[i].identity
			if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) {
					return data[i].identity
                }
            } else if (dataProp) {
				return data[i].identity
            }
        }
    }

    private searchVersion(dataString: string): number {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1)
			return
		return parseFloat(dataString.substring(index + this.versionSearchString.length + 1))
	}

}