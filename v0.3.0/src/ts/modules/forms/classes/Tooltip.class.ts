export class Tooltip {

    public uid: string
    
	/**
	 * The text.
	 * @type {string}
	 */
	public text: KnockoutObservable<string> = ko.observable('')
    public show: KnockoutObservable<boolean> = ko.observable(true)
    public animation: string = "grow"
    public position: string = "bottom"
	public type: KnockoutObservable<string> = ko.observable('')
    
    constructor(uid?: string) {
        if(!uid) {
            uid = utils.genId()
        }
        this.uid = uid;
    }
    
    public setText(resourceId: string, defaultId: string = ''): void {
        this.text = app.i18n.getObservableString(resourceId, defaultId)
    }

}