import { Logger } from '@webkit/helper/logger'; 
import { ViewModel } from '@webkit/core/ViewModel.class'; 

let logger: Logger = Logger.getLogger('MVVM');

export class ResponsiveViewModel extends ViewModel {

    public normalWidth: number = 1200
    public tabletWidth: number = 768
    public bigTabletWidth: number=992
    
    public isMobile: KnockoutObservable<boolean> = ko.observable(false)
    public isTablet: KnockoutObservable<boolean> = ko.observable(false)
    public isNormal: KnockoutObservable<boolean> = ko.observable(true)
    public isBigTablet : KnockoutObservable<boolean> = ko.observable(false)
    
    constructor(stringsToRegister: string[]) {

        super(stringsToRegister)
        
        $(document).ready((): void => {
        
            var resizeFn_ = (): void => {
            
                
                var innerWidth: number = window.innerWidth
                
                if(!innerWidth) {
                    if (document.body && document.body.offsetWidth) {
                        innerWidth = document.body.offsetWidth;
                    }
                    if (document.compatMode=='CSS1Compat' &&
                        document.documentElement &&
                        document.documentElement.offsetWidth ) {
                        innerWidth = document.documentElement.offsetWidth;
                    }
                }
                
                if(innerWidth >= this.normalWidth) {
                    this.isTablet(false)
                    this.isMobile(false)
                    this.isNormal(true)
                    this.isBigTablet(false)
                } else if(innerWidth < this.normalWidth && innerWidth >= this.bigTabletWidth) {
                    this.isMobile(false)
                    this.isNormal(false)
                    this.isTablet(true)
                    this.isBigTablet(true)
                } else if(innerWidth < this.normalWidth && innerWidth >= this.tabletWidth) {
                    this.isMobile(false)
                    this.isNormal(false)
                    this.isTablet(true)
                    this.isBigTablet(false)
                } else if(innerWidth < this.tabletWidth) {
                    this.isTablet(false)
                    this.isNormal(false)
                    this.isMobile(true)
                    this.isBigTablet(false)
                }
            };
            
            resizeFn_()
            
            $(window).bind('resize', (e): void => {
                resizeFn_()
                
                this.emit('resize');
                
             })
        })
        
    }
}