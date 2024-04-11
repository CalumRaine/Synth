class KnobInput extends LabelledInput {
	// Produces numerical input with 0-100 range
	// Translates knob position to param min-max range
	// 	- i.e. 0 to 100 ==> 40Hz to 20kHz
	// Can be reflected to include -100 to +100
	// 	- i.e. -100 to 100 ==> -12dB to +12dB
	// 	- Currently only designed for symmetrical inputs
	// Translation can be linear or exponential
	// 	- Often need greater control at lower range
	static LINEAR = 1;
	static CURVED = 3;
	static U_SHAPE = 2; // Probably useful for panning later

	static REFLECT = true;
	static NO_REFLECT = false;

	paramMin = 0;		// e.g. 20 Hz or 0 ms
	paramMax = 0;		// e.g. 20,000 Hz or 10000 ms
	paramRange = 0;		// max - min
	paramValue = 0;		// e.g. 440 Hz	or 1 ms
	paramUnits = "";	// e.g. Hz or ms
	exp = 1;		// linear by default
	reflect = false;	// 0-100 by default
	
	constructor(label, paramMin, paramMax, paramUnits, knobPos, slope, reflect){
		super(label);
		this.exp = slope;
		this.reflect = reflect;

		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("min", this.reflect ? -100 : 0);
		this.input.setAttribute("max", 100);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("value", knobPos);
		this.input.setAttribute("title", "loading...");

		this.paramMin = paramMin;
		this.paramMax = paramMax;
		this.paramRange = this.paramMax - this.paramMin;
		this.paramUnits = paramUnits;
		this.paramValue = this.knobToParam();
		this.input.percentToParam = (percent) => { this.percentToParam(percent); };
		this.input.oninput = (event) => { this.knobToParam(); };
	}

	get Value(){
		// Override: return true parameter value not percentage value from input.
		return this.paramValue;
	}

	percentToParam(percent){
		// Called when MIDI knob turns
		if (this.reflect){
			percent *= 2;
			percent -= 100;
		}

		this.input.value = percent;
		this.input.setAttribute("value", this.input.value);
		this.knobToParam();
		
		// Simulate user changing input
		this.dispatchEvent(new Event("input", { bubbles: true }));
	}

	knobToParam(){
		// Convert knob position to parameter value
		let x = parseFloat(this.input.value) ** this.exp;
		let denominator = 100 ** (this.exp - 1);
		x /= denominator;
		
		let y = this.paramRange * (x / 100);
		
		this.paramValue = this.paramMin;
		this.paramValue *= x < 0 ? -1 : 1;
		this.paramValue += y;
		this.input.setAttribute("title", `${this.paramValue} ${this.paramUnits}`);
		return this.paramValue;
	}
}

customElements.define("knob-input", KnobInput, { extends: "div" });

