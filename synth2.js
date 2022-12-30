class Keyboard {
	offset = 60;		// middle c
	keys = [];
	frequencies = [ 8.18,
			8.66,
			9.18,
			9.72,
			10.30,
			10.91,
			11.56,
			12.25,
			12.98,
			13.75,
			14.57,
			15.43,
			16.35,
			17.32,
			18.35,
			19.45,
			20.60,
			21.83,
			23.12,
			24.50,
			25.96,
			27.50,
			29.14,
			30.87,
			32.70,
			34.65,
			36.71,
			38.89,
			41.20,
			43.65,
			46.25,
			49.00,
			51.91,
			55.00,
			58.27,
			61.74,
			65.41,
			69.30,
			73.42,
			77.78,
			82.41,
			87.31,
			92.50,
			98.00,
			103.83,
			110.00,
			116.54,
			123.47,
			130.81,
			138.59,
			146.83,
			155.56,
			164.81,
			174.61,
			185.00,
			196.00,
			207.65,
			220.00,
			233.08,
			246.94,
			261.63,
			277.18,
			293.66,
			311.13,
			329.63,
			349.23,
			369.99,
			392.00,
			415.30,
			440.00,
			466.16,
			493.88,
			523.25,
			554.37,
			523.25,
			554.37,
			587.33,
			622.25,
			659.26,
			698.46,
			739.99,
			783.99,
			830.61,
			880.00,
			932.33,
			987.77,
			1046.50,
			1108.73,
			1174.66,
			1244.51,
			1318.51,
			1396.91,
			1479.98,
			1567.98,
			1661.22,
			1760.00,
			1864.66,
			1975.53,
			2093.00,
			2217.46,
			2349.32,
			2489.02,
			2637.02,
			2793.83,
			2959.96,
			3135.96,
			3322.44,
			3520.00,
			3729.31,
			3951.07,
			4186.01,
			4434.92,
			4698.64,
			4978.03,
			5274.04,
			5587.65,
			5919.91,
			6271.93,
			6644.88,
			7040.00,
			7458.62,
			7902.13,
			8372.02,
			8869.84,
			9397.27,
			9956.06,
			10548.08,
			11175.30,
			11839.82,
			12543.85,
			13289.75 ];

	keyDown(keyCode){
		let frequency = this.keyCodeToFrequency(keyCode);
		if (this.keys.some(key => key.frequency == frequency)){
			return;
		}
		this.keys.push(new Key(frequency));
	}

	keyUp(keyCode){
		let frequency = this.keyCodeToFrequency(keyCode);
		let index = this.keys.findIndex(key => key.frequency == frequency);
		this.keys[index].remove();
		this.keys.splice(index, 1);
	}

	keyCodeToFrequency(keyCode){
		return this.frequencies[this.offset + keyCode - 49];
	}

	eventHandler(event){
		this.keys.forEach(key => key.nodes.filter(node => node.moduleId == event.moduleId).forEach(node => event.func(event.value, node)));
	}
}

class Key {
	frequency = 440;
	nodes = [];

	constructor(frequency){
		this.frequency = frequency;
		this.nodes = synth.modules.map(module => module.make(synth.ac, frequency));
		synth.cables.forEach(cable => cable.connect(this.nodes));
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

	constructor(moduleId, direction, plug){
		this.moduleId = moduleId;
		this.direction = direction;
		this.plug = plug;
	}
}

class Cable {
	fromJack = null;
	toJack = null;

	constructor(fromJack, toJack){
		this.fromJack = fromJack;
		this.toJack = toJack;
	}

	fromNode(nodes){
		return nodes.find(node => node.moduleId == this.fromJack.moduleId);
	}

	toNode(nodes){
		return nodes.find(node => node.moduleId == this.toJack.moduleId);
	}

	connect(nodes){
		this.fromJack.plug(this.fromNode(nodes)).connect(this.toJack.plug(this.toNode(nodes)));
	}

	disconnect(nodes){
		this.fromNode(nodes).disconnect();
	}
}

class Module {
	id = 0;
	moduleType = 0;
	static OSCILLATOR = 0;
	static OSCILLATOR_KEY = 1;
	static OSCILLATOR_FIXED = 2;
	static FILTER = 3;
	static GAIN = 4;
	static SPEAKERS = 5;

	constructor(id, type){
		this.id = id;
		this.moduleType = type;
	}

	make(node){
		node.moduleId = this.id;
		return node;
	}

	triggerEvent(value, func){
		let e = new CustomEvent("Synth Event", { detail: { func: func, value: value, moduleId: this.id } } );
		document.dispatchEvent(e);
	}
}

class InputModule extends Module {
	inputJack = null;

