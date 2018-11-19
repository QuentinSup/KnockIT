module fr.ca.cat.fields {
    
    export class TextAreaUIField extends TextUIField {

        public rows: KnockoutObservable<number> = ko.observable(5)
        public scrollGlue: KnockoutObservable<boolean> = ko.observable(true)
        public keyLock: KnockoutObservable<boolean> = ko.observable(false)

        constructor(id: string, value: any, required?: boolean, readOnly?: boolean) {
            super(id, value, required, readOnly)

            this.inputTemplate = "ui-field-textarea-template"

            this.keyLock.subscribe((b: boolean): void => {
                if(b) {
                    $(document).on('keypress.locker', 'textarea#' + this.uid, (e): boolean => {
                        e.stopImmediatePropagation();
                        return false;
                    });
                } else {
                    $(document).off('keypress.locker', 'textarea#' + this.uid);
                }
            })

        }

        public append(s: string): void {
            if(isset(s)) {
                var toBottom: boolean = false
                if(this.scrollGlue()) {
                    toBottom = this.isScrollToBottom()
                }
                var value: string = this.value() || ''
                this.value(value + s)
                if(toBottom) {
                    this.scrollToBottom()
                }
            }
        }

        public clear(): void {
            this.flush()
        }

        public flush(): string {
            var value: string = this.value()
            this.value('')
            return value
        }

        public scrollToBottom(): void {
            var $element: JQuery = $('#' + this.uid)
            $element.scrollTop($element[0].scrollHeight)
        }

        public isScrollToBottom(): boolean {
            var $element: JQuery = $('#' + this.uid)
            return ($element[0].scrollHeight - $element[0].scrollTop) == $element.innerHeight()
        }

    }
}