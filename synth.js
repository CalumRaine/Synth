class Key {
	static KEY_DOWN = 0;
	static KEY_UP = 1;
	state = 0;
	keyId = 0;
	frequency = 440;
	nodes = [];

	constructor(id, frequency){
		this.keyId = id;
		this.frequency = frequency;

		// Make duplicates of polyphonic modules
		synth.modules.filter(module => module.polyphonic).map(module => module.make(this.keyId));

		// Set frequency of OscillatorKey modules
		synth.modules.filter(module => module.moduleType == Module.OSCILLATOR_KEY)
			     .forEach(module => module.nodes.find(node => node.keyId == this.keyId).frequency.value = this.frequency);

		// Make connections
		synth.cables.forEach(cable => cable.connect(this.keyId));

		// Trigger envelopes
		synth.modules.filter(module => module.moduleType == Module.ENVELOPE_RELATIVE || module.moduleType == Module.ENVELOPE_ABSOLUTE)
			     .forEach(module => module.trigger(this.keyId));
	}

	remove(){
		synth.cables.forEach(cable => cable.disconnect(this.nodes));
		synth.nodes = [];
		return this;
	}
}

class Jack {
	static INPUT = 0;
	static OUTPUT = 1;
	direction = Jack.INPUT;
	moduleId = 0;
	plug = function() {};
	cable = null;
	nodes = [];

	constructor(moduleId, direction, nodes, plug){
		this.moduleId = moduleId;
		this.direction = direction;
		this.nodes = nodes;
		this.plug = plug;
	}
}

class Cable {
	fromJack = null;
	toJack = null;

	constructor(fromJack, toJack){
		this.fromJack = fromJack;
		this.toJack = toJack;
		this.fromJack.cable = this;
		this.toJack.cable = this;
	}

	fromNode(keyId){
		let node = this.fromJack.nodes.find(node => node.keyId == keyId);
		return node == undefined ? this.fromJack.nodes.length == 0 ? null : this.fromJack.nodes[0] : node;
	}

	toNode(keyId){
		let node = this.toJack.nodes.find(node => node.keyId == keyId);
		return node == undefined ? this.toJack.nodes[0] : node;
	}

	connect(keyId){
		if (this.fromJack.nodes == null || this.toJack.nodes == null){
			// There are no WebAudio connections between control nodes, such as Envelopes
			return;
		}

		let fromNode = this.fromNode(keyId);
		let toNode = this.toNode(keyId);

		this.fromJack.plug(fromNode).connect(this.toJack.plug(toNode));
	}

	disconnect(nodes){
		this.fromNode(nodes).disconnect();
	}
}

class Module {
	audioContext = null;
	moduleId = 0;
	moduleType = 0;
	static OSCILLATOR = 0;
	static OSCILLATOR_KEY = 1;
	static OSCILLATOR_FIXED = 2;
	static FILTER = 3;
	static GAIN = 4;
	static SPEAKERS = 5;
	static ENVELOPE = 6;
	static ENVELOPE_RELATIVE = 7;
	static ENVELOPE_ABSOLUTE = 8;

	constructor(id, type, audioContext){
		this.moduleId = id;
		this.moduleType = type;
		this.audioContext = audioContext;
	}

	triggerEvent(value, func){
		let e = new CustomEvent("Synth Event", { detail: { func: func, value: value, moduleId: this.moduleId } } );
		document.dispatchEvent(e);
	}
}

class SoundModule extends Module {
	polyphonic = false;
	nodes = [];

	constructor(id, type, polyphonic, audioContext){
		super(id, type, audioContext);
		this.polyphonic = polyphonic;
		if (!this.polyphonic){
			this.make(Keyboard.MONOPHONIC);
		}
	}

	make(node, keyId){
		node.moduleId = this.moduleId;
		node.keyId = keyId;
		this.nodes.push(node);
		return node;
	}
}

class ControlModule extends Module {
	constructor(id, type, audioContext){
		super(id, type, audioContext);
	}
}

class Oscillator extends SoundModule {
	type = "sine";
	types = ["sine", "square", "sawtooth", "triangle"];
	frequencyJack = null;
	outputJack = null;

	constructor(id, moduleType, polyphonic, audioContext){
		super(id, moduleType, polyphonic, audioContext);
		this.frequencyJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.frequency; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		this.nodes.forEach(node => node.type = this.type);
	}

