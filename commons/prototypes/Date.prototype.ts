
interface Date {
    getUTCTime(): number
    getTimeAge(d?: Date, i?: string, o?: any): number
    getYearAge(d?: Date): number
    getMonthAge(d?: Date): number
    add(i: string, n: number): void
    addMonth(n: number): void
    addYear(n: number): void
    isPast(d?: Date): boolean
    isFuture(d?: Date): boolean
    isToday(): boolean 
    getAge(d?: Date): any
    isNow(): boolean
    isSameDate(d?: Date): boolean
}

/**
 * get UTC Time
 * @return a utc time of the current date
 */
Date.prototype.getUTCTime = function(): number 
{
    var now = new Date(0)
    now.setUTCFullYear(this.getUTCFullYear())
    now.setUTCMonth(this.getUTCMonth())
    now.setUTCDate(this.getUTCDate())

    now.setUTCHours(this.getUTCHours())
    now.setUTCMinutes(this.getUTCMinutes())
    now.setUTCSeconds(this.getUTCSeconds())
    now.setUTCMilliseconds(this.getUTCMilliseconds())

    return now.getTime()
}

Date.prototype.getTimeAge = function(d?: Date, i: string = 't', o?: any): number
{
	d = d || new Date();
	i = i || 't';
	o = o || { abs: false } ;
	var diff: number = d.getTime() - this.getTime();
	if(o.abs) { diff = Math.abs(diff); }
	switch(i)
	{							 
		case 'd':	return diff / 1000 / 3600 / 24;
		case 'h':	return diff / 1000 / 3600;
		case 'n':	return diff / 1000 / 60;	
		case 's':   return diff / 1000;
		case 't':	
		default:	return diff;
	}
}

Date.prototype.getYearAge = function(d?: Date): number
{
	var dDiff_: Date = new Date(this.getTimeAge(d));
	return dDiff_.getFullYear() - 1970;				
}


Date.prototype.getMonthAge = function(d?: Date): number
{
	var dDiff_: Date = new Date(this.getTimeAge(d));
	return (dDiff_.getFullYear() - 1970) * 12 + (dDiff_.getMonth() + 1);				
}

Date.prototype.add = function(i: string, n: number): void
{
	switch(i)
	{		
		case 'y':	this.addYear(n); break;
		case 'm':	this.addMonth(n); break;
		case 'd':	this.setDate(this.getDate() + n); break;
		case 'h':	this.setHours(this.getHours() + n); break;
		case 'n':	this.setMinutes(this.getMinutes() + n);	break;
		case 's':   this.setSeconds(this.getSeconds() + n); break;
		case 't':	
		default:	this.setTime(this.getTime() + n);
	}					
}
					
Date.prototype.addMonth = function(n: number): void
{
	this.setMonth(this.getMonth() + n);
}
					
Date.prototype.addYear = function(n: number): void
{
	this.setFullYear(this.getFullYear() + n);
}
					
Date.prototype.isPast = function(d?: Date): boolean
{
	d = d || new Date();
	return this.getTime() < d.getTime();
}

Date.prototype.isFuture = function(d?: Date): boolean
{
	d = d || new Date();
	return this.getTime() > d.getTime();
}
					
Date.prototype.isToday = function(): boolean 
{
	return this.isSameDate();		
}

Date.prototype.isSameDate = function(d?: Date): boolean {
	var dNow_: Date  	= d || new Date();
	return this.getFullYear() == dNow_.getFullYear() && this.getMonth() == dNow_.getMonth() && this.getDate() == dNow_.getDate();	
}


Date.prototype.getAge = function(d?: Date): any
{
	var dDiff_: Date = new Date(this.getTimeAge(d));
	return {
		Date	:	dDiff_,
		Year	:	dDiff_.getFullYear() - 1970,
		Month	:	dDiff_.getMonth() + 1,
		Day		:	dDiff_.getDate(),
		Hours	:	dDiff_.getHours(),
		Minutes	:	dDiff_.getMinutes(),
		Seconds	:	dDiff_.getSeconds(),
		Time	:	dDiff_.getTime()
	};				
}

Date.prototype.isNow = function(): boolean
{
	var dNow_: Date  	= new Date();
	return this.isToday() && this.getHours() == dNow_.getHours() && this.getMinutes() == dNow_.getMinutes();					
}	