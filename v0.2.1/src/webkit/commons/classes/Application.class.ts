module kit {

    import Logger = helpers.Logger;
    import Browser = helpers.Browser;
    import ConsoleAppender = helpers.ConsoleAppender;
    import RemoteAppender = helpers.RemoteAppender;
    import I18n = manager.I18n;
    
    var oLogger: Logger = Logger.getLogger('kit.Application');
    
    export class Application extends EventsBinder {
        
        public title: KnockoutObservable<string> = ko.observable<string>();
        public isReady: KnockoutObservable<boolean> = ko.observable<boolean>(false);
        public version: string = null;
        public manager: AppManager = new AppManager();
        public logLevel: number = 5;
        public logConsole: boolean = false;
        public useDialog: boolean = false;
        public servicesPath: string = "";
        public basePath: string = "";
        public webkitPath: string = "";
        public webkitLogUri: string = "";
        public i18n: I18n
        public browser: Browser
        public context: IApplicationContext = <any>{};
        public userData: any = {};
        public onAjaxSend: Function = null;
        
        constructor() {
            super();
            
            var location: any = window.location;
            this.servicesPath = location.protocol + "//" + location.host + "/";
            this.webkitPath = this.servicesPath;
            this.browser = new Browser();
            
            this.i18n = <manager.I18n>this.manager.register('i18n', new manager.I18n(browserLocaleInfos["Locales"]));
            
        }
        
        public getFinalFileName(fileName: string): string {
            if(this.version) {
                fileName += (fileName.indexOf('?')==-1?'?':'&') + '_v=' + encodeURIComponent(this.version)
            }
            return fileName
        }
        
        public navigateTo(href: string): void {
            
            this.emit('navigate', href);
            
            window.location.assign(href);
        }
        
        /* Redirige l'internaute vers une url en méthode POST */
        public postRedirect(url: string, data_post: any, target: string = "_blank", data_get: any = null) {
            var idForm_: string = "kopostform";
            var urlDataPrefix_ : string = "";
            
            if(!url) return;
            
            if (url.indexOf("?") == -1 ) {
                urlDataPrefix_ = "?";
            }
            
            $.each(data_get || {}, function(k: string, v: string) {
                url += urlDataPrefix_ + encodeURIComponent(k) + "=" + encodeURIComponent(v);
                urlDataPrefix_ = "&";
            });
            
            var sDataForm_ = "";
            
            $.each(data_post || {}, function(k: string, v: string) {
                sDataForm_ += "<input type='hidden' name='"+k+"' value='"+v+"'>";
            });
           
            var $form: JQuery = $("#"+idForm_);
            
            if($form.length > 0){
                $form.attr("action", url);
                $form.html(sDataForm_);
            } else {
                $("body").append("<form id='"+idForm_+"' action='"+url+"' method='POST' target='" + target + "'>"+sDataForm_+"</form>");
            }
            
            $("#"+idForm_).submit();
        
        }

        public ready(fn: Function, context?: any): void {
            if(this.isReady()) {
                fn.call(context, fn);
            } else {
                this.isReady.subscribe(function(b: boolean): void {
                    if(b) {
                        fn.call(context, fn);
                    }
                });
            }
       }

        /**
         * Affiche la bar pour acceptation des cookies
         */
       public showCookieBar(options?: any): void {
           
            var opts_: any = {
                message: this.i18n.getString('app.plugins.cookieBar.message'),
                acceptText: this.i18n.getString('app.plugins.cookieBar.acceptText'),
                declineText: this.i18n.getString('app.plugins.cookieBar.declineText'),
                acceptButton: true,
                zindex: '9999999',
                fixed: true,
                bottom: true,
                domain: this.servicesPath,
                forceShow: true
            };
            
            if(this.userData && this.userData.plugins && this.userData.cookieBar && typeof(this.userData.plugins.cookieBar.options) == 'object') {
                opts_ = $.extend(opts_, this.userData.plugins.cookieBar.options);
            }
           
            if(typeof(options) == 'object') {
                opts_ = $.extend(opts_, options);    
            }
            
            $.cookieBar(opts_);    
       }
        
        
       /**
        * Envoi d'un email
        */
       public mailto(data: any) {
           var to: string;
           var cc: string;
           var bcc: string;
           var subject: string;
           var body: string;
           
           if(typeof(data) == "string") {
                to = data;
           } else {
               to   = data['to'];
               cc   = data['cc'];
               subject = data['subject'];
               bcc  = data['bcc'];
               body = data['body'];
           }
           
           app.navigateTo("mailto:" + to + "?" 
                + (cc?"cc=" + cc + "&":"")
                + (subject?"subject=" + subject + "&":"")
                + (bcc?"bcc=" + bcc + "&":"")
                + (body?"body=" + body:""));
           
       }
        
        public init(userData?: any): void {
            
            this.userData = $.extend(this.userData, userData || {});
            
            Logger.getDefaultLogger().level(app.logLevel);
            if(app.logConsole) {
                Logger.getDefaultLogger().addAppender(new ConsoleAppender());
            }
            
            var oRemoteAppender_: RemoteAppender = new RemoteAppender(app.servicesPath + app.webkitLogUri + app.context.page);
            oRemoteAppender_.level = helpers.TLogLevel.ERROR;
            
            Logger.getDefaultLogger().addAppender(oRemoteAppender_);
            
            this.emit('init');

            oLogger.info("Initialisation de l'application");            
            
            var managersId_: string[] = [];
            var self = this;
            
            $.each(this.manager.getManagers(), function(id: string, manager: BaseManager): void {
                managersId_.push(id);
                manager.init();
                manager.on('initError', function() {
                    self.emit('initError', manager);
                });
            });
            
            app.manager.ready(managersId_, (): void => {       
                this.isReady(true);
             });
            
            if(this.userData.httpSafeMethods === true) {
                $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                     if (options.type != 'GET' && options.type != 'POST') {
                         oLogger.debug("Remplacement de la méthode '" + options.type + "' par 'POST' dans l'entête X-HTTP-Method-Override");  
                         var headerValue: string = options.type;
                         jqXHR.setRequestHeader('X-HTTP-Method-Override', headerValue);
                         options.type = 'POST';
                     }
                });
            }
            
            if(this.userData.browsers) {
                this.browser.setSupportedVersions(this.userData.browsers);
                this.browser.check((result: any, browserInfo: any): void => {
                    this.emit('initBrowserVerification', result, browserInfo);
                });
            }
            
            if(this.userData.plugins && this.userData.plugins.cookieBar) {
                
                var enableCookieBar_: boolean = this.userData.plugins.cookieBar === true || this.userData.plugins.cookieBar.enabled === true;
                
                if(enableCookieBar_) {
                
                    this.ready((): void => {
                       this.showCookieBar({ forceShow: false });
                    });
                }
            }

        }
        
    }
}