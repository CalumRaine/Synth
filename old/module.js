class Module {
	audioContext = null;
	moduleId = 0;
	moduleTypes = 0;
	static CONTROL_MODULE = 1;
	static SOUND_MODULE = 2;
	static POLYPHONIC = 4;
	static OSCILLATOR = 8;
	static OSCILLATOR_KEY = 16;
	static OSCILLATOR_FIXED = 32;
	static FILTER = 64;
	static GAIN = 128;
	static SPEAKERS = 256;
	static ENVELOPE = 512;
	static ENVELOPE_RELATIVE = 1024;
	static ENVELOPE_ABSOLUTE = 2048;

	constructor(id, moduleTypes, audioContext){
		this.moduleId = id;
		this.audioContext = audioContext;
		moduleTypes.forEach(type => this.moduleTypes |= type);
	}

	hasType(type){
		return (this.moduleTypes & type) != 0;
	}
}

class ControlModule extends Module {
	constructor(id, moduleTypes, audioContext){
		super(id, moduleTypes.concat([Module.CONTROL_MODULE]), audioContext);
	}
}

class SoundModule extends Module {
	nodes = [];

	constructor(id, moduleTypes, audioContext){
		super(id, moduleTypes.concat([Module.SOUND_MODULE]), audioContext);
	}

	make(node, keyId){
		node.moduleId = this.moduleId;
		node.keyId = keyId;
		this.nodes.push(node);
		return node;
	}

	remove(keyId){
		let index = this.nodes.findIndex(node => node.keyId == keyId);
		this.nodes[index].disconnect();
		this.nodes.splice(index, 1);
	}
}
