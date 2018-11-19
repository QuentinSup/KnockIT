/// <reference path="./classes/BrowserInfo.class.ts"/>

/**
 * @fileOverview This file defines the browser support
 */
module fr.ca.cat.helpers {


    export interface ISupportedBrowserInfo {
        name: string
        minVersion: number
    }

    export class Browser {
    
        public currentBrowserInfos = new BrowserInfo()
        private supportedVersions = [];
        
        constructor(supportedVersions: ISupportedBrowserInfo[] = []) {
            this.setSupportedVersions(supportedVersions);
        }
        
        public setSupportedVersions(supportedVersions: ISupportedBrowserInfo[]) {
            this.supportedVersions = supportedVersions;    
        }
        
        /**
         * Retourne les informations issues du browser
         */
        public getCurrentBrowserInfos(): BrowserInfo {
            return this.currentBrowserInfos;
        }

        /**
         * Contrôle le navigateur et la version min par rapport aux informations du browser
         */
    	public check(fn?: Function): boolean {
    		var currentBrowserInfos: BrowserInfo      = this.getCurrentBrowserInfos();
    		var currentBrowser: string                = currentBrowserInfos.browser;
    		var currentBrowserVersion: number         = currentBrowserInfos.version;
    		return this.checkForBrowser(currentBrowser, currentBrowserVersion, fn);
    	}

        /**
         * Contrôle le navigateur et la version min par rapport aux informations passées en parametres
         */
    	public checkForBrowser(browserName: string, version: number, fn?: Function): boolean {
            
            var supportedBrowsersInfo: ISupportedBrowserInfo[] = this.supportedVersions;
    		var browserInfo: ISupportedBrowserInfo = null
    		var len: number = supportedBrowsersInfo.length
            var result: boolean = true;
            
    		for (var i: number = 0; i < len; i++) {
    			if (supportedBrowsersInfo[i] && supportedBrowsersInfo[i].name == browserName) {
    				browserInfo = supportedBrowsersInfo[i]
    				break
    			}
    		}
    		
    		if (result && browserInfo != null) {
                
    			// now let's check if the version is supported
    			var browserSupportedMinVersion: number = browserInfo.minVersion
    			if (browserSupportedMinVersion && version < browserSupportedMinVersion) {
    				result = false;
    			}
    		}
         
            if(typeof(fn) == "function") {
                fn.call(this, result, browserInfo);
            }
            
    		return result
    	}

    }
    
}