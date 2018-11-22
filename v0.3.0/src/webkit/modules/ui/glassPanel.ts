import { Logger } from '@webkit/helper/logger';
import { MVVM } from '@webkit/core/MVVM.class';


export interface IGlassPanelOptions {
    text?: string
    progressionText?: string
    currentStep?: number
    totalSteps?: number
}

let logger: Logger = Logger.getLogger('fr.ca.cat.ui.GlassPanel');
let _contentString: string = null
// Current stack of glass panels
let _currentStack: { [key: string]: GlassPanel } = {}

export class GlassPanel extends MVVM {

    public id: string = null
    public pid: string = null
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
        this.pid = String.generate(20);

        this.currentStep.subscribe((value: number): void => {
            this._update()
        }, this)

        this.totalSteps.subscribe((value: number): void => {
            this._update()
        }, this)

        this.update(properties)

        _currentStack[this.pid] = this
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

        if (!isset(properties)) { return; }

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

    public load(fn?: Function): void {
        super.load((htmlContent: string): void => {
            _contentString = htmlContent;
            if (typeof (fn) == "function") {
                fn.call(this);
            }
        }, _contentString)
        // Disable keyboard
        if (this.lockKeyBoard) {
            $(document).on('keydown.glassPannel', function(e) {
                e.stopImmediatePropagation()
                return false
            })
        }
    }

    public animate(animation: any, fn?: Function): void {
        var animation_: any = typeof (animation) == 'string' ? { animation: animation } : animation;
        if (!animation_.duration) {
            animation_.duration = this.animationDuration;
        }

        this.animation(animation_);
        if (typeof (fn) == "function") {
            defer((): void => {
                fn.apply(this);
            }, animation_.duration);
        }
    }

    public show(fn?: Function): void {
        if (!this.isLoaded()) {
            this.load((): void => {
                this.show(fn);
            });
            return;
        }
        this.isVisible(true)
        this.animate('fadeIn', fn);
    }

    public hide(fn?: Function): void {
        this.animate('fadeOut', (): void => {
            this.isVisible(false)
            if (fn) {
                fn.apply(this);
            }
        });
    }

    public destroy(): void {

        delete _currentStack[this.pid]
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
        
        let panels: GlassPanel[] = GlassPanel.getPanelsById(id)
        
        if (panels && panels.length > 0) {

            $.each(panels, (k, panel: GlassPanel): void => {
                panel.show()
            });

        } else {

            if (logger.isWarnEnabled()) {
                logger.warn("No glass panel found. id: " + id)
            }

        }

    }

	/** Hide an explicit glasspanel (using his ID)
	 * @memberOf oneesp.manager.commons.glassPanel#
	 * @param {string} ID - The ID specified
	 * @returns {undefined}
	 */
    static hide(id?: string): void {
        
        let panels: GlassPanel[] = GlassPanel.getPanelsById(id)
        
        if (panels && panels.length > 0) {

            $.each(panels, (k, panel: GlassPanel): void => {
                panel.hide()
            });

        } else {

            if (logger.isWarnEnabled()) {
                logger.warn("No glass panel found. id: " + id)
            }

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

        let panel: GlassPanel = new GlassPanel(id, opts)

        // show
        panel.show()

        return panel;
    }

	/** Destroy a glassPanel
	 * @memberOf oneesp.manager.commons.glassPanel#
	 * @param {string} [ID='main'] - The ID of the glassPanel to destroy (destroy the main by default)
	 * @returns {undefined}
	 */
    static destroy(id: string): void {

        let panels: GlassPanel[] = GlassPanel.getPanelsById(id)

        if (panels && panels.length > 0) {

            $.each(panels, (k, panel: GlassPanel): void => {
                panel.destroy()
            });

        } else {

            if (logger.isWarnEnabled()) {
                logger.warn("No glass panel found. id: " + id)
            }

        }
    }

    static update(opts: IGlassPanelOptions, id?: string): void {

        let panels: GlassPanel[] = GlassPanel.getPanelsById(id)

        if (panels && panels.length > 0) {
            $.each(panels, (k, panel: GlassPanel): void => {
                panel.update(opts)
            });
        } else {

            if (logger.isWarnEnabled()) {
                logger.warn("No glass panel found. id: " + id)
            }
        }
    }

	/** Get an explicit glassPanel using his ID
	 * @memberOf oneesp.manager.commons.glassPanel#
	 * @param {string} [ID='main'] - The ID of the glassPanel to return (The main by default)
	 * @returns {undefined}
	 */
    static getPanel(id: string = 'main'): GlassPanel {
        return _currentStack[id] || Object.findBy(_currentStack, 'id', id);
    }

    /** Get an explicit glassPanel using his ID
     * @memberOf oneesp.manager.commons.glassPanel#
     * @param {string} [ID='main'] - The ID of the glassPanel to return (The main by default)
     * @returns {undefined}
     */
    static getPanelsById(id: string = 'main'): GlassPanel[] {
        return Object.findManyBy(_currentStack, 'id', id);
    }

}