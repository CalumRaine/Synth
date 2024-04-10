class NumericalInput extends LabelledInput {
	// Produces numerical input with range 0-100 
	// Will internally convert value to between specified min-max
	// Conversion can be linear or exponential

	// Possible confusion between parameter value (true value) and input value (percent)
	// Will eventually be a range/knob input
	// Suitable for continuous values, such as freq filters and time
	// Unsuitable for discrete values, such as note shifts
	
	// Exponential slope allows finer control at lower end of range
	// 	- e.g. fade time
	//	- e.g. cutoff frequency
	// Exponent could be increased further but 2 works well
	static SLOPE_LINEAR = 1;
	static SLOPE_EXP = 2;
	
	min = 0;		// e.g. 20 Hz or 0 ms
	max = 0;		// e.g. 20,000 Hz or 10000 ms
	value = 0;		// e.g. 440 Hz	or 1 ms
	exp = 1;		// linear by default
	units = "";		// e.g. Hz or ms
	range = 0;		// max - min
	constructor(label, value, min, max, exponential, units){
		super(label);
		this.value = value;
		this.min = min;
		this.max = max;
		this.range = this.max - this.min;
		this.exp = exponential ? NumericalInput.SLOPE_EXP : NumericalInput.SLOPE_LINEAR;
		this.units = units;
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("min", 0);
		this.input.setAttribute("max", 100);
		this.input.setAttribute("step", 0.01);
		this.input.setAttribute("title", `${this.value} ${this.units}`);
		this.input.setAttribute("value", this.valueToPercent(this.value));
		this.input.setPercent = (percent) => { this.Percent = percent; };
		this.input.oninput = (event) => { event.stopPropagation(); this.Percent = parseFloat(this.input.value); };
	}

	get Value(){
		// Override: return true parameter value not percentage value from input.
		return this.value;
	}

	set Percent(percent){
		// Translate percentage value between min-max scale
		// Called when:
		// 	* MIDI knob turned and element has focus
		//	* User modifies on-screen input
		this.value = this.percentToValue(percent);
		this.input.value = percent;
		this.input.setAttribute("value", this.input.value);

		this.input.setAttribute("title", `${this.value} ${this.units}`);

		// Promp parent to update sounds on the fly
		this.dispatchEvent(new Event("input", { bubbles: true }));
	}

	percentToValue(x){
		// Translates 0-100 scale to min-max scale
		x = (x ** this.exp) / (100 ** (this.exp - 1));
		let fraction = x / 100;
		let y = this.range * fraction;
		y += this.min;
		return y;
	}

	valueToPercent(y){
		y -= this.min;
		let fraction = y / this.range;
		let x = fraction * 100;
		x = Math.pow(x * (100 ** (this.exp - 1)), 1/this.exp);
		return x;
	}
}

customElements.define("numerical-input", NumericalInput, { extends: "div" });

