class LfoModule extends HTMLFieldSetElement {
	static SHAPES = ["Sine", "Triangle", "Square", "Sawtooth", "Random"];
	shape = null;

	static FREQ_MIN = 0;
	static FREQ_MAX = 40;
	static FREQ_DEF = 0;
	static FREQ_UNIT = "Hz";
	freq = null;

	static DEPTH_DEF = 0;
	static DEPTH_MIN = 0;
	depth = null;

	attack = null;

	sync = null;

	help = null;

	masterOsc = null;
	oscillators = [];

	masterOscGain = null;
	oscGains = [];
	
	masterSource = null;
	sources = [];

	gains = [];

	constructor(maxDepth, unitsDepth, linearDepth, helpText){
		super();
		super.setAttribute("is", "lfo-module");
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "LFO";

		this.shape = this.appendChild(new DropdownInput("Shape", LfoModule.SHAPES));
		this.freq = this.appendChild(new KnobInput("Freq", LfoModule.FREQ_MIN, LfoModule.FREQ_MAX, LfoModule.FREQ_UNIT, KnobInput.DP_FREQ, LfoModule.FREQ_DEF, KnobInput.CURVED, KnobInput.NO_REFLECT));
		this.depth = this.appendChild(new KnobInput("Depth", LfoModule.DEPTH_MIN, maxDepth, unitsDepth, KnobInput.DP_CENT, LfoModule.DEPTH_DEF, linearDepth, KnobInput.NO_REFLECT));
		this.attack = this.appendChild(new KnobInput("Attack", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));

		// Polyphony is often better if the LFO is synced to one master wave
		this.sync = this.appendChild(new ToggleInput("Sync", false));
		this.sync.light.addEventListener("click", (event) => { return this.sync.Checked ? false : this.stopMaster(); });

		this.help = this.appendChild(new HelpButton(helpText));

		this.addEventListener("input", (event) => { this.updateSound(); });
	}

	get IsRandom(){
		return this.shape.Value == "random";
	}

	get MasterInitialised(){
		return this.masterSource != null;
	}

	makeSound(audioContext, key){
		let src = null;
		if (this.sync.Checked){
			src = this.MasterInitialised ? this.masterSource : this.makeMaster(audioContext);
		}
		else {
			let osc = audioContext.createOscillator();
			osc.type = this.IsRandom ? osc.type : this.shape.Value;
			osc.frequency.value = this.freq.Value;
			osc.calumKey = key;
			osc.start();
			this.oscillators.push(osc);

			let oscGain = audioContext.createGain();
			oscGain.calumKey = key;
			oscGain.gain.value = this.IsRandom ? 0.0 : this.depth.Value;
			this.oscGains.push(oscGain);

			// When LFO is randomised, src behaves as a randomiser:
			// 	- Ignore oscillator by silencing gain
			// 	- Randomise src offset at set intervals
			// When LFO not randomised, src behaves as a pass-through:
			// 	- Reinstate oscillator by restoring gain
			// 	- Cancel any scheduled changes
			// 	- Return src offset to 0
			// 	- Clear interval
			src = audioContext.createConstantSource();
			src.offset.value = 0.0;
			src.calumInterval = !this.IsRandom ? null : this.randomInterval(src);
			src.calumKey = key;
			src.start();
			this.sources.push(src);
			
			osc.connect(oscGain);
			oscGain.connect(src.offset);
		}

		// Shape output with attack and release
		let gain = audioContext.createGain();
		gain.calumKey = key;
		gain.gain.value = 0.0;
		gain.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + (this.attack.Value / 1000));
		this.gains.push(gain);

