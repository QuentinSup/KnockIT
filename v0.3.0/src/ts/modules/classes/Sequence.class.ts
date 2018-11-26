import { EventsBinder } from '@webkit/core/EventsBinder.class';
import { ScreenSequence } from '@webkit/core/ScreenSequence.class';

export class Sequence extends EventsBinder {

    public hashScreen: KnockoutObservable<string> = ko.observable<string>();
    public screens: KnockoutObservableArray<ScreenSequence> = ko.observableArray<ScreenSequence>();
    public transitionDelay: number = 0;
    public currentScreen: KnockoutObservable<ScreenSequence> = ko.observable<ScreenSequence>();
    public currentScreenId: KnockoutComputed<string>;
    public currentAnimation: KnockoutObservable<any> = ko.observable<any>();
    public schema: KnockoutComputed<ScreenSequence[]>;
    public hasNext: KnockoutObservable<boolean> = ko.observable<boolean>();
    public hasPrevious: KnockoutObservable<boolean> = ko.observable<boolean>();
    public nextScreen: KnockoutObservable<ScreenSequence> = ko.observable<ScreenSequence>();
    public previousScreen: KnockoutObservable<ScreenSequence> = ko.observable<ScreenSequence>();
    
    
    constructor(screens: ScreenSequence[], transitionDelay: number = 0) {
        
        super();
                    
        this.transitionDelay = transitionDelay;
                    
        this.schema = ko.computed<ScreenSequence[]>((): ScreenSequence[] => {
            let tScreens: ScreenSequence[] = this.screens();
            let rScreens: ScreenSequence[] = []; 
            for(let i: number = 0; i < tScreens.length; i++) {
                let oScreen_: ScreenSequence = tScreens[i];
                if(oScreen_.isVisible()) { 
                    rScreens.push(oScreen_);
                }
            }
            return rScreens;
        });
        
        this.currentScreenId = ko.computed<string>((): string => {
            return this.currentScreen()?this.currentScreen().id:null;
        });
                           
        this.currentScreen.immediateSubscribe((screen: ScreenSequence): void => {

            this.updateDependencies(screen);
            
            if(screen) {
                screen.show();
                this.emit('show', screen);
            }
            
        });
        
        this.schema.subscribe((v: ScreenSequence[]): void => {
            this.updateDependencies();
        });
                    
        this.hashScreen.subscribe((screenId: string): void => {
            if(screenId) {
            
                let tScreens: ScreenSequence[] = this.schema();
                let screen: ScreenSequence
                
                if(screenId == "first") {
                    screen = tScreens.first();
                } else if(screenId == "last") {
                    screen = tScreens.last();
                } else {
                    screen = tScreens.findBy('id', screenId);
                }
                
                if(!screen) {
                    screen = this.getFirstScreenToComplete();
                }
                
                let oCurrentScreen_: ScreenSequence = this.currentScreen();
                
                if(oCurrentScreen_) {
                    this.hide();
                }

                if(screen) {
                    defer((): void => {
                        this.currentAnimation(screen.animationIn);
                        this.currentAnimation.valueHasMutated();
                        this.currentScreen(screen);
                    }, oCurrentScreen_?this.transitionDelay:0);
                } else {
                    this.emit('404', screenId);
                }
            }
        });
        
        if(screens) {
            this.screens(screens);
        }
    
    }
    
    /**
     * Hide current screen
     */
    public hide(): boolean {
        
        let currentScreen: ScreenSequence = this.currentScreen();
                
        if(currentScreen) {
            if(currentScreen.hide()) {
                this.currentAnimation(currentScreen.animationOut);
                this.currentAnimation.valueHasMutated();
                this.emit('hide', currentScreen);
                return true;
            }
        }    
        
        return false;
        
    }
    
    public end(): void {

        this.hide();
        this.hashScreen('');
        this.currentScreen(null);
        
    }    
    
    public getScreenById(id: string): ScreenSequence {
        return this.screens().findBy('id', id);     
    }

    private updateDependencies(screen?: ScreenSequence): void {
        let indexOfScreen: number = this.getCurrentIndexOfScreen(screen);
        let tScreens: ScreenSequence[] = this.schema();
        this.hasPrevious(indexOfScreen > 0);
        this.hasNext(indexOfScreen < tScreens.length - 1);
        if(this.hasPrevious()) {
            this.previousScreen(tScreens[indexOfScreen - 1]);
        } else {
            this.previousScreen(null);
        }
        if(this.hasNext()) {
            this.nextScreen(tScreens[indexOfScreen + 1]);
        } else {
            this.nextScreen(null);
        }
    }