	constructor(id, type){
		super(id, type);
		this.inputJack = new Jack(id, function(node) { return node; });
	}
}

class OutputModule extends Module {
	outputJack = null;

	constructor(id, type){
		super(id, type);
		this.outputJack = new Jack(id, Jack.OUTPUT, function(node) { return node; });
	}
}

class IOModule extends Module {
	inputJack = null;
	outputJack = null;

	constructor(id, type){
		super(id, type);
		this.inputJack = new Jack(id, Jack.INPUT, function(node) { return node; });
		this.outputJack = new Jack(id, Jack.OUTPUT, function(node) { return node; });
	}
}

class Oscillator extends OutputModule {
	type = "sine";
	types = ["sine", "square", "sawtooth", "triangle"];
	frequencyJack = null;

	constructor(id, moduleType){
		super(id, moduleType);
		this.frequencyJack = new Jack(id, Jack.INPUT, function(node) { return node.frequency; });
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		super.triggerEvent(value, function(node, value){ node.type = value; } );
	}

	make(node){
		node.type = this.type;
		node.start();
		return super.make(node);
	}
}

class OscillatorKey extends Oscillator {
	constructor(id){
		super(id, Module.OSCILLATOR_KEY);
	}

	make(audioContext, frequency){
		let node = new OscillatorNode(audioContext);
		node.frequency.value = frequency;
		return super.make(node);
	}
}

class OscillatorFixed extends Oscillator {
	frequency = 440;

	constructor(id){
		super(id, Module.OSCILLATOR_FIXED);
	}

	set Frequency(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.frequency = value;
		this.triggerEvent(value, function(node, value){ node.frequency.value = value; });
	}

	make(audioContext){
		let node = new OscillatorNode(audioContext);
		node.frequency.value = this.frequency;
		return super.make(node);
	}
}

class Filter extends IOModule {
	type = "lowpass";
	types = ["lowpass", "highpass", "lowshelf", "highshelf", "bandpass", "peaking", "notch", "allpass"];
	frequency = 1000;
	frequencyJack = null;
	qFactor = 1;
	qFactorJack = null;

	constructor(id){
		super(id, Module.FILTER);
		this.frequencyJack = new Jack(id, Jack.INPUT, function(node) { return node.frequency; });
		this.qFactorJack = new Jack(id, Jack.INPUT, function(node) { return node.Q; });
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		this.triggerEvent(value, function(node, value){ node.type = value; });
	}

	set Frequency(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.frequency = value;
		this.triggerEvent(value, function(node, value){ node.frequency.value = value; });
	}

	set QFactor(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.qFactor = value;
		this.triggerEvent(value, function(node, value){ node.Q.value = value; });
	}

	make(audioContext){
		let node = new BiquadFilterNode(audioContext);
		node.type = this.type;
		node.frequency.value = this.frequency;
		node.Q.value = this.qFactor;
		return super.make(node);
	}
}

class Gain extends IOModule {
	gain = 1;
	gainJack = null;

	constructor(id){
		super(id, Module.GAIN);
		this.gainJack = new Jack(id, Jack.INPUT, function(node) { return node.gain; });
	}

	set Gain(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.gain = value;
		this.triggerEvent(value, function(node, value){ node.gain.value = value; });
	}

	make(audioContext){
		let node = new GainNode(audioContext);
		node.gain.value = this.gain;
		return super.make(node);
	}
}

class Speakers {
	moduleId = 0;
	moduleType = Module.SPEAKERS;
	destination = null;
	inputJack = null;

	constructor(id, destination){
		this.moduleId = id;
		this.destination = destination;
		this.inputJack = new Jack(id, Jack.INPUT, function(node) { return node.destination; });
	}

	make(){
		return this;
	}
}

class Synth {
	modules = [];
	cables = [];
	nextId = 0;
	ac = new AudioContext();
	speakers = null;

	constructor(){
		this.speakers = new Speakers(this.NextId, this.ac.destination);
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

	addOscillatorKey(){
		let module = new OscillatorKey(this.NextId);
		this.modules.push(module);
		return module;
	}
	
	addOscillatorFixed(){
		let module = new OscillatorFixed(this.NextId);
		this.modules.push(module);
		return module;
	}
	
	addFilter(){
		let module = new Filter(this.NextId);
		this.modules.push(module);
		return module;
	}
	
	addGain(){
		let module = new Gain(this.NextId);
		this.modules.push(module);
		return module;
	}
}