		src.connect(gain);
		return gain;
	}

	makeMaster(audioContext){
		let osc = audioContext.createOscillator();
		osc.type = this.IsRandom ? osc.type : this.shape.Value;
		osc.frequency.value = this.freq.Value;
		osc.start();
		this.masterOsc = osc;

		let oscGain = audioContext.createGain();
		oscGain.gain.value = this.IsRandom ? 0.0 : this.depth.Value;
		this.masterOscGain = oscGain;

		let src = audioContext.createConstantSource();
		src.offset.value = 0.0;
		src.calumInterval = !this.IsRandom ? null : this.randomInterval(src);
		src.start();
		this.masterSource = src;

		osc.connect(oscGain);
		oscGain.connect(src.offset);
		return this.masterSource;
	}

	randomInterval(src){
		return window.setInterval(() => {
			let value = Math.random() * this.depth.Value;
			value *= 2;
			value -= this.depth.Value;
			src.offset.linearRampToValueAtTime(value, src.context.currentTime + (1 / Math.max(0.00001, this.freq.Value)));
		}, 1000 / Math.max(0.00001, this.freq.Value));
	}

	updateSound(){
		for (let osc of this.oscillators){
			osc.frequency.value = this.freq.Value;
			osc.type = this.IsRandom ? osc.type : this.shape.Value;
		}

		if (this.masterOsc != null){
			this.masterOsc.frequency.value = this.freq.Value;
			this.masterOsc.type = this.IsRandom ? this.masterOsc.type : this.shape.Value;
		}

		for (let oscGain of this.oscGains){
			oscGain.gain.value = this.IsRandom ? 0.0 : this.depth.Value;
		}

		if (this.masterOscGain != null){
			this.masterOscGain.gain.value = this.IsRandom ? 0.0 : this.depth.Value;
		}

		for (let src of this.sources){
			window.clearInterval(src.calumInterval);
			src.offset.cancelScheduledValues(0.0);
			src.offset.value = 0.0;
			src.calumInterval = !this.IsRandom ? null : this.randomInterval(src);
		}

		if (this.masterSource != null){
			window.clearInterval(this.masterSource.calumInterval);
			this.masterSource.offset.cancelScheduledValues(0.0);
			this.masterSource.offset.value = 0.0;
			this.masterSource.calumInterval = !this.IsRandom ? null : this.randomInterval(this.masterSource);
		}

		return true;
	}

	stopSound(audioContext, key, releaseMs){
		let matchingOsc = this.oscillators.filter(o => o.calumKey == key);
		for (let osc of matchingOsc){
			let index = this.oscillators.findIndex(o => o == osc);
			this.oscillators.splice(index, 1);
		}

		let matchingOscGains = this.oscGains.filter(o => o.calumKey == key);
		for (let oscGain of matchingOscGains){
			let index = this.oscGains.findIndex(g => g == oscGain);
			this.oscGains.splice(index, 1);
		}

		let matchingSources = this.sources.filter(s => s.calumKey == key);
		for (let src of matchingSources){
			window.clearInterval(src.calumInterval);
			let index = this.sources.findIndex(s => s.calumKey == key);
			this.sources.splice(index, 1);
		}

		let matchingGains = this.gains.filter(g => g.calumKey == key);
		for (let gain of matchingGains){
			gain.gain.cancelScheduledValues(0.0);
			gain.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + (releaseMs / 1000));
			let index = this.gains.findIndex(g => g == gain);
			this.gains.splice(index, 1);
		}

		setTimeout(() => {
			matchingOsc.forEach(o => { o.stop(); o.disconnect(); });
			matchingOscGains.forEach(g => g.disconnect() );
			matchingSources.forEach(s => { s.stop(); s.disconnect(); });
			matchingGains.forEach(g => g.disconnect() );
		}, releaseMs);

		return true;
	}

	stopMaster(){
		if (!this.MasterInitialised){
			// Nothing to clean up
			return false;
		}

		this.masterOsc.stop();
		this.masterOsc.disconnect();
		this.masterOsc = null;

		this.masterOscGain.disconnect();
		this.masterOscGain = null;

		window.clearInterval(this.masterSource.calumInterval);
		this.masterSource.offset.cancelScheduledValues(0.0);
		this.masterSource.stop();
		this.masterSource.disconnect();
		this.masterSource = null;

		return true;
	}

	toJson(){
		let json = {};
		json.freq = this.freq.toJson();
		json.depth = this.depth.toJson();
		json.attack = this.attack.toJson();
		json.sync = this.sync.toJson();
		return json;
	}

	fromJson(json){
		this.freq.fromJson(json.freq);
		this.depth.fromJson(json.depth);
		this.attack.fromJson(json.attack);
		this.sync.fromJson(json.sync);
		return true;
	}
}

customElements.define("lfo-module", LfoModule, { extends: "fieldset" });

