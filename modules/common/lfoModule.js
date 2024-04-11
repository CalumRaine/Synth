class LfoModule extends HTMLFieldSetElement {
	shape = null;

	static FREQ_MIN = 0;
	static FREQ_MAX = 40;
	static FREQ_DEF = 0;
	static FREQ_UNIT = "Hz";
	freq = null;

	static DEPTH_DEF = 0;
	static DEPTH_MIN = 0
	depth = null;

	oscillators = [];
	gains = [];
	constructor(maxDepth, unitsDepth, linearDepth){
		super();
		super.setAttribute("is", "lfo-module");
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "LFO";

		this.shape = this.appendChild(new OscShape());
		this.depth = this.appendChild(new KnobInput("Depth", LfoModule.DEPTH_MIN, maxDepth, unitsDepth, KnobInput.DP_CENT, LfoModule.DEPTH_DEF, linearDepth, KnobInput.NO_REFLECT));
		this.freq = this.appendChild(new KnobInput("Freq", LfoModule.FREQ_MIN, LfoModule.FREQ_MAX, LfoModule.FREQ_UNIT, KnobInput.DP_FREQ, LfoModule.FREQ_DEF, KnobInput.CURVED, KnobInput.NO_REFLECT));
	}

	duplicate(){
		let dupe = new LfoModule(this.depth.paramMax, this.depth.paramUnits, this.depth.exp);
		
		dupe.shape.input.value = this.shape.input.value;
		
		dupe.freq.input.value = this.freq.input.value;
		dupe.freq.paramValue = this.freq.paramValue;
		
		dupe.depth.input.value = this.depth.input.value;
		dupe.depth.paramValue = this.depth.paramValue;
		
		return dupe;
	}

	makeSound(audioContext, key){
		let osc = audioContext.createOscillator();
		osc.calumKey = key;
		osc.type = this.shape.Value;
		osc.frequency.value = this.freq.Value;
		osc.start();
		this.oscillators.push(osc);

		let gain = audioContext.createGain();
		gain.calumKey = key;
		gain.gain.value = this.depth.Value;
		this.gains.push(gain);

		osc.connect(gain);
		return gain;
	}

	updateSound(){
		for (let osc of this.oscillators){
			osc.frequency.value = this.freq.Value;
			osc.type = this.shape.Value;
		}

		for (let gain of this.gains){
			gain.gain.value = this.depth.Value;
		}

		return true;
	}

	stopSound(audioContext, key){
		let matchingOsc = this.oscillators.filter(o => o.calumKey == key);
		for (let osc of matchingOsc){
			let index = this.oscillators.findIndex(o => o == osc);
			this.oscillators.splice(index, 1);
			osc.stop();
			osc.disconnect();
		}

		let matchingGains = this.gains.filter(o => o.calumKey == key);
		for (let gain of matchingGains){
			let index = this.gains.findIndex(g => g == gain);
			this.gains.splice(index, 1);
			gain.disconnect();
		}

		return true;
	}
}

customElements.define("lfo-module", LfoModule, { extends: "fieldset" });

