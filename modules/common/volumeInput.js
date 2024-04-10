class VolumeInput extends NumericalInput {
	static MIN = 0;
	static MAX = 1;
	static DEFAULT = 0.5;
	constructor(label){
		super(label, VolumeInput.DEFAULT, VolumeInput.MIN, VolumeInput.MAX, false, "");
	}
}

