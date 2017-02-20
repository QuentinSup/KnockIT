
interface String {
    lPad(pchar: string, length: number)
    rPad(pchar: string, length: number)
    toHex(): string
    startsWith(str: string): boolean
    replaceAll(strToReplace: string, str: string): string
    left(len: number): string
    right(len: number): string
    RTrim(value?: string): string
    LTrim(value?: string): string
    format(...args: any[]): string
    random(n: number): string
    text(allowed?: string): string
}

declare function sprintf(str: string, ...args: any[]): string

String.prototype.random = function(length: number = 10)
{
    var text = "";

    for( var i=0; i < length; i++ ) {
        text += this.charAt(Math.floor(Math.random() * this.length));
    }

    return text;
}

String.prototype.format = function(...args: any[]): string {
	return sprintf.apply(this, [this].concat(args)); 
}

String.prototype.lPad = function(pchar: string, length: number = 1): string {
    var s: string = this
    while(s.length < length) {
        s = pchar + s
    }
    return CString(s)
}

String.prototype.rPad = function(pchar: string, length: number = 1): string {
    var s: string = this
    while(s.length < length) {
        s = s + pchar
    }
    return CString(s)
}

String.prototype.replaceAll = function(strToReplace: string, str: string): string {
	return this.replace(new RegExp('\\' + strToReplace + '+','g'), str);
}		

String.prototype.left = function(len: number): string {
	return this.substring(0, len);
}

String.prototype.right = function(len: number): string {
	return this.substring(this.length - len);
}

String.prototype.RTrim = function(value?: string): string {
	if(isset(value))
	{
		return this.replace(new RegExp(value + "+$"),"");
	}
	return this.replace(/ +$/,"");
}

String.prototype.LTrim = function(value?: string): string
{
	if(isset(value))
	{
		return this.replace(new RegExp('^' + value + "+"),"");
	}
	return this.replace(/^ +/,"");
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str: string): boolean {
      return this.indexOf(str) == 0
    }
}

String.prototype.text = function(allowed: string = ''): string {
  //  discuss at: http://phpjs.org/functions/strip_tags/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Luke Godfrey
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Pul
  //    input by: Alex
  //    input by: Marc Palau
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Bobby Drake
  //    input by: Evertjan Garretsen
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Eric Nagel
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Tomasz Wesolowski
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
  //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
  //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
  //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
  //   returns 2: '<p>Kevin van Zonneveld</p>'
  //   example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
  //   returns 3: "<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>"
  //   example 4: strip_tags('1 < 5 5 > 1');
  //   returns 4: '1 < 5 5 > 1'
  //   example 5: strip_tags('1 <br/> 1');
  //   returns 5: '1  1'
  //   example 6: strip_tags('1 <br/> 1', '<br>');
  //   returns 6: '1 <br/> 1'
  //   example 7: strip_tags('1 <br/> 1', '<br><br/>');
  //   returns 7: '1 <br/> 1'

  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsTags = /<!--[\s\S]*?-->/gi;
  return this
    .replace(commentsTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}