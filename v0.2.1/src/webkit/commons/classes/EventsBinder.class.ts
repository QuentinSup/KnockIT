
module kit {

    export interface IEvent {
        id: string
        arguments: any
    }

    export class EventsBinder implements IEventsBinder, IDisposable {

        private __event__: KnockoutObservable<IEvent> = ko.observable<IEvent>()
        private __subscriptions__: KnockoutSubscription[] = []

        public on(eventId: any, callback: Function, context?: any): void {
            if(typeof(callback) != 'function') {
                throw "No callback specified or callback is not a valid function : " + callback
                return;
            }
            if($.isArray(eventId)) {
                $.each(eventId, (k, eventId): void => {
                    this.on(eventId, callback, context)
                })
                return;
            }
            this.__subscriptions__.push(this.__event__.subscribe(function (event: IEvent) {
                if (event.id == this.eventId) {
                    this.callback.apply(this.context || this.owner, event.arguments)
                }
            }, { eventId: eventId, callback: callback, context: context, owner: this }))
        }

        public emit(...args: any[]): void {
            this.__event__({
                id: args[0],
                arguments: args.slice(1)
            })
        }

        public clearSubscriptions(): void {
            dispose(this.__subscriptions__)
        }

        public dispose(): void {
            this.clearSubscriptions()
        }

    }

}