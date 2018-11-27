import { Application } from '@webkit/core/Application.class';

declare var window: any;

export var app: Application = new Application();
app.init();

app.ready((): void => {
	console.log('ready !!');
})