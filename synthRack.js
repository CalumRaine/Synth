class SynthRack extends HTMLDivElement {

}

class SynthPatch extends HTMLDivElement {
	waveformSelector = null;
	freqLfo = null;

	constructor(){
		super();
		this.waveformSelector = new WaveformSelector();
		this.appendChild(this.waveformSelector);

		this.freqLfo = new LfoModule("Freq LFO");
		this.appendChild(this.freqLfo);
	}
}

customElements.define("synth-patch", SynthPatch, { extends: "div" });
