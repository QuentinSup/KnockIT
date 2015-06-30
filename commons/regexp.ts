module kit.regexp {

    export var CdPost: RegExp = /^(([0-8][1-9]|9[0-5]|[1-9]0)[0-9]{3})|(97[1-6][0-9]{2})$/
    export var Email: RegExp = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
    export var AlphaNumerique: RegExp = /^[a-z0-9 ÀÂÉÈÊËÏÎÔÖÛÙÜÇ\-']*$/i
    export var Alpha: RegExp = /^[a-z ÀÂÉÈÊËÏÎÔÖÛÙÜÇ\-']*$/i
    export var Adresse: RegExp = /^[a-z0-9 ÀÂÉÈÊËÏÎÔÖÛÙÜÇ\-',/]*$/i
    export var Mots: RegExp = /([A-ZÀÂÉÈÊËÏÎÔÖÛÙÜÇ])+/ig
        
    export var Integer: RegExp = /^(\-)?\d+$/
    export var PositiveInteger: RegExp = /^[0-9]+[0-9]*$/
    export var Double: RegExp = /^(\-)?((\d+(\.\d+)?))([eE]{1}([\-\+]{1})?(\d+))?$/
    export var PositiveDouble: RegExp = /^((\d+(\.\d+)?))([eE]{1}([\-\+]{1})?(\d+))?$/
    export var NumTel: RegExp = /^(0033|0|\+33)([1-7]|[9])[0-9]{8}$/
    export var NumTelEtendu: RegExp = /^(\(0033\)|\(\+33\)|0|0033|\+33)([ .-]?[1-7]|[9])([ .-]?[0-9]{2}){4}$/
    export var NumTelPermissif: RegExp = /^([0-9 \(\)\+\.]{0,17})$/  // Numéro de téléphone valide selon INTERNAUTE (17car max) : Seuls les caractères numériques, l'espace, les parenthèses, le + et le . doivent composer le numéro. 
        
}