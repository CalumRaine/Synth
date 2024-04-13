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

	sync = null;

	masterOsc = null;
	oscillators = [];

	masterGain = null;
	gains = [];
	constructor(maxDepth, unitsDepth, linearDepth){
		super();
		super.setAttribute("is", "lfo-module");
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "LFO";

		this.shape = this.appendChild(new OscShape());
		this.depth = this.appendChild(new KnobInput("Depth", LfoModule.DEPTH_MIN, maxDepth, unitsDepth, KnobInput.DP_CENT, LfoModule.DEPTH_DEF, linearDepth, KnobInput.NO_REFLECT));
		this.freq = this.appendChild(new KnobInput("Freq", LfoModule.FREQ_MIN, LfoModule.FREQ_MAX, LfoModule.FREQ_UNIT, KnobInput.DP_FREQ, LfoModule.FREQ_DEF, KnobInput.CURVED, KnobInput.NO_REFLECT));

		// Polyphony is often better if the LFO is synced to one master wave
		this.sync = this.appendChild(new ToggleInput("Sync", false));
		this.sync.light.addEventListener("click", (event) => { return this.sync.Checked ? false : this.stopMaster(); });
	}

	duplicate(){
		let dupe = new LfoModule(this.depth.paramMax, this.depth.paramUnits, this.depth.exp);
		
		dupe.shape.input.value = this.shape.input.value;
		
		dupe.freq.input.value = this.freq.input.value;
		dupe.freq.knobToParam();
		
		dupe.depth.input.value = this.depth.input.value;
		dupe.depth.knobToParam();

		dupe.sync.Checked = this.sync.Checked;

		return dupe;
	}

	makeSound(audioContext, key){
		if (this.sync.Checked){
			return this.masterGain == null ? this.makeMaster(audioContext) : this.masterGain;
		}

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

	makeMaster(audioContext){
		let osc = audioContext.createOscillator();
		osc.type = this.shape.Value;
		osc.frequency.value = this.freq.Value;
		osc.start();
		this.masterOsc = osc;

		let gain = audioContext.createGain();
		gain.gain.value = this.depth.Value;
		this.masterGain = gain;

		osc.connect(gain);
		return this.masterGain;
	}

	updateSound(){
		for (let osc of this.oscillators){
			osc.frequency.value = this.freq.Value;
			osc.type = this.shape.Value;
		}

		if (this.masterOsc != null){
			this.masterOsc.frequency.value = this.freq.Value;
			this.masterOsc.type = this.shape.Value;
		}

		for (let gain of this.gains){
			gain.gain.value = this.depth.Value;
		}

		if (this.masterGain != null){
			this.masterGain.gain.value = this.depth.Value;
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

	stopMaster(){
		if (this.masterGain != null){
			// Nothing to clean up
			return false;
		}

		this.masterOsc.stop();
		this.masterOsc.disconnect();
		this.masterOsc = null;

		this.masterGain.disconnect();
		this.masterGain = null;
		return true;
	}

	toJson(){
		let json = {};
		json.freq = this.freq.toJson();
		json.depth = this.depth.toJson();
		json.sync = this.sync.toJson();
		return json;
	}

	fromJson(json){
		this.freq.fromJson(json.freq);
		this.depth.fromJson(json.depth);
		this.sync.fromJson(json.sync);
		return true;
	}
}

customElements.define("lfo-module", LfoModule, { extends: "fieldset" });

