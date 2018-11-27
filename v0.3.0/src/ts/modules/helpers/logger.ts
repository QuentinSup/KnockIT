import { Query } from './query';

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
    
export abstract class Appender {
    
    public level: TLogLevel

    abstract log(className: string, level: TLogLevel, message: string, exception?: any, date?: Date): void

    public constructor(level: TLogLevel = TLogLevel.TRACE) {
        this.level = level;
    }
    
}
    
export class ConsoleAppender extends Appender implements ILogAppender {
    
    public static useFormat: boolean = true;
    public static formatCSS: string = "padding: .1em .5em; color: #000; border: 1px solid #ddd; background-color: #93e458; border-radius: 3px";

    public constructor() {
        super();
    }

    public formatMessage(level: TLogLevel, date: Date, message: string): string {
        return TLogLevel[level].rPad(' ', 5) + ' - ' + utils.formatDate(date, "dd/mm/yyyy", "hh:mm:ss.t") + ': ' + message;
    }

    public log(className: string, level: TLogLevel, message: string, exception?: any, date: Date = new Date()): void {
        
        if(this.level > level) {
            return;
        }
        
        let e = exception || '';
        let console = isset(window.console)?window.console:null;
        
        if(isset(console)) {
        
            let fn;
            
            if(level == TLogLevel.DEBUG && typeof(console.debug) != 'undefined') {
                fn = console.debug;
            }
            if(level == TLogLevel.INFO && typeof(console.info) != 'undefined') {
                fn = console.info;
            }
            if(level == TLogLevel.WARN && typeof(console.warn) != 'undefined') {
                fn = console.warn;
            }
            if(level == TLogLevel.ERROR && typeof(console.error) != 'undefined') {
                fn = console.error;
            }    
            if(level == TLogLevel.FATAL && typeof(console.error) != 'undefined') {
                fn = console.error;
            }    

            if(!fn && typeof(console.log) != 'undefined') {
                fn = console.log;
            }

            if(!fn) {
                return;
            }

            let text: string = this.formatMessage(level, date, message);
            if(ConsoleAppender.useFormat) {
                fn("%c" + className, ConsoleAppender.formatCSS, text, e);
            } else {
                fn(className, text, e);
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

    public formatMessage(className: string, date: Date, level: TLogLevel, message: string): string {
        return TLogLevel[level] + ' - ' + className + ' - ' + date.toString() + ': ' + message;
    }
    
    public log(className: string, level: TLogLevel, message: string, exception?: any, date: Date = new Date()): void {
        if(this.level <= level) {
            
            let e = exception || '';
            let text: string = this.formatMessage(className, date, level, message);
            
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
            for(let i: number = 0, len = this.appenders.length; i < len; i++) {
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
            let log: Logger = new Logger(className);
            if(className != 'default') {
                log.log = function(className: string, level: TLogLevel, text: string, e?: any) {
                    let logger: Logger = Logger.getDefaultLogger();
                    if(logger) {
                        logger.log(className, level, text, e);   
                    }
                }
            }
            Logger.loggers[className] = log;
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