import { Logger, TLogLevel, ConsoleAppender, RemoteAppender } from '@webkit/helper/logger';
import { Browser } from '@webkit/helper/browser';
import { I18n } from '@webkit/manager/i18n';
import { SelectField } from '@webkit/form/SelectField';
import { EventsBinder, IEventsBinder } from '@webkit/core/EventsBinder.class';
import { AppManager } from '@webkit/core/AppManager.class';
import { BaseManager } from '@webkit/core/Manager.class';
import { MessageBox, IMessageBoxOptions } from '@webkit/ui/messageBox';
import { TDialogButtons } from '@webkit/core/MVVMDialog.class';
import { Query } from '@webkit/helper/query';

let logger: Logger = Logger.getLogger('Application');

declare var window: any;

interface IApplicationContext {
    device: string
    page: string
}

interface IApplication extends IEventsBinder {
    title: KnockoutObservable<string>
    i18n: I18n
    browser: Browser
    manager: AppManager
    configuration: any
    webkitPath: string
    webkitLogUri: string
    basePath: string
    servicesPath: string
    useDialog: boolean
    version: string
    logLevel: number
    logConsole: boolean
    onAjaxSend: Function
    getFinalFileName(fileName: string): string
    goto(uri: string): void
    navigateTo(href: string): void
    context: IApplicationContext
    isReady: KnockoutObservable<boolean>
    ready(fn: Function, context?: any): void
    init(configuration?: any): void
    mailto(data: any): void
    postRedirect(url: string, data_post: any, target?: string, data_get?: any): void
    dialog(title: string, text: string, buttons?: any, callback?: Function, opts?: any): any
    alert(title: string, text: string, callbackAlert?: Function, opts?: any): any
    confirm(title: string, text: string, callbackOk?: Function, callbackCancel?: Function, opts?: any): any
}

export class Application extends EventsBinder {

    public title: KnockoutObservable<string> = ko.observable<string>();
    public isReady: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    public version: string = null;
    public manager: AppManager = new AppManager();
    public useDialog: boolean = false;
    public servicesPath: string = "";
    public basePath: string = "";
    public webkitPath: string = "";
    public webkitLogUri: string = "";
    public i18n: I18n
    public browser: Browser
    public context: IApplicationContext = <any>{};
    public configuration: any = {};
    public onAjaxSend: Function = null;

    constructor() {
        super();

        window.app = this;

        let location: any = window.location;
        this.servicesPath = location.protocol + "//" + location.host + "/";
        this.webkitPath = this.servicesPath;
        this.browser = new Browser();

        this.i18n = <I18n>this.manager.register('i18n', new I18n(browserLocaleInfos["Locales"]));

    }

    public getFinalFileName(fileName: string): string {
        if (this.version) {
            fileName += (fileName.indexOf('?') == -1 ? '?' : '&') + '_v=' + encodeURIComponent(this.version)
        }
        return fileName
    }
    
    public goto(uri: string): void {
        this.navigateTo(app.servicesPath + uri);    
    }

    public navigateTo(href: string): void {

        this.emit('navigate', href);

        window.location.assign(href);
    }

    /* Redirige l'internaute vers une url en méthode POST */
    public postRedirect(url: string, data_post: any, target: string = "_blank", data_get: any = null) {
        let idForm_: string = "kopostform";
        let urlDataPrefix_: string = "";

        if (!url) return;

        if (url.indexOf("?") == -1) {
            urlDataPrefix_ = "?";
        }

        $.each(data_get || {}, function(k: string, v: string) {
            url += urlDataPrefix_ + encodeURIComponent(k) + "=" + encodeURIComponent(v);
            urlDataPrefix_ = "&";
        });

        let sDataForm_ = "";

        $.each(data_post || {}, function(k: string, v: string) {
            sDataForm_ += "<input type='hidden' name='" + k + "' value='" + v + "'>";
        });

        let $form: JQuery = $("#" + idForm_);

        if ($form.length > 0) {
            $form.attr("action", url);
            $form.html(sDataForm_);
        } else {
            $("body").append("<form id='" + idForm_ + "' action='" + url + "' method='POST' target='" + target + "'>" + sDataForm_ + "</form>");
        }

        $("#" + idForm_).submit();

    }

