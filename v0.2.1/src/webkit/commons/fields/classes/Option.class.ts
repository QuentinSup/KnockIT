/**
 * @fileOverview This file defines the Option class.
 *     It requires jQuery and KnockOut libraries.
 */
module kit.fields {

	/**
	 * An option in a select input.
	 * @param {string} value The value.
	 * @param {string} text The text.
	 * @constructor
	 */
	export class Option {
		/**
		 * The value.
		 * @type {string}
		 */
		public value: string = null
        public resourceId: string
        public resourceTextId: string
        public data: any = {}
        public tooltip: Tooltip = new Tooltip()
        public disabled: KnockoutObservable<boolean> = ko.observable(false);
        
		/**
		 * The text.
		 * @type {string}
		 */
		public text: KnockoutObservable<string> = ko.observable<string>()

        constructor(value: string, resourceId?: string, resourceTextId?: string) {
			this.value = value
            this.resourceId = resourceId || value
            this.resourceTextId = resourceTextId || this.resourceId
            
            this.text = app.i18n.getObservableString(this.resourceTextId + '.label', this.resourceId)
            this.tooltip.setText(this.resourceTextId + '.tooltip');
        }
        
        public static afterRenderFunction(option: any, item: Option): void {
            if(item) {
                ko.applyBindingsToNode(option, { disable: item.disabled }, item)
            }
        }

	}
}