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
    public static formatClassNameCSS: string = "padding: .1em .5em; color: #000; border: 1px solid #ddd; background-color: #93e458; border-radius: 3px";
    public static formatLevelInfoCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #fff; background-color: #4aa3c5; border-radius: 3px";
    public static formatLevelTraceCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #444; background-color: white; border-radius: 3px; border: 1px solid #ddd";
    public static formatLevelDebugCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #444; background-color: white; border-radius: 3px; border: 1px solid gray";
    public static formatLevelWarnCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #444; background-color: #e8dd77; border-radius: 3px; border: 1px solid #ddd";
    public static formatLevelErrorCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #fff; background-color: #ff5722; border-radius: 3px;";
    public static formatLevelFatalCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #fff; background-color: #d6290d; border-radius: 3px;";
    public static formatLevelDefaultCSS: string = "margin: 0em .5em; padding: .1em .5em; color: #444;";


    public constructor() {
        super();
    }

    public formatMessage(level: TLogLevel, date: Date, message: string): string {
        return utils.formatDate(date, "dd/mm/yyyy", "hh:mm:ss.t") + ': ' + message;
    }

    public log(className: string, level: TLogLevel, message: string, exception?: any, date: Date = new Date()): void {
        
        if(this.level > level) {
            return;
        }
        
        let e = exception || '';
        let console = isset(window.console)?window.console:null;
        
        if(isset(console)) {
        
            let fn;
            let levelFormatCSS: string = ConsoleAppender.formatLevelDefaultCSS;
            if(level == TLogLevel.TRACE) {
                fn = console.log;
                levelFormatCSS = ConsoleAppender.formatLevelTraceCSS;
            }
            if(level == TLogLevel.DEBUG) {
                fn = console.log;
                levelFormatCSS = ConsoleAppender.formatLevelDebugCSS;
            }
            if(level == TLogLevel.INFO) {
                fn = console.info;
                levelFormatCSS = ConsoleAppender.formatLevelInfoCSS;
            }
            if(level == TLogLevel.WARN) {
                fn = console.warn;
                levelFormatCSS = ConsoleAppender.formatLevelWarnCSS;
            }
            if(level == TLogLevel.ERROR) {
                fn = console.error;
                levelFormatCSS = ConsoleAppender.formatLevelErrorCSS;
            }    
            if(level == TLogLevel.FATAL) {
                fn = console.error;
                levelFormatCSS = ConsoleAppender.formatLevelFatalCSS;
            }    

            if(!fn) {
                fn = console.log;
            }

            if(!fn) {
                return;
            }

            let text: string = this.formatMessage(level, date, message);
            if(ConsoleAppender.useFormat) {
                fn("%c" +  TLogLevel[level].toLowerCase() + "%c" + className, levelFormatCSS, ConsoleAppender.formatClassNameCSS, text, e);
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