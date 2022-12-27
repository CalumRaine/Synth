class Synth extends Control {
	ac = new AudioContext();
	nodes = [];
	nextId = 1;

	constructor(){
		super(0, null, "Speakers");
		this.node = this.ac.destination;
		this.nodes.push(this);
	}

	addOscillator(){
		this.nodes.push( new Oscillator(this.NextId, this) );
	}

	addGain(){
		this.nodes.push( new Gain(this.NextId, this) );
	}

	addFilter(){
		this.nodes.push( new Filter(this.NextId, this) );
	}

	get NextId() {
		this.nextId += 1;
		return this.nextId;
	}
}

/*

let filter = new BiquadFilterNode(ac);
filter.frequency.value = 1000;
filter.type = "highpass"; // lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass

let gain = new GainNode(ac);
gain.gain.value = 0.05;

osc.connect(filter).connect(gain).connect(ac.destination);


/* PARAMS
 * Oscillator
 * 	Wave Type
 * 	Detune
 * Filter
 * 	Filter Type
 * 	Frequency
 * 	Q Factor
 * Gain
 * 	Volume
 */
