interface Document {
    registerElement: Function
}

module kit.components {

    export class RegisterElementManager extends EventsBinder {
    
        public register(def: DefaultElement) {

            document.registerElement(def.getTagName(), {
                    prototype: Object.create(
                      HTMLElement.prototype, {
                      createdCallback: {
                            value: function() {
                                def.create.call(def, this);
                            }
                      },
                      attachedCallback: {
                            value: function() {
                                def.attach.call(def, this);
                            }
                      },
                      detachedCallback: {
                            value: function() {
                                def.detach.call(def, this);
                            }
                      },
                      attributeChangedCallback: {
                         value: function(name, previousValue, value) {
                            if (previousValue == null) {
                                def.addAttribute.call(def, this);
                            } else if (value == null) {
                                def.removeAttribute.call(def, this);
                            } else {
                                def.modifyAttribute.call(def, this);
                            }
                         }}
                    })
        
                
            });

            this.emit('register', def);

        }
    
   }
    
}