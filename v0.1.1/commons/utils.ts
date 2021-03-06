
module kit.utils {

	import Locale = manager.Locale

	var _flattenObject = function(result, object, prefix: string): any {

		for ( var prop in object) {
			var key: any = prop
			var value: any = object[key]
			if (typeof value == "object") {
				// Continue with sub object
			    _flattenObject(result, value, key + ".")
			} else if ((typeof value == "string") && value.indexOf("{") == 0) {
				// Try to parse the string as an JSON string
				try {
					value = JSON.parse(value)
					// Continue with sub object
					_flattenObject(result, value, key + ".")
				} catch (e) {
					// Can not parse object, add the value as it
					result[prefix + key] = value
				}
			} else {
				// Add the value
				result[prefix + key] = value
			}
		}
	}

	/**
	 * Clones the given instance.
	 * @param {*} srcInstance An instance.
	 * @return {*} The clone of the given instance.
	 */
	export function clone(srcInstance: any): any {
		if (typeof (srcInstance) != 'object' || srcInstance == null) {
			return srcInstance
		}

		var newInstance = new srcInstance.constructor()

		for (var i in srcInstance) {
			newInstance[i] = clone(srcInstance[i])
		}

		return newInstance
	}

	export function getElementText(element: any): string {
        if(!element) return null
		var text: string = element.text
		if (text !== undefined) {
			return text
		}
		text = element.textContent
		if (text !== undefined) {
			return text
		}
		return <string>element.nodeValue
	}
		
