class TimeInput extends NumericalInput {
	static MIN = 0;
	static MAX = 10000;
	static DEFAULT = 0;
	constructor(label){
		super(label, TimeInput.DEFAULT, TimeInput.MIN, TimeInput.MAX, NumericalInput.SLOPE_EXP, "ms");
	}
}

