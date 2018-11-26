import { EventsBinder } from '@webkit/core/EventsBinder.class';
import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

export class RegisterBindingsManager extends EventsBinder {
    
    public register(binding: AbstractBinding): void {
        ko.bindingHandlers[binding.getName()] = binding;
        this.emit('register', binding);
    }

}