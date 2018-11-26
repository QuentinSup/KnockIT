import { BrowserInfo } from './classes/BrowserInfo.class';

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
		let currentBrowserInfos: BrowserInfo      = this.getCurrentBrowserInfos();
		let currentBrowser: string                = currentBrowserInfos.browser;
		let currentBrowserVersion: number         = currentBrowserInfos.version;
		return this.checkForBrowser(currentBrowser, currentBrowserVersion, fn);
	}

    /**
     * Contrôle le navigateur et la version min par rapport aux informations passées en parametres
     */
	public checkForBrowser(browserName: string, version: number, fn?: Function): boolean {
        
        let supportedBrowsersInfo: ISupportedBrowserInfo[] = this.supportedVersions;
		let browserInfo: ISupportedBrowserInfo = null
		let len: number = supportedBrowsersInfo.length
        let result: boolean = true;
        
		for (let i: number = 0; i < len; i++) {
			if (supportedBrowsersInfo[i] && supportedBrowsersInfo[i].name == browserName) {
				browserInfo = supportedBrowsersInfo[i]
				break
			}
		}
		
		if (result && browserInfo != null) {
            
			// now let's check if the version is supported
			let browserSupportedMinVersion: number = browserInfo.minVersion
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