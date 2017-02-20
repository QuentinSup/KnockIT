module kit.main {

    import Logger = helpers.Logger;
    
    var LANGUAGE_HASH_KEY: string = "lang"

    var oLogger: Logger = Logger.getLogger('kit.main');
    
    /*
    window.onerror = function(msg, url, line) {
        alert(url + ": Erreur à la ligne" + line + "\n" + msg);
        oLogger.error(url + ": Erreur à la ligne" + line + "\n" + msg);
    }
    */

    var application: IApplication;
    var location = window.location;
    var path = location.protocol + "//" + location.host + "/";
 
    application = {
        title: ko.observable<string>(),
        isReady: ko.observable<boolean>(false),
        version: null,
       context: {
            device: null,
            app: null,
            page: null
       },
       i18n: null,
       logLevel: 5,
       logConsole: false,
       manager: new AppManager(),
       messageBox: null,
        doTrtQueryError: function(response: any): void {},
        servicesPath: path,
        basePath: null,
        appPath: null,
        getFinalFileName: function(fileName: string): string {
            /*
            if (this.version && (fileName.match(/(\.html|\.css|\.js)$/gi) && fileName.match(/i18n/gi) == null)) {
                fileName = fileName.replace(/\.html/gi, "-" + this.version + ".html")
                fileName = fileName.replace(/\.js/gi, "-" + this.version + ".js")
                fileName = fileName.replace(/\.css/gi, "-" + this.version + ".css")
            }
            */
            if(this.version) {
                fileName += (fileName.indexOf('?')==-1?'?':'&') + '_v=' + encodeURIComponent(this.version)
            }
            return fileName
        },
        navigateTo: function(href: string): void {
            window.location.assign(href);
        },
       ready: function (fn: Function, context?: any): void {
            if(this.isReady()) {
                fn.call(context, fn);
            } else {
                this.isReady.subscribe(function(b: boolean): void {
                    if(b) {
                        fn.call(context, fn);
                    }
                });
            }
       },
        init: function() {
        
            var oLogger_: Logger = Logger.getLogger('main');
            oLogger_.info("Initialisation de l'application");
            
            this.i18n.init();
        },
        showTrace: function() {
            var sTrace_: string = "";
            sTrace_ += "version: " + app.version + "\n";
            sTrace_ += "ready: " + app.isReady() + "\n";
            sTrace_ += "ready/i18n: " + <string>(app.i18n?<any>app.i18n.isReady():"N/A") + "\n";
            sTrace_ += "context.device: " + app.context.device + "\n";
            sTrace_ += "context.app: " + app.context.app + "\n";
            sTrace_ += "context.page: " + app.context.page + "\n";
            sTrace_ += "servicesPath: " + app.servicesPath + "\n";
            sTrace_ += "basePath: " + app.basePath + "\n";
            sTrace_ += "appPath: " + app.appPath + "\n";
            sTrace_ += "logLevel: " + app.logLevel + "\n";
            sTrace_ += "logConsole: " + app.logConsole + "\n";
            alert(sTrace_);
        }
    };
    
     window.app = application;
     
     app.i18n = <kit.manager.I18n>app.manager.register('i18n', new manager.I18n(Locales));
     
     app.manager.ready(['i18n'], function() {       
        application.isReady(true);
     });
     
    // Filter url queries
    $(document).ajaxSend(function(event, jqxhr, settings) {
        settings.url = app.getFinalFileName(settings.url)
    })

	/**
	 * The application entry point.
	 */
	$(document).ready(function() {

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
            if (event.which == 27)
            {
                // the following seems to fix the symptom but
                // only in case the document has the focus
                event.preventDefault()
            }
        })
/*
        manager.ready('i18n', function(_resourcesManager) {
            var language = ko.computed({
                read: function () {
                    return _resourcesManager.language()
                },
                write: function (language) {
                    if (language) {
                        _resourcesManager.language(language)
                    }
                }
            }).extend({ throttle: 1 })

            ko.linkObservableToUrl(language, LANGUAGE_HASH_KEY)

        })
*/
	})
}