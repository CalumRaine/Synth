class TimeInput extends NumericalInput {
	static MIN = 0;
	static MAX = 10000;	// 10 secs
	static DEFAULT = 0;
	static UNITS = "ms";
	constructor(label){
		super(label, TimeInput.DEFAULT, TimeInput.MIN, TimeInput.MAX, NumericalInput.SLOPE_EXP, TimeInput.UNITS);
	}
}

