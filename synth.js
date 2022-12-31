class Synth {
	modules = [];
	cables = [];
	nextId = 0;
	audioContext = new AudioContext();
	speakers = null;

	constructor(){
		this.speakers = new Speakers(this.NextId, this.audioContext);
		this.modules.push(this.speakers);
	}

	get NextId(){
		return this.nextId++;
	}

	connect(fromJack, toJack){
		if (fromJack.direction != Jack.OUTPUT || toJack.direction != Jack.INPUT){
			console.log("ERROR: Cables must go from output jack to input jack:", fromJack.direction, toJack.direction);
		}
		else {
			console.log("CONNECTING:", fromJack, "to", toJack);
			this.cables.push(new Cable(fromJack, toJack));
		}
	}

	addOscillatorKey(polyphonic){
		let module = new OscillatorKey(this.NextId, polyphonic, this.audioContext);
		this.modules.push(module);
		return module;
	}
	
	addOscillatorFixed(polyphonic){
		let module = new OscillatorFixed(this.NextId, polyphonic, this.audioContext);
		this.modules.push(module);
		return module;
	}
	
	addFilter(polyphonic){
		let module = new Filter(this.NextId, polyphonic, this.audioContext);
		this.modules.push(module);
		return module;
	}
	
	addGain(polyphonic){
		let module = new Gain(this.NextId, polyphonic, this.audioContext);
		this.modules.push(module);
		return module;
	}

	addEnvelopeAbsolute(from){
		let module = new EnvelopeAbsolute(this.NextId, from, this.audioContext);
		this.modules.push(module);
		return module;
	}
}
