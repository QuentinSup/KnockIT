module fr.ca.cat.agilitedigitale.components {

    export class RegisterBindingsManager extends EventsBinder {
    
        public register(binding: DefaultBinding): void {
            ko.bindingHandlers[binding.getName()] = binding;
            this.emit('register', binding);
        }
    
   }
    
}