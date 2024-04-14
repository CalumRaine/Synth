class KnobInput extends LabelledInput {
	// Produces numerical input with 0-100 range
	// Translates knob position to param min-max range
	// 	- i.e. 0 to 100 ==> 40Hz to 20kHz
	
	// Translation can be linear or exponential
	// 	- Often need greater control at lower range
	static LINEAR = 1;
	static CURVED = 3;
	static U_SHAPE = 2; // Current unused

	// Can be reflected to include -100 to +100
	// 	- i.e. -100 to 100 ==> -12dB to +12dB
	// 	- Currently only designed for symmetrical inputs
	static REFLECT = true;
	static NO_REFLECT = false;

	// Will increment by given decimal place steps
	// 	- i.e. pitch shift is 1 full note at a time
	// 	- i.e. frequency shown to 5 dp
	static DP_INT = 0;
	static DP_CENT = 2;
	static DP_FREQ = 5;

	paramMin = 0;		// e.g. 20 Hz or 0 ms
	paramMax = 0;		// e.g. 20,000 Hz or 10000 ms
	paramRange = 0;		// max - min
	paramValue = 0;		// e.g. 440 Hz	or 1 ms
	paramUnits = "";	// e.g. Hz or ms
	dp = 0;			// decimal places to increment
	exp = 1;		// linear by default
	reflect = false;	// 0-100 by default

	span = null;
	
	constructor(label, paramMin, paramMax, paramUnits, decimalPlaces, knobPos, slope, reflect){
		super(label);
		this.exp = slope;
		this.reflect = reflect;

		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "range");
		this.input.setAttribute("min", this.reflect ? -100 : 0);
		this.input.setAttribute("max", 100);
		this.input.setAttribute("step", 0.1);
		this.input.setAttribute("value", knobPos);
		this.input.setAttribute("title", "loading...");

		this.span = this.appendChild(document.createElement("span"));

		this.paramMin = paramMin;
		this.paramMax = paramMax;
		this.paramRange = this.paramMax - this.paramMin;
		this.paramUnits = paramUnits;
		this.dp = decimalPlaces;
		this.paramValue = this.knobToParam();
		this.input.percentToParam = (percent) => { this.percentToParam(percent); };
		this.input.addEventListener("input", (event) => { this.knobToParam(); });
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
		this.paramValue = Number(this.paramValue.toFixed(this.dp));
		this.setTitle();
		return this.paramValue;
	}

	setTitle(){
		// Add trailing 's' to plural units if necessary.
		// i.e. "3 Notes" instead of "3 Note"
		let prefix = this.reflect && this.paramValue > 0 ? "+" : "";
		let units = this.paramUnits.length > 3 && !this.paramUnits.endsWith("s") && this.paramValue != 1 ? this.paramUnits + "s" : this.paramUnits;
		this.input.setAttribute("title", `${prefix}${this.paramValue} ${units}`);
		this.span.innerHTML = this.input.getAttribute("title");
		return true;
	}

	toJson(){
		let json = {};
		json.value = this.input.getAttribute("value");
		return json;
	}

	fromJson(json){
		this.input.value = json.value;
		this.input.setAttribute("value", this.input.value);
		this.knobToParam();
		return true;
	}
}

customElements.define("knob-input", KnobInput, { extends: "div" });