    export function formatEmail(email: string): string {
        var t = email.split('@')
        return t[0].substr(0, 64).replace(/[^.a-zA-Z0-9!#$%&'*_+-/=?^`{|}~]/g, '_') + (t[1] ? '@' + t[1] : '')
    }

    /**
     * Format a string by replacing argument expressed inside curly brackets with given arguments
     * Search occurences of a pattern of the form ${XXXX} or $XXX with the dolar sign not escaped
     * @return a formatted string
     */
    export function formatString(str: string, parameters: any): string {
        var formatted: string, match: RegExpExecArray, re: RegExp, remaining: string, needToTraduce: boolean

        formatted = str
        needToTraduce = false
        remaining = str

        re = new RegExp("\\$(?:\\{(\\!{0,1}(\\w|\\.)+)\\}|(\\!{0,1}(\\w|\\.)+))", "")
        match = re.exec(remaining)
        while (match) {
            // Append the beginning of the match
            var param = match[1]

            if(param && param.startsWith('!')) {
                param = param.substring(1)
                needToTraduce = true
            }

            // Search param the parameters
            var value = ko.unwrap(parameters[param])
            if (isset(value)) {

                if(needToTraduce) {
                    value = app.i18n.getString(value, value)
                }

                // Substitute parameter
                formatted = formatted.replace(match[0], value)
            }

            // 
            remaining = remaining.substring(match[0].length)

            // find next match
            match = re.exec(remaining)
        }

        return formatted
    }
		
	// Flatten an object. e.g. {"a" :"1", "b": {"c" : "2"} becomes {"a": "1", "b.c" : "2"}
	export function flattenObject(object): any {
		var result = {}
		_flattenObject(result, object, "")
		return result
	}

	/**
	 * Parse a given log message
	 * log message MUST respect the following format 
	 * 			
	 * 			var log_message = "log_id {param1:value1}{param2:value2}{param3:value3}"
	 * 
	 * @param a log message as described above
	 * 
	 * @return an object containing the log id and another object for the parameters 
	 * that contains for each param id, its associated value. 
	 */
	export function parseLogMessage(logMessage: any): any {
		var obj: any = {
            id: null,
            parameters: {}
        }
		var parameters: any = {}
		var indexFirstBraket: number
		var indexSecondBraket: number

		// Get the position of the first parameters if it exists
		indexFirstBraket = logMessage.indexOf("{")
		indexSecondBraket = logMessage.indexOf("}")

		if (indexFirstBraket > 0 && indexSecondBraket > 0 && indexFirstBraket < indexSecondBraket) {
			// Get the log id
			obj.id = logMessage.substr(0, indexFirstBraket).trim()

			// Then, retrieve the parameters
			var current = logMessage

			while ((indexFirstBraket >= 0) && (indexSecondBraket > 0) && (indexFirstBraket < indexSecondBraket)) {
				// Is there any parameters between curly brackets ?
				if (indexSecondBraket - indexFirstBraket > 1) {
					// Yes, there is a parameter.... extract it !
					var parameter = current.substr(indexFirstBraket + 1, (indexSecondBraket - indexFirstBraket - 1)).trim()
					var temp = parameter.split(":", 2)		
					parameters[temp[0]] = temp[1]
				}

				// Test if we are at the end of the string
				if (indexSecondBraket == current.length) {
					break;
				} else {
					// We are not at the end of the string, so we can continue !
					current = current.substr(indexSecondBraket + 1)

					indexFirstBraket = current.indexOf("{")
					indexSecondBraket = current.indexOf("}")
				}
			}
		} else {
			obj.id = logMessage.trim()
		}

		obj.parameters = parameters

		return obj
	}

	/**
	 * Parse a given log message which has the following syntax :
	 * {"errorCode":0,"errorMessage":"<ID><{P}>*"}
	 * <ID> should be a valid message id present in the internationalization excel file.
	 * <{P}>* is the paramters which are not translated.
	 * 
	 * example : {"errorCode":0,"errorMessage":"blabla{parameter1}{parameter2}"}
	 * 
	 * @param a log message
	 * @return the internationalized string constructed from the id and the parameters contained
	 * in the logMessage string.
	 */
	export function getInternationalizedLogMessage(logMessage: any): string {
		var message: string
		var jsonObject: any
		
		try {
			jsonObject = JSON.parse(logMessage)
			var log = parseLogMessage(jsonObject.errorMessage)
			var translated_message = app.i18n.getString(log.id)
			
			if (translated_message) {
				message = formatString(translated_message, log.parameters)
			} else {
				message = log.id
			}
		} catch (e) {
			message = e.message
		}
		
		return message
	}
	
	export function getParamValue(param: string, url?: string): string {
		var u = url == undefined ? document.location.href : url
		var reg = new RegExp('(\\?|&|^)'+param+'=(.*?)(&|$)')
		var matches = u.match(reg)
		if(matches) {
			return matches[2] != undefined ? decodeURIComponent(matches[2]).replace(/\+/g,' ') : '';
		}
        return ''
	}
    
    export function formatMonthToYear(PE_nbMonth: number, strict: boolean = true): string {
    
        var sRetour_: string = "";
        var iNbMois12_: number = parseInt("" + (PE_nbMonth / 12));
            
        if (iNbMois12_ <= 1) {
            sRetour_ = iNbMois12_ + " " + app.i18n.getString('year');
        } else {
            sRetour_ = iNbMois12_ + " " + app.i18n.getString('years');
        }
        
        if (!strict && PE_nbMonth % 12 != 0){
            sRetour_ += " " + app.i18n.getString('and') + " " + (PE_nbMonth % 12) + " " + app.i18n.getString('month');
        }
        
        return sRetour_ ;
    }
                 
    /**
     * format dates
     * @param dateFormat the date format defines in local index
     * @return a formatted string date in the "dateFormat" format
     */
    export function formatDate(d: Date, dateFormat: string, hourFormat: string = "", utc: boolean = false): string {

         if(!d) return null;
        
        var get2digits: Function = (num: number): string => {
            return num.toString().lPad('0', 2)
        }

        var getLiteralMonth = function(monthNumber) {
            var months: string[] = [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]
            return app.i18n.getString(months[monthNumber])
        };

        var getLiteralDay = function(dayNumber) {
            var days = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ]
            return app.i18n.getString(days[dayNumber])
        };

        var iFullYear_: number
        var iMonth_: number
        var iDay_: number
        var iDate_: number
        var iHours_: number
        var iMinutes_: number
        var iSeconds_: number
            
        if(utc) {
            iFullYear_ = d.getUTCFullYear();
            iMonth_ = d.getUTCMonth();
            iDate_ = d.getUTCDate();
            iDay_ = d.getUTCDay();
            iHours_ = d.getUTCHours();
            iMinutes_ = d.getUTCMinutes();
            iSeconds_ = d.getUTCSeconds();
        } else {
            iFullYear_ = d.getFullYear();
            iMonth_ = d.getMonth();
            iDate_ = d.getDate();
            iDay_ = d.getDay();
            iHours_ = d.getHours();
            iMinutes_ = d.getMinutes();
            iSeconds_ = d.getSeconds();
        }

        dateFormat = dateFormat.toLowerCase()
        dateFormat = dateFormat.replace('yyyy', iFullYear_.toString())

        var monthType = null, dayType = null

        if (dateFormat.indexOf('month') != -1) {
            monthType = 'month'
            dateFormat = dateFormat.replace('month', '{0}')
        } else if (dateFormat.indexOf('mm') != -1) {
            monthType = 'mm'
            dateFormat = dateFormat.replace('mm', '{0}')
        } else if (dateFormat.indexOf('m') != -1) {
            monthType = 'm'
            dateFormat = dateFormat.replace('m', '{0}')
        }

        if (dateFormat.indexOf('day') != -1) {
            dayType = 'day'
            dateFormat = dateFormat.replace('day', '{1}')
        } else if (dateFormat.indexOf('dd') != -1) {
            dayType = 'dd'
            dateFormat = dateFormat.replace('dd', '{1}')
        } else if (dateFormat.indexOf('d') != -1) {
            dayType = 'd'
            dateFormat = dateFormat.replace('d', '{1}')
        }

        if (monthType == 'month') {
            dateFormat = dateFormat.replace('{0}', getLiteralMonth(iMonth_))
        } else if (monthType == 'mm') {
            dateFormat = dateFormat.replace('{0}', get2digits(iMonth_ + 1))
        } else if (monthType == 'm') {
            dateFormat = dateFormat.replace('{0}', String(iMonth_ + 1))
        }

        if (dayType == 'day') {
            dateFormat = dateFormat.replace('{1}', getLiteralDay(iDay_) + ' ' + iDate_.toString())
        } else if (dayType == 'dd') {
            dateFormat = dateFormat.replace('{1}', get2digits(iDate_))
        } else if (dayType == 'd') {
            dateFormat = dateFormat.replace('{1}', String(iDate_))
        }

        if (dateFormat.indexOf('hh') > -1) {
            dateFormat = dateFormat.replace('hh', get2digits(iHours_))
        }
        if (dateFormat.indexOf('mm') > -1) {
            dateFormat = dateFormat.replace('mm', get2digits(iMinutes_))
        }
        if (dateFormat.indexOf('ss') > -1) {
            dateFormat = dateFormat.replace('ss', get2digits(iSeconds_))
        }

        var hours: string = ''

        if (hourFormat.toLowerCase() == 'h12') {
            var suffix = ' AM'
            hours = get2digits(iHours_)

            if (iHours_ >= 12) {
                suffix = ' PM'

                if (iHours_ != 12) {
                    hours = get2digits(iHours_ - 12)
                }
            } else {
            	if(hours == '00') {
            		hours = '12'
            	}
            }

            hours += ':' + get2digits(iMinutes_) + ':' + get2digits(iSeconds_) + suffix

        } else if (hourFormat.toLowerCase() == 'h24') {
            hours = get2digits(iHours_) + ':' + get2digits(iMinutes_) + ':' + get2digits(iSeconds_)
        }
        
        if (hours) {
            return dateFormat + ' ' + hours
        } else {
            return dateFormat
        }
    }
    
    /**
    * Traite et converti une chaine. La valeur peut être modifiée pour correspondre à une valeur date.
    * Renvoi un objet Calendar contenant la chaine traitée.
    * 
    * @param string	La chaine
    * @param locale 	La locale utilisée
    */
    export function parseLiteralDate(str: string, locale: Locale) {
    
    	 if(!str) return null;
             
    	 var sValue_ = str;
    	 var iJour_  = 0;
    	 var iMois_  = 1;
    	 var iAnnee_ = 2;
    	 var iMarge_ = 50;
    	
    	var tsDate_ = sValue_.split(locale.dateSeparator);
    	if(tsDate_.length == 1)
    	{
            if([4, 6, 8].contains(sValue_.length)) 
            {
            
                tsDate_ = [,,];
                
                var sPosDay_: number = locale.dateLiteralFormat.indexOf('D');
                var sPosMonth_: number = locale.dateLiteralFormat.indexOf('M');
                var sPosYear_: number = locale.dateLiteralFormat.indexOf('Y');
                var sLengthYear_: number = Math.abs(8 - sValue_.length - 4);

                if(sLengthYear_ > 0) {
                    if(sPosYear_ == 0) {
                        tsDate_[iAnnee_] = sValue_.substr(0, sLengthYear_);
                    } else if(sPosYear_ == 1) {
                        tsDate_[iAnnee_] = sValue_.substr(2, sLengthYear_);
                    } else {
                        tsDate_[iAnnee_] = sValue_.substr(4, sLengthYear_);       
                    }
                }
                
                if(sPosDay_ == 0) {
                    tsDate_[iJour_] = sValue_.substr(0, 2);
                } else if(sPosDay_ == 1) {
                    if(sPosYear_ == 0) {
                        tsDate_[iJour_] = sValue_.substr(sLengthYear_, 2);
                    } else {
                        tsDate_[iJour_] = sValue_.substr(2, 2);
                    }
                } else {
                    tsDate_[iJour_] = sValue_.substr(2 + sLengthYear_, 2);
                }
                
                if(sPosMonth_ == 0) {
                    tsDate_[iMois_] = sValue_.substr(0, 2);
                } else if(sPosMonth_ == 1) {
                    if(sPosYear_ == 0) {
                        tsDate_[iMois_] = sValue_.substr(sLengthYear_, 2);
                    } else {
                        tsDate_[iMois_] = sValue_.substr(2, 2);
                    }
                } else {
                    tsDate_[iMois_] = sValue_.substr(2 + sLengthYear_, 2);
                }

            }

    	} else if (tsDate_.length == 2) {
    		return null;
    	}
    	
    	var sJour_;
    	var sMois_;
    	var sAnnee_;
    
    	switch(tsDate_.length)
    	{
    		case 3:	sJour_  = tsDate_[iJour_];
    				sMois_  = tsDate_[iMois_];
    				sAnnee_ = tsDate_[iAnnee_];
    				break;
    		case 2: sJour_  = tsDate_[iJour_];
    				sMois_  = tsDate_[iMois_];
    				sAnnee_ = CString(new Date().getFullYear());
    				break;
    		default:
    				return null;
    	}
    	
    	if(isNaN(sJour_) || isNaN(sMois_) || isNaN(sAnnee_))
    	{
    		return null;
    	}
    	
        var iMois_: number = parseInt(sMois_, 10);
        
    	if(iMois_ == 0)
    	{
    		iMois_ = 1;
            sMois_ = "1";
    	}
    	
    	if (iMois_ > 0 && iMois_ < 13){
    		var iJourMax_ = 31;
    		switch(iMois_)
    		{
    			case 2:
    				iJourMax_=29;
    				break;
    			case 4:	
    			case 6:	
    			case 9:	
    			case 11:	
    				iJourMax_=30;
    				break;
    		}
    		if (parseInt(sJour_, 10)> iJourMax_)
    		{ 
    			return null;
    		}
    	}else{
    		return null;
    	}
    	
    	sAnnee_ = sAnnee_.lPad("0", 2);
    	var iAnCour_ = new Date().getFullYear();
    	var iAnTemp_ = iAnCour_ - iMarge_;
    	var sAnTemp_ = sAnnee_.lPad(CString(iAnTemp_).substr(0, 2), 4);
    	if(parseInt(sAnTemp_, 10) < (iAnCour_ - iMarge_))
    	{
    		sAnnee_ = sAnnee_.lPad(CString(iAnCour_).substr(0, 2), 4);	
    	} else {
    		sAnnee_ = sAnTemp_;
    	}
    	if (parseInt(sAnnee_, 10) < 1900 || parseInt(sAnnee_, 10) > 9999)
    	{
    		return null;
    	}
    
    	return new Date(parseInt(sAnnee_, 10), parseInt(sMois_, 10) - 1, parseInt(sJour_, 10));
    	
    };
    
    export function formatDecimal(str: string, digits?: number, locale?: Locale): string
	{
		if(is_numeric(str))
		{
		
			if(!isset(locale)) {
				locale = app.i18n.getCurrentLocale();
			}
		
			var sign = "";
			if(Number(str) < 0)
			{
				sign = "-";
			}
			var fvalue_: number = Math.abs(Number(str));
			if(isset(digits)) {
				fvalue_ = fvalue_.round(digits);
			}
			var sVal_: string = String(fvalue_);
	
			var sGroupSeparator_: string = locale.decimalGroupSeparator;
			var sSeparator_: string = locale.decimalSeparator;
			var iGroupDigits_: number = locale.decimalGroupDigits;
						
			sVal_ = sVal_.replace(".", sSeparator_);
		
			var tsVal_ = sVal_.split(sSeparator_);
			
			var sEnt_: string = tsVal_[0];
			var sDec_: string = tsVal_[1];
	
			if (sEnt_.length > iGroupDigits_) 
			{
				var iNbPart_ = Math.round(sEnt_.length / iGroupDigits_);
				if (iNbPart_ < sEnt_.length / iGroupDigits_) iNbPart_++;
				var tsPart_ = [];
				for (var i_=0; i_< iNbPart_; i_++) {
					tsPart_[iNbPart_-i_-1]= String(sEnt_).substring(sEnt_.length-iGroupDigits_*(i_+1),sEnt_.length-iGroupDigits_*i_);
				}
				sEnt_=tsPart_.join(sGroupSeparator_);
			}
	
            sDec_ = (sDec_ || '').rPad('0', digits);
            
			return sign + (sDec_.length != 0?sEnt_.concat(sSeparator_).concat(sDec_):sEnt_);
		}
		return str;
	
	}
    
    export function genId(l: number = 10) {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".random(l);
    }
    
}