    public ready(fn: Function, context?: any): void {
        if (this.isReady()) {
            fn.call(context, fn);
        } else {
            this.isReady.subscribe(function(b: boolean): void {
                if (b) {
                    fn.call(context, fn);
                }
            });
        }
    }
    
    /**
     * Boîte de dialogue neutre
     */
    public dialog(title: string, text: string, buttons: any = TDialogButtons.Ok, callback?: Function, opts?: IMessageBoxOptions): MessageBox {
        return MessageBox.create(app.i18n.getString(title, app.title()), app.i18n.getString(text, text), buttons, callback, opts)    
    }
    
    /**
     * Boîte de message d'alerte
     */
    public alert(title: string, text: string, callbackAlert?: Function, opts?: IMessageBoxOptions): MessageBox {
        return MessageBox.alert(app.i18n.getString(title, app.title()), app.i18n.getString(text, text), callbackAlert, opts)
    }

    /**
     * Boîte de message de confirmation
     */
    public confirm(title: string, text: string, callbackOk?: Function, callbackCancel?: Function, opts?: IMessageBoxOptions): MessageBox {
        return MessageBox.confirm(app.i18n.getString(title, app.title()), app.i18n.getString(text, text), callbackOk, callbackCancel, opts)
    }
    
    /**
     * Affiche la bar pour acceptation des cookies
     */
    public showCookieBar(options?: any): void {

        let opts_: any = {
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

        if (this.configuration && this.configuration.plugins && this.configuration.cookieBar && typeof (this.configuration.plugins.cookieBar.options) == 'object') {
            opts_ = $.extend(opts_, this.configuration.plugins.cookieBar.options);
        }

        if (typeof (options) == 'object') {
            opts_ = $.extend(opts_, options);
        }

        $.cookieBar(opts_);
    }


    /**
     * Envoi d'un email
     */
    public mailto(data: any) {
        let to: string;
        let cc: string;
        let bcc: string;
        let subject: string;
        let body: string;

        if (typeof (data) == "string") {
            to = data;
        } else {
            to = data['to'];
            cc = data['cc'];
            subject = data['subject'];
            bcc = data['bcc'];
            body = data['body'];
        }

        app.navigateTo("mailto:" + to + "?"
            + (cc ? "cc=" + cc + "&" : "")
            + (subject ? "subject=" + subject + "&" : "")
            + (bcc ? "bcc=" + bcc + "&" : "")
            + (body ? "body=" + body : ""));

    }
    
    private initEvents(): void {
        /**
         * jquery events
         */
        // push event keydown when user do a drag&drop
        $(document).on('dragend drop', 'input', function() {
            $(this).trigger('keydown');
        })
    
        // Fix bug on Firefox : ESC close web socket...
        $(window).keydown(function(event) {
            // check for escape key
            if (event.which == 27) {
                // the following seems to fix the symptom but
                // only in case the document has the focus
                event.preventDefault()
            }
        });
    }
    
    private initManagers(): void {
        
        let managersId: string[] = [];
        
        $.each(this.manager.getManagers(), (id: string, manager: BaseManager): void => {
            managersId.push(id);
            manager.init();
            manager.on('initError', (): void => {
                this.emit('initManagerError', manager);
            });
        });

        app.manager.ready(managersId, (): void => {
            this.isReady(true);
        });
    }

    public init(conf?: any): void {

        this.configuration = $.extend(this.configuration, conf || {});

        Logger.getDefaultLogger().level(this.configuration.logLevel || TLogLevel.ERROR);
        if (this.configuration.logConsole === true) {
            Logger.getDefaultLogger().addAppender(new ConsoleAppender());
        }

        if(this.webkitLogUri) {
            let remoteAppender: RemoteAppender = new RemoteAppender(this.servicesPath + this.webkitLogUri + this.context.page);
            remoteAppender.level = TLogLevel.ERROR;
            Logger.getDefaultLogger().addAppender(remoteAppender);
        }

        this.emit('init');

        logger.info("Initialisation de l'application");
        
        Query.defaultOptions.upToDate = true;

        if (!window.location.origin) {
            let location: any = window.location;
            location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
    
        // Filter url queries
        $(document).ajaxSend((event, jqxhr, settings): void => {
            
            if(typeof(this.onAjaxSend) == "function") {
                this.onAjaxSend(settings, jqxhr);
            }
            
            settings.url = this.getFinalFileName(settings.url)
        })

        this.initEvents();
        
        if (this.configuration.httpSafeMethods === true) {
            $.ajaxPrefilter((options, originalOptions, jqXHR): void => {
                if (options.type != 'GET' && options.type != 'POST') {
                    logger.debug("Remplacement de la méthode '" + options.type + "' par 'POST' dans l'entête X-HTTP-Method-Override");
                    jqXHR.setRequestHeader('X-HTTP-Method-Override', options.type);
                    options.type = 'POST';
                }
            });
        }
        
        if(this.configuration.jetonCSRF) {
            $.ajaxPrefilter((options, originalOptions, jqXHR): void => {
                logger.debug("Ajout du jeton CSRF dans l'entête X-CSRF");
                jqXHR.setRequestHeader('X-CSRF', this.configuration.jetonCSRF);
            });      
        }

        if (this.configuration.browsers) {
            this.browser.setSupportedVersions(this.configuration.browsers);
            this.browser.check((result: any, browserInfo: any): void => {
                this.emit('initBrowserVerification', result, browserInfo);
            });
        }

        if (this.configuration.plugins && this.configuration.plugins.cookieBar) {

            let enableCookieBar_: boolean = this.configuration.plugins.cookieBar === true || this.configuration.plugins.cookieBar.enabled === true;

            if (enableCookieBar_) {

                this.ready((): void => {
                    this.showCookieBar({ forceShow: false });
                });
            }
        }

        if (this.configuration.useNativeDialogSelect === false) {
            this.disabledNativeDialogSelect();
        }

        if (this.configuration.scrollDetection) {
            
            if(this.configuration.scrollDetection.enable === true || !isset(this.configuration.scrollDetection.enable)) {
                this.enableScrollDetection(this.configuration.scrollDetection);
            }
        }
        
        this.initManagers();

    }

    private disabledNativeDialogSelect(): void {
        
        logger.debug('Disable native dialog');
        
        SelectField.useNativeDialogSelect(false);
    }

    private enableScrollDetection(params: any): void {

        logger.debug('Scroll detection active');
        
        let owner: string = params.owner || 'body';
        let timeout: number = params.timeout || 200;
        
        let scrollTempo_;
        let self: any = this;
        
        let friseScrollFunction: any = function(e: Event): void {
            
            let $document = $(document);
            let $app = $(owner);

            if(!$app.hasClass('scrolling')) {
                self.emit('scrollstart');
                $app.addClass('scrolling');
            }

            if ($document.scrollTop() > 0) {
                $app.addClass('scrolled');
            } else {
                $app.removeClass('scrolled');
            }

            if (scrollTempo_) {
                clearTimeout(scrollTempo_);
            }

            scrollTempo_ = defer(function() {
                $document.trigger('scrollstop');
                self.emit('scrollstop');
            }, timeout);

        };

        $(window).on('scroll.scrollDetection', friseScrollFunction); // IE8 OK (et le reste du monde)
        $(window).on('resize.scrollDetection', friseScrollFunction);

        $(document).on('ready.scrollDetection scrollstop.scrollDetection', function() {
            let $document = $(document);
            $(owner).removeClass('scrolling');
        });

    }
}

export function alert(text: string, callbackAlert?: any, opts?: IMessageBoxOptions): MessageBox {
    if(app.useDialog) {
        return MessageBox.alert(app.title(), text, callbackAlert, opts)
    }
    let r = window.alert(text)
    fire(callbackAlert, r)
    return <any>r;
}

export function confirm(text: string, callbackOk?: Function, callbackCancel?: any, opts?: IMessageBoxOptions): MessageBox {
    if(app.useDialog) {
        return MessageBox.confirm(app.title(), text, callbackOk, callbackCancel, opts)
    }
    let r = window.confirm(text)
    if(r && callbackOk) {
        fire(callbackOk, r)
    }
    if(!r && callbackCancel) {
        fire(callbackCancel, r)
    }
    return <any>r;
}