	make(node, keyId){
		node.type = this.type;
		node.start();
		return super.make(node, keyId);
	}
}

class OscillatorKey extends Oscillator {
	constructor(id, polyphonic, audioContext){
		super(id, Module.OSCILLATOR_KEY, polyphonic, audioContext);
	}

	make(keyId){
		let node = new OscillatorNode(this.audioContext);
		return super.make(node, keyId);
	}
}

class OscillatorFixed extends Oscillator {
	frequency = 440;

	constructor(id, polyphonic, audioContext){
		super(id, Module.OSCILLATOR_FIXED, polyphonic, audioContext);
	}

	set Frequency(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.frequency = value;
		this.nodes.forEach(node => node.frequency.value = this.frequency);
	}

	make(keyId){
		let node = new OscillatorNode(this.audioContext);
		return super.make(node, keyId);
	}
}

class Filter extends SoundModule {
	type = "lowpass";
	types = ["lowpass", "highpass", "lowshelf", "highshelf", "bandpass", "peaking", "notch", "allpass"];
	frequency = 1000;
	frequencyJack = null;
	qFactor = 1;
	qFactorJack = null;
	inputJack = null;
	outputJack = null;

	constructor(id, polyphonic, audioContext){
		super(id, Module.FILTER, polyphonic, audioContext);
		this.frequencyJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.frequency; });
		this.qFactorJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.Q; });
		this.inputJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		this.nodes.forEach(node => node.type = this.type);
	}

	set Frequency(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.frequency = value;
		this.nodes.forEach(node => node.frequency.value = this.frequency);
	}

	set QFactor(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.qFactor = value;
		this.nodes.forEach(node => node.Q.value = this.qFactor);
	}

	make(keyId){
		let node = new BiquadFilterNode(this.audioContext);
		node.type = this.type;
		node.frequency.value = this.frequency;
		node.Q.value = this.qFactor;
		return super.make(node, keyId);
	}
}

class Gain extends SoundModule {
	gain = 1;
	gainJack = null;
	inputJack = null;
	outputJack = null;

	constructor(id, polyphonic, audioContext){
		super(id, Module.GAIN, polyphonic, audioContext);
		this.gainJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.gain; });
		this.inputJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
	}

	set Gain(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.gain = value;
		this.nodes.forEach(node => node.gain.value = this.gain);
	}

	make(keyId){
		let node = new GainNode(this.audioContext);
		node.gain.value = this.gain;
		return super.make(node, keyId);
	}
}

class Envelope extends ControlModule {
	from = 0;
	waypoints = [];
	outputJack = null;

	constructor(id, type, from, audioContext){
		super(id, type, audioContext);
		this.from = from;
		this.outputJack = new Jack(id, Jack.OUTPUT, null, function(node) { return node; });
	}

	getParameter(keyId){
		let jack = this.outputJack.cable.toJack;
		let node = jack.nodes.find(node => node.keyId == keyId);
		return jack.plug(node);
	}

	addWaypoint(value, time){
		this.waypoints.push({value: value, time: time});
	}
}

class EnvelopeRelative extends Envelope {
	constructor(id, from, audioContext){
		super(id, Module.ENVELOPE_RELATIVE, from, audioContext);
	}

	trigger(keyId, value){
		let time = 0;
		let last = this.from + value;
		let parameter = this.getParameter(keyId);
		parameter.value = last;
		for (let waypoint of this.waypoints){
			parameter.setValueCurveAtTime([last, waypoint.value + value], this.audioContext + time, waypoint.time);
			time += waypoint.time;
			last = waypoint.value + value;
		}
	}
}

class EnvelopeAbsolute extends Envelope {
	constructor(id, from, audioContext){
		super(id, Module.ENVELOPE_ABSOLUTE, from, audioContext);
	}

	trigger(keyId){
		let time = 0;
		let last = this.from;
		let parameter = this.getParameter(keyId);
		parameter.value = last;
		for (let waypoint of this.waypoints){
			parameter.setValueCurveAtTime([last, waypoint.value], this.audioContext.currentTime + time, waypoint.time);
			time += waypoint.time;
			last = waypoint.value;
		}
	}
}

class Speakers extends SoundModule {
	inputJack = null;

	constructor(id, audioContext){
		super(id, Module.SPEAKERS, false, audioContext);
		this.inputJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.destination; });
	}

	make(){
		this.nodes.push(this.audioContext);
	}
}

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
