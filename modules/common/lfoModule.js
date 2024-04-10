class LfoModule extends HTMLFieldSetElement {
	shape = null;

	static FREQ_MIN = 0;
	static FREQ_MAX = 40;
	static FREQ_DEFAULT = 0;
	static FREQ_UNITS = "Hz";
	freq = null;

	static DEPTH_DEFAULT = 0;
	static DEPTH_MIN = 0
	depth = null;

	oscillators = [];
	gains = [];
	constructor(maxDepth, unitsDepth, expDepth){
		super();
		super.setAttribute("is", "lfo-module");
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "LFO";

		this.shape = this.appendChild(new OscShape());
		this.depth = this.appendChild(new NumericalInput("Depth", LfoModule.DEPTH_DEFAULT, LfoModule.DEPTH_MIN, maxDepth, expDepth, unitsDepth));
		this.freq = this.appendChild(new NumericalInput("Freq", LfoModule.FREQ_DEFAULT, LfoModule.FREQ_MIN, LfoModule.FREQ_MAX, true, LfoModule.FREQ_UNITS));
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