    public getFirstScreenToComplete(): ScreenSequence {
        let tScreens: ScreenSequence[] = this.schema(); 
        return this.getFirstDependentScreenTo(tScreens.last());
    }
    
    public link(pname: string, updateUri: boolean = true, defaultScreenId?: any): string {

        ko.linkObservableToUrl(this.hashScreen, pname);
        if(updateUri) {
            $.address.update();
        }
        if(!this.hashScreen() && defaultScreenId !== false) {
            return this.show(defaultScreenId);   
        }
        
        return this.hashScreen();
        
    }
    
    /**
     * Start sequence
     */
    public start(): boolean {
        let tScreens: ScreenSequence[] = this.schema();
        if(tScreens.length > 0) {
            this.show(tScreens[0]);
            return true;
        }   
        return false;
    }
        
    public refresh(): void {
        this.hashScreen.valueHasMutated();
    }
    
    public getFirstDependentScreenTo(screen: ScreenSequence): ScreenSequence {
        let tScreens: ScreenSequence[] = this.schema();
        let indexOfScreen: number = -1;
        if(screen) {
            indexOfScreen = tScreens.indexOf(screen);
        }
        for(let i: number = 0; i < indexOfScreen ; i++) {
            let screenRel: ScreenSequence = tScreens[i];
            if(!screenRel.isFormValid()) {
                return screenRel;
            }
        }
        return screen;
    }

    public getCurrentIndexOfScreen(screen: ScreenSequence = this.currentScreen()): number {
        let tScreens: ScreenSequence[] = this.schema();
        let indexOfScreen: number = -1;
        if(screen) {
            indexOfScreen = tScreens.indexOf(screen);
        }
        return indexOfScreen;
    }
    
    public afterRender() {
        let screen: ScreenSequence = this.currentScreen();
        if(screen) {
            screen.afterRender();
            this.emit('afterRender', screen);
        }        
    }

    public submit(): boolean {
        
        let screen: ScreenSequence = this.currentScreen();
        
        if(!screen) {
            return false;
        }
        
        if(screen && !screen.beforeSubmit()) {
            return false;
        }
        
        if(screen.submit()) {
            this.emit('submit', screen);
            return true;
        } else {
            this.emit('submitFailed', screen);
            if(screen.animationError) {
                this.currentAnimation(screen.animationError);
                this.currentAnimation.valueHasMutated();
            }
            return false;
        }
        
    }
    
    public beforeNext(screen: ScreenSequence, next: ScreenSequence): boolean {
        return true;
    }

    public next(): boolean {
    
        let screen: ScreenSequence = this.currentScreen();        
        let nextScreen: ScreenSequence = this.nextScreen();
        
        if(screen && !this.beforeNext(screen, nextScreen)) {
            return false;
        }
        
        if(nextScreen) {
            this.emit('next', nextScreen);
            this.show(nextScreen);
            return true;
        } else {
            this.emit('end');
        }
        
        return false;
    }

    public beforePrevious(screen: ScreenSequence, prev: ScreenSequence): boolean {
        return true;
    }
    
    public previous(): boolean {
                
        let screen: ScreenSequence = this.currentScreen();  
        let previousScreen: ScreenSequence = this.previousScreen();

        if(screen && !this.beforePrevious(screen, previousScreen)) {
            return false;
        }
        
        if(previousScreen) {
            this.emit('previous', previousScreen);
            this.show(previousScreen);
            return true;
        }
        
        return false;

    }

    public findById(id: string): ScreenSequence {
        let tScreens: ScreenSequence[] = this.schema();    
        return tScreens.findBy('id', id);
    }
    
    public show(screen?: any): string {
        
        if(!screen) {
            this.start();
            return;    
        }
        
        if(typeof(screen) == "string") {
            screen = this.findById(screen);   
        }
        if(this.hashScreen.peek() == screen.id){
            this.hashScreen.valueHasMutated();
        }else{
            this.hashScreen(screen.id);
        }
        
        return this.hashScreen();
        
    }

}