interface Number {
	round(decimal?: number): number
}

Number.prototype.round = function(decimal: number = 2): number {
	return Number(Number(this).toFixed(decimal))
}