module kit.ui {
    
    import Logger = helpers.Logger

    var _contentString: string = null

    // Current stack of glass panels
    var _currentStack: { [key: string]: GlassPanel } = {}


    export interface IGlassPanelOptions {
		text?: string
        progressionText?: string
        currentStep?: number
        totalSteps?: number
	}

	export class GlassPanel extends MVVM {
       
        private static oLogger: Logger = Logger.getLogger('kit.ui.GlassPanel');
        
        public id: string = null
        public lockKeyBoard: boolean = false
        public isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(true)
        public text: KnockoutObservable<string> = ko.observable<string>('')
        public progressionText: KnockoutObservable<string> = ko.observable<string>('')
        public currentStep: KnockoutObservable<number> = ko.observable<number>()
        public totalSteps: KnockoutObservable<number> = ko.observable<number>()
        private progression: KnockoutObservable<number> = ko.observable<number>()
        private steps: KnockoutObservable<string> = ko.observable<string>('')
        private animationDuration: number = 500;
        public animation: KnockoutObservable<any> = ko.observable<any>()
        
        constructor(id: string, properties?: IGlassPanelOptions) {
			super(app.webkitPath + "templates/GlassPanel.html", [])
            this.id = id

            this.currentStep.subscribe((value: number): void => {
				this._update()
            }, this)

            this.totalSteps.subscribe((value: number): void => {
				this._update()
            }, this)

            this.update(properties)

            _currentStack[this.id] = this
        }

		private _update(): void {
			var currentStep: number = Number(this.currentStep())
            var totalSteps: number = Number(this.totalSteps())
            if (!isNaN(currentStep) && !isNaN(totalSteps)) {
				this.steps(Math.round(currentStep / totalSteps * 100) + '%')
                this.progression(currentStep / totalSteps)
            } else {
				this.steps('')
                this.progression(0)
            }
		}

		public update(properties: IGlassPanelOptions): void {
            
            if(!isset(properties)) { return; }

			if (isset(properties.text)) {
				this.text(properties.text)
            }

			if (isset(properties.currentStep)) {
				this.currentStep(Number(properties.currentStep))
            }

			if (isset(properties.totalSteps)) {
				this.totalSteps(Number(properties.totalSteps))
            }

			if (isset(properties.progressionText)) {
				this.progressionText(properties.progressionText)
            }
		}

		public load(): void {
			super.load((htmlContent: string): void => { _contentString = htmlContent }, _contentString)
            // Disable keyboard
            if(this.lockKeyBoard) {
                $(document).on('keydown.glassPannel', function (e) {
    				e.stopImmediatePropagation()
                    return false
                })
            }
        }
        
        public animate(animation: any, fn?: Function): void {
            var animation_: any = typeof(animation) == 'string'?{ animation: animation }:animation;
            if(!animation_.duration) {
                animation_.duration = this.animationDuration;
            }
            
            this.animation(animation_);
            if(fn) {
                defer((): void => {
                    fn.apply(this);
                }, animation_.duration);
            }
        }

		public show(fn?: Function): void {
            this.isVisible(true)
            this.animate('fadeIn', fn);
        }

		public hide(fn?: Function): void {
            this.animate('fadeOut', (): void => {
                this.isVisible(false)
                if(fn) {
                    fn.apply(this);
                }
            });
        }

		public destroy(): void {
                    
            delete _currentStack[this.id]
            if (!Object.hasKeys(_currentStack)) {
				// Enable keyboard
                $(document).off('keydown.glassPannel')
            }
           
            this.hide((): void => {
                this.dispose()
            });
            
		}


		/** Show an explicit glasspanel (using his ID)
		 * @memberOf oneesp.manager.commons.glassPanel#
		 * @param {string} ID - The ID specified
		 * @returns {undefined}
		 */
		static show(id?: string): void {
			var panel = GlassPanel.getPanel(id)

            if (panel) {
				panel.show()
            }
		}

		/** Hide an explicit glasspanel (using his ID)
		 * @memberOf oneesp.manager.commons.glassPanel#
		 * @param {string} ID - The ID specified
		 * @returns {undefined}
		 */
		static hide(id?: string): void {
			var panel = GlassPanel.getPanel(id)
            if (panel) {
				panel.hide()
            }
		}

		/** Create a new glassPanel
		 * @memberOf oneesp.manager.commons.glassPanel#
		 * @param {string} text - The main text to show with the glassPanel
		 * @param {object} [opts={ ID:'main' }] - The options of the glassPanel
		 * @returns {undefined}
		 * @example
		 * // Show a glassPanel (will use the 'main' ID)
		 * _glassPanel.create('Loading...'); // -> one glassPanel is showed
		 * // Update the main glassPanel
		 * _glassPanel.create('Loading again...'); // -> one glassPanel is showed
		 * // Create a new glassPanel 
		 * _glassPanel.create('Wait...',{ ID: 'waitpanel' }); -> two glassPanel are showed
		 * // Update the 'waitpanel' glassPanel
		 * _glassPanel.create('Wait again...',{ ID: 'waitpanel' }); -> two glassPanel are showed
		 * // Destroy the 'waitpanel' glassPanel
		 * _glassPanel.destroy('waitpanel'); -> one glassPanel is showed (the main)
		 * // Destroy the main glassPanel
		 * _glassPanel.destroy(); -> no glassPanel is showed (equals to _glassPanel.destroy('main');)
		 */
		static create(id: string = 'main', opts?: IGlassPanelOptions): GlassPanel {

			var current: GlassPanel = GlassPanel.getPanel(id)

            if (current) {
				// Update the current glassPanel if exists
				current.update(opts)
            } else {

				current = new GlassPanel(id, opts)
                current.load()

                // show
                GlassPanel.show(current.id)
            }
            return current
        }

		/** Destroy a glassPanel
		 * @memberOf oneesp.manager.commons.glassPanel#
		 * @param {string} [ID='main'] - The ID of the glassPanel to destroy (destroy the main by default)
		 * @returns {undefined}
		 */
		static destroy(id?: string): void {

			var panel: GlassPanel = GlassPanel.getPanel(id)

            if (panel) {
				panel.destroy()
            } else {
                if(GlassPanel.oLogger.isWarnEnabled()) {
                    GlassPanel.oLogger.warn("No glass panel found. id: " + id)
                }
            }
		}

		static update(properties: IGlassPanelOptions, id?: string): void {
			var panel: GlassPanel = GlassPanel.getPanel(id)
            if (panel) {
				panel.update(properties)
            } else {
                if(GlassPanel.oLogger.isWarnEnabled()) {
				    GlassPanel.oLogger.warn("No glass panel found. id: " + id)
                }
            }
		}

		/** Get an explicit glassPanel using his ID
		 * @memberOf oneesp.manager.commons.glassPanel#
		 * @param {string} [ID='main'] - The ID of the glassPanel to return (The main by default)
		 * @returns {undefined}
		 */
		static getPanel(id: string = 'main'): GlassPanel {
            return _currentStack[id]
        }
	}
}