
module kit {

    export interface IEvent {
        id: string
        arguments: any
    }

    export interface IEventsBinder {
        on(eventId: any, callback: Function, context?: any): void
        emit(eventId: string, arguments?: any): void
    }

    export class EventsBinder implements IEventsBinder, IDisposable {

        private __event__: KnockoutObservable<IEvent> = ko.observable<IEvent>()
        private __subscriptions__: KnockoutSubscription[] = []

        constructor() {}

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
                    this.callback.call(this.context || this.owner, event.arguments)
                }
            }, { eventId: eventId, callback: callback, context: context, owner: this }))
        }

        public emit(eventId: string, args?: any): void {
            this.__event__({
                id: eventId,
                arguments: args
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