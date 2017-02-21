module kit.components {

    import InputUIField = fields.InputUIField;

    export class FieldBinding extends DefaultBinding {
        
        private static constructorList: any = {};
        
        public constructor() {
            super('field');    
        }
        
        public static setConstructor(typeName: string, construct: Function): void {
            FieldBinding.constructorList[typeName.toLowerCase()] = construct;       
        }
        
        public static getConstructor(typeName: string): Function {
            return FieldBinding.constructorList[typeName.toLowerCase()];    
        }
        
        public static construct(typeName: string, name: string, defaultValue: string, required: boolean): InputUIField {
            var fn: Function = FieldBinding.getConstructor(typeName) || FieldBinding.getConstructor('default');
            if(!fn) {
                throw "Aucun constructeur de champ définit pour le type " + typeName;
            }
            
            return fn.call(this, name, defaultValue, required);
            
        }
        
        public init(element, valueAccessor) {
            
            var $data = ko.dataFor(element);
            if(!$data.fields) {
                $data.fields= [];
            }
            
            var opts = valueAccessor() || {};
            var $element: any = $(element);
            
            var fieldType: string       = ko.unwrap(opts.type); 
            var name: string            = ko.unwrap(opts.name);
            var defaultValue: string    = ko.unwrap(opts.defaultValue);
            var required: boolean       = ko.unwrap(opts.required);
            
            var field: InputUIField = FieldBinding.construct(fieldType, name, defaultValue, required)
            
            var ind = $data.fields.length;
            $data.fields[ind] = field;
            
            if($data.onDOMField) {
                $data.onDOMField(fieldType, name, field);   
             }
            
            element.innerHTML = "<!-- ko template: { name: '" + field.template + "', data: $data.fields[" + ind + "] } --><!-- /ko -->";
            
        }
 
    }

}