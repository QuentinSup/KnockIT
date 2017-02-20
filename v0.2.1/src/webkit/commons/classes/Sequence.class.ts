module kit {

    export class Sequence extends EventsBinder {

        public hashScreen: KnockoutObservable<string> = ko.observable<string>();
        
        public screens: KnockoutObservableArray<ScreenSequence> = ko.observableArray<ScreenSequence>();
        
        public transitionDelay: number = 0;
        public currentScreen: KnockoutObservable<ScreenSequence> = ko.observable<ScreenSequence>();
        public currentAnimation: KnockoutObservable<any> = ko.observable<any>();
        public schema: KnockoutComputed<ScreenSequence[]>;
        public hasNext: KnockoutObservable<boolean> = ko.observable<boolean>();
        public hasPrevious: KnockoutObservable<boolean> = ko.observable<boolean>();
        public nextScreen: KnockoutObservable<ScreenSequence> = ko.observable<ScreenSequence>();
        public previousScreen: KnockoutObservable<ScreenSequence> = ko.observable<ScreenSequence>();
        
        
        //protected sequences: JQuery;
        
        constructor(screens: ScreenSequence[], transitionDelay: number = 0) {
            
            super();
                        
            this.transitionDelay = transitionDelay;
                        
            this.schema = ko.computed<ScreenSequence[]>((): ScreenSequence[] => {
                var tScreens_: ScreenSequence[] = this.screens();
                var rScreens_: ScreenSequence[] = []; 
                for(var i: number = 0; i < tScreens_.length; i++) {
                    var oScreen_: ScreenSequence = tScreens_[i];
                    if(oScreen_.isVisible()) { 
                        rScreens_.push(oScreen_);
                    }
                }
                return rScreens_;
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
                        
            this.hashScreen.subscribe((screen: string): void => {
                if(screen) {
                
                    var tScreens_: ScreenSequence[] = this.schema();
                    var oScreen_: ScreenSequence
                    
                    if(screen == "first") {
                        oScreen_ = tScreens_.first();
                    } else if(screen == "last") {
                        oScreen_ = tScreens_.last();
                    } else {
                        oScreen_ = tScreens_.findBy('id', screen);
                    }
                    
                    if(!oScreen_) {
                        oScreen_ = this.getFirstScreenToComplete();
                    }
                    
                    var oCurrentScreen_: ScreenSequence = this.currentScreen();
                    
                    if(oCurrentScreen_) {
                        if(oCurrentScreen_.hide()) {
                            this.currentAnimation(oCurrentScreen_.animationOut);
                            this.currentAnimation.valueHasMutated();
                            this.emit('hide', oCurrentScreen_);
                        } else {
                            return;   
                        }
                    }

                    if(oScreen_) {
                        defer((): void => {
                            this.currentAnimation(oScreen_.animationIn);
                            this.currentAnimation.valueHasMutated();
                            this.currentScreen(oScreen_);
                        }, oCurrentScreen_?this.transitionDelay:0);
                    } else {
                        this.emit('404', screen);
                    }
                }
            });
            
            if(screens) {
                this.screens(screens);
            }
        
        }
        
        public getScreenById(id: string): ScreenSequence {
            return this.screens().findBy('id', id);     
        }
    
        private updateDependencies(screen?: ScreenSequence): void {
            var iIndexOf_: number = this.getCurrentIndexOfScreen(screen);
            var tScreens_: ScreenSequence[] = this.schema();
            this.hasPrevious(iIndexOf_ > 0);
            this.hasNext(iIndexOf_ < tScreens_.length - 1);
            if(this.hasPrevious()) {
                this.previousScreen(tScreens_[iIndexOf_ - 1]);
            } else {
                this.previousScreen(null);
            }
            if(this.hasNext()) {
                this.nextScreen(tScreens_[iIndexOf_ + 1]);
            } else {
                this.nextScreen(null);
            }
        }
    
        public getFirstScreenToComplete(): ScreenSequence {
            var tScreens_: ScreenSequence[] = this.schema(); 
            return this.getFirstDependentScreenTo(tScreens_.last());
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
            var tScreens_: ScreenSequence[] = this.schema();
            if(tScreens_.length > 0) {
                this.show(tScreens_[0]);
                return true;
            }   
            return false;
        }
            
        public refresh(): void {
            this.hashScreen.valueHasMutated();
        }
        
        public getFirstDependentScreenTo(screen: ScreenSequence): ScreenSequence {
            var tScreens_: ScreenSequence[] = this.schema();
            var iIndexOf_: number = -1;
            if(screen) {
                iIndexOf_ = tScreens_.indexOf(screen);
            }
            for(var i: number = 0; i < iIndexOf_ ; i++) {
                var oScreen_: ScreenSequence = tScreens_[i];
                if(!oScreen_.isFormValid()) {
                    return oScreen_;
                }
            }
            return screen;
        }

        public getCurrentIndexOfScreen(screen: ScreenSequence = this.currentScreen()): number {
            var tScreens_: ScreenSequence[] = this.schema();
            var iIndexOf_: number = -1;
            if(screen) {
                iIndexOf_ = tScreens_.indexOf(screen);
            }
            return iIndexOf_;
        }
        
        public afterRender() {
            var oScreen_: ScreenSequence = this.currentScreen();
            if(oScreen_) {
                oScreen_.afterRender();
                this.emit('afterRender', oScreen_);
            }        
        }

        public submit(): boolean {
            
            var oScreen_: ScreenSequence = this.currentScreen();
            
            if(!oScreen_) {
                return false;
            }
            
            if(oScreen_ && !oScreen_.beforeSubmit()) {
                return false;
            }
            
            if(oScreen_.submit()) {
                this.emit('submit', oScreen_);
                return true;
            } else {
                this.emit('submitFailed', oScreen_);
                if(oScreen_.animationError) {
                    this.currentAnimation(oScreen_.animationError);
                    this.currentAnimation.valueHasMutated();
                }
                return false;
            }
            
        }
        
        public beforeNext(screen: ScreenSequence, next: ScreenSequence): boolean {
            return true;
        }

        public next(): boolean {
        
            var tScreens_: ScreenSequence[] = this.schema(); 
            var oScreen_: ScreenSequence = this.currentScreen();        
            var oNewScreen_: ScreenSequence = this.nextScreen();
            
            if(oScreen_ && !this.beforeNext(oScreen_, oNewScreen_)) {
                return false;
            }
            
            if(oNewScreen_) {
                this.emit('next', oNewScreen_);
                this.show(oNewScreen_);
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
                    
            var tScreens_: ScreenSequence[] = this.schema();
            var oScreen_: ScreenSequence = this.currentScreen();  
            var iIndexOf_: number = this.getCurrentIndexOfScreen(oScreen_);            
            var oNewScreen_: ScreenSequence = this.previousScreen();

            if(oScreen_ && !this.beforePrevious(oScreen_, oNewScreen_)) {
                return false;
            }
            
            if(oNewScreen_) {
                this.emit('previous', oNewScreen_);
                this.show(oNewScreen_);
                return true;
            }
            
            return false;

        }

        public findById(id: string): ScreenSequence {
            var tScreens_: ScreenSequence[] = this.schema();    
            return tScreens_.findBy('id', id);
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
       
}