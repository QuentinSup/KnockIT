/// <reference path="./classes/BrowserInfo.class.ts"/>

/**
 * @fileOverview This file defines the browser support
 */
module fr.fwk.knockit.helpers.browser {

	var IS_BROWSER_SUPPORTED: string = "isBrowserSupported"
	var IS_BROWSER_VERSION_SUPPORTED: string = "isBrowserVersionSupported"

    var browserInfos = new BrowserInfo()

    export interface ISupportedBrowserInfo {
        name: string
        minVersion: number
    }

	export var getSupportedBrowsersInfo = function(): ISupportedBrowserInfo[] {
		return browserLocaleInfos["Browsers"];
	}

	var getSupportedResultForCurrentBrowser = function(): any {
		var currentBrowserInfos: BrowserInfo = getBrowserInfos()
		var currentBrowser: string = currentBrowserInfos.browser
		var currentBrowserVersion: number = currentBrowserInfos.version
		var currentBrowserSupportedResult = getSupportedResultForBrowser(currentBrowser, currentBrowserVersion)
		return currentBrowserSupportedResult
	}

	var getSupportedResultForBrowser = function(browserName: string, version: number): any {
		var supportedResult: any = {}
		supportedResult[IS_BROWSER_SUPPORTED] = false
		supportedResult[IS_BROWSER_VERSION_SUPPORTED] = false
        
        var supportedBrowsersInfo: any = getSupportedBrowsersInfo();
		var browserInfo: ISupportedBrowserInfo = null
		var len: number = getSupportedBrowsersInfo().length
		var from: number = 0

		for (; from < len; from++) {
			if (from in supportedBrowsersInfo && supportedBrowsersInfo[from].name == browserName) {
				browserInfo = supportedBrowsersInfo[from]
				break
			}
		}
		
		if (browserInfo != null) {
			// we have found the browser name in the array of the supported browser infos
			// so the user is using a supported browser
			supportedResult[IS_BROWSER_SUPPORTED] = true

			// now let's check if the version is supported
			var browserSupportedMinVersion: number = browserInfo.minVersion
			if (version >= browserSupportedMinVersion) {
				// the version used by the user is supported
				supportedResult[IS_BROWSER_VERSION_SUPPORTED] = true
			}
		}
		return supportedResult
	}

	export var getBrowserInfos = function():BrowserInfo {
		return browserInfos
	}

    export var check = function(): void {
	    ///////////////////////////////////////////////////////////////
	    /////////////////  BROWSER SUPPORT CHECK  /////////////////////
	    ///////////////////////////////////////////////////////////////
	    // let's check if the user is trying to accessing the app with a supported browser and
	    // browser version
	    var browserSupportedInfo = getSupportedResultForCurrentBrowser()
	    var isBrowserSupported: boolean = browserSupportedInfo[IS_BROWSER_SUPPORTED]
	    var isNotSupportedMessageToBeDisplayed: boolean = false
	    var notificationMessage: string = ""

        // let's get the browser language
        var browserLanguage: string = browserInfos.countryCode
        
        var browserLocaleInfos_: any = browserLocaleInfos["Locales"][browserLanguage] || browserLocaleInfos["Locales"]["en"];
        
	    if (!isBrowserSupported) {
		    // the browser is not supported
		    isNotSupportedMessageToBeDisplayed = true

		    // TODO: we need to complete the message to display to make sure all its localizations are displayed at the same time
		    var supportedBrowsersInfos: ISupportedBrowserInfo[] = getSupportedBrowsersInfo()
		    var supportedBrowsersString: string = ""
		    var browserInfo: ISupportedBrowserInfo
		    var listLength: number = supportedBrowsersInfos.length

		    for (var i: number = 0; i < listLength; i++) {
			    if (i > 0) {
				    supportedBrowsersString += ", "
			    }
			    browserInfo = supportedBrowsersInfos[i]
			    supportedBrowsersString += browserInfo.name
			    supportedBrowsersString += " "
			    supportedBrowsersString += browserInfo.minVersion
		    }

		    notificationMessage = browserLocaleInfos_.unsupportedBrowserMsg + "\n\n" + supportedBrowsersString;

	    } else {
		    var isBrowserVersionSupported: boolean = browserSupportedInfo[IS_BROWSER_VERSION_SUPPORTED]
		    if (!isBrowserVersionSupported) {
			    // the browser version is not supported
			    isNotSupportedMessageToBeDisplayed = true

			    notificationMessage = browserLocaleInfos_.unsupportedBrowserVersionMsg
		    }
	    }

	    if (isNotSupportedMessageToBeDisplayed) {
		    alert(notificationMessage)
	    }
    }
    
}