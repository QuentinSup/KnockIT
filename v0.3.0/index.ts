import { Application } from '@webkit/core/Application.class';
import { Logger, TLogLevel } from '@webkit/helper/logger';

let logger: Logger = Logger.getLogger('mainApp');

declare var window: any;

export var app: Application = new Application();
app.init({ logLevel: TLogLevel.TRACE });

app.ready((): void => {
	logger.trace("ready !!!!");
	logger.debug("ready !!!!");
	logger.info("ready !!!!");
	logger.warn("ready !!!!");
	logger.error("ready !!!!");
	logger.fatal("ready !!!!");

})