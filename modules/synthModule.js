class SynthModule extends HTMLFieldSetElement {
	waveSelect = null;
	shift = null;
	detune = null;
	oscillators = [];

	constructor(){
		super();
		super.setAttribute("is", "synth-module");
		this.waveSelect = this.appendChild(new WaveSelect());
		this.shift = this.appendChild(new PitchShift());
		this.detune = this.appendChild(new PitchDetune());
	}

	makeSound(audioContext, key, speakers){
		let oscillator = audioContext.createOscillator();
		oscillator.type = this.waveSelect.Value;

		let freq = key.freq;
		freq = this.shift.calculate(freq);
		freq = this.detune.calculate(freq);

		oscillator.frequency.value = freq;
		oscillator.keyNum = key.num;
		oscillator.connect(speakers);
		oscillator.start();
		this.oscillators.push(oscillator);
		return true;
	}

	stopSound(key){
		let matching = this.oscillators.filter(o => o.keyNum == key.num);
		for (let oscillator of matching){
			oscillator.stop();
			oscillator.disconnect();
			let index = this.oscillators.findIndex(o => o == oscillator);
			this.oscillators.splice(index, 1);
		}
		
		return true;
	}
}

customElements.define("synth-module", SynthModule, { extends: "fieldset" });

