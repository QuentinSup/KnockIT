
/**
 * @fileOverview This file defines the errors module. 
 * @example var _errorsHelper = oneesp.module('commons.helper.errors');
 */
module kit.helpers {

    /**
     * MODES
     * @enum {int}
     * @memberOf oneesp.module.commons.helper.errors#
     */
    export enum TLogLevel {
        TRACE,
        DEBUG,
        INFO,
        WARN,
        ERROR,
        FATAL
    }
    
    export interface ILogAppender {
        level: TLogLevel
        log(className: string, level: TLogLevel, text: string, e?: any, date?: Date): void
    }
    
    export class Appender {
        
        public level: TLogLevel

        public formatMessage(className: string, date: Date, level: TLogLevel, message: string): string {
            return TLogLevel[level] + ' - ' + className + ' - ' + date.toString() + ': ' + message;
        }
        
        public constructor(level: TLogLevel = TLogLevel.TRACE) {
            this.level = level;
        }
        
    }
      
    
    export class ConsoleAppender extends Appender implements ILogAppender {
        
        public constructor() {
            super();
        }

        public log(className: string, level: TLogLevel, message: string, exception?: any, date: Date = new Date()): void {
            
            if(this.level > level) {
                return;
            }
            
            var e = exception || '';
            var console = isset(window.console)?window.console:null;
            
            if(isset(console)) {
            
                var text: string = this.formatMessage(className, date, level, message);
                
                if(level == TLogLevel.DEBUG && typeof(console.debug) != 'undefined') {
                    console.debug(text, e);
                    return;
                }
                if(level == TLogLevel.INFO && typeof(console.info) != 'undefined') {
                    console.info(text, e);
                    return;
                }
                if(level == TLogLevel.WARN && typeof(console.warn) != 'undefined') {
                    console.warn(text, e);
                    return;
                }
                if(level == TLogLevel.ERROR && typeof(console.error) != 'undefined') {
                    console.error(text, e);
                    return;
                }    
                if(level == TLogLevel.FATAL && typeof(console.error) != 'undefined') {
                    console.error(text, e);
                    return;
                }    
                if(typeof(console.log) != 'undefined') {
                    console.log(text, e);
                    return;
                }
            }
        } 

    }
    
    export class RemoteAppender extends Appender implements ILogAppender {
        
        public url: string
        
        public constructor(url: string) {
            super();
            this.url = url;
        }
        
        public log(className: string, level: TLogLevel, message: string, exception?: any, date: Date = new Date()): void {
            if(this.level <= level) {
                
                var e = exception || '';
                var text: string = this.formatMessage(className, date, level, message);
                
                Query.PUT(this.url, { date: date.getUTCTime(), className: className, level: level, message: text, originalMessage: message, exception: e }, null, this, { silent: true });
            }
        } 

    }
        
    export class Logger {

        public static loggers: any = {}
        
        public appenders: ILogAppender[] = []
        
        /**
         * The current mode
         * @name mode
         * @type observable
         * @defaultValue Modes.DEVELOPMENT
         * @memberOf oneesp.module.commons.helper.errors#
         */
        public level: KnockoutObservable<TLogLevel> = ko.observable(TLogLevel.INFO)        
        public id: string = null

        constructor(id: string, level: TLogLevel = TLogLevel.INFO) {
            this.level(level);
            this.id = id;
        }
        
        public isTraceEnabled(): boolean {
            return this.level() >= TLogLevel.TRACE;   
        }
        
        public isInfoEnabled(): boolean {
            return this.level() >= TLogLevel.INFO;   
        }
        
        public isDebugEnabled(): boolean {
            return this.level() >= TLogLevel.DEBUG;   
        }
        
        public isWarnEnabled(): boolean {
            return this.level() >= TLogLevel.WARN;   
        }

        public info(text: string, e?: any): void {
            this.log(this.id, TLogLevel.INFO, text, e);
        }
        
        public warn(text: string, e?: any): void {
            this.log(this.id, TLogLevel.WARN, text, e);
        }
        
        public trace(text: string, e?: any): void {
            this.log(this.id, TLogLevel.TRACE, text, e);
        }
        
        public debug(text: string, e?: any): void {
            this.log(this.id, TLogLevel.DEBUG, text, e);
        }
        
        public error(text: string, e?: any): void {
            this.log(this.id, TLogLevel.ERROR, text, e);
        }
        
       public fatal(text: string, e?: any): void {
            this.log(this.id, TLogLevel.FATAL, text, e);
       }
        
       public log(className: string, level: TLogLevel, message: string, exception?: any, date: Date = new Date()): void {
           if((this.level() <= level) && this.appenders) {
                for(var i: number = 0, len = this.appenders.length; i < len; i++) {
                    if(this.appenders[i].level <= level) {
                        this.appenders[i].log(className, level, message, exception, date);
                    }
                }   
           }
       }
        
        public addAppender(appender: ILogAppender): void {
            this.appenders.pushOnce(appender);    
        }
        
        /** return logger
         * @param {string} className
         */
        static getLogger(className: string): Logger {
            if(!Logger.loggers[className]) {
                var oLogger_: Logger = new Logger(className);
                if(className != 'default') {
                    oLogger_.log = function(className: string, level: TLogLevel, text: string, e?: any) {
                        var oLogger: Logger = Logger.getDefaultLogger();
                        if(oLogger) {
                            oLogger.log(className, level, text, e);   
                        }
                    }
                }
                Logger.loggers[className] = oLogger_;
            }
            return Logger.loggers[className];
        }
 
        static getDefaultLogger(): Logger {
            return Logger.getLogger('default');   
        }
        
        static getConsoleAppender(): ILogAppender {
            return new ConsoleAppender();
        }

    }
  
}