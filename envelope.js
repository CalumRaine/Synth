class Envelope extends ControlModule {
	from = 0;
	triggerWaypoints = [];
	releaseWaypoints = [];
	outputJack = null;

	constructor(id, moduleTypes, from, audioContext){
		super(id, moduleTypes.concat([Module.ENVELOPE]), audioContext);
		this.from = from;
		this.outputJack = new Jack(id, Jack.OUTPUT, null, function(node) { return node; });
	}

	get ReleaseTime(){
		let sum = 0;
		for (let waypoint of this.releaseWaypoints){
			sum += waypoint.time;
		}
		return sum;
	}

	getParameter(keyId){
		let jack = this.outputJack.cable.toJack;
		let node = jack.nodes.find(node => node.keyId == keyId);
		return jack.plug(node);
	}

	addTriggerWaypoint(value, time){
		this.triggerWaypoints.push({value: value, time: time});
	}

	addReleaseWaypoint(value, time){
		this.releaseWaypoints.push({value: value, time: time});
	}
}

class EnvelopeRelative extends Envelope {
	constructor(id, from, audioContext){
		super(id, [Module.ENVELOPE_RELATIVE], from, audioContext);
	}

	trigger(keyId){
		let time = 0;
		let parameter = this.getParameter(keyId);
		let last = this.from + parameter.calumValue;
		parameter.value = last;
		for (let w in this.triggerWaypoints){
			let waypoint = this.triggerWaypoints[w];
			parameter.setValueCurveAtTime([last, waypoint.value + parameter.calumValue], this.audioContext.currentTime + time + w/1000000, waypoint.time);
			time += waypoint.time;
			last = waypoint.value + parameter.calumValue;
		}
	}

	release(keyId){
		let time = 0;
		let parameter = this.getParameter(keyId);
		let last = parameter.value;
		for (let waypoint of this.releaseWaypoints){
			parameter.setValueCurveAtTime([last, waypoint.value + parameter.calumValue], this.audioContext.currenTime + time, waypoint.time);
			time += waypoint.time;
			last = waypoint.value + parameter.calumValue;
		}
	}
}

class EnvelopeAbsolute extends Envelope {
	constructor(id, from, audioContext){
		super(id, [Module.ENVELOPE_ABSOLUTE], from, audioContext);
	}

	trigger(keyId){
		let time = 0;
		let last = this.from;
		let parameter = this.getParameter(keyId);
		parameter.value = last;
		for (let waypoint of this.triggerWaypoints){
			parameter.setValueCurveAtTime([last, waypoint.value], this.audioContext.currentTime + time, waypoint.time);
			time += waypoint.time;
			last = waypoint.value;
		}
	}

	release(keyId){
		let time = 0;
		let parameter = this.getParameter(keyId);
		let last = parameter.value;
		for (let waypoint of this.releaseWaypoints){
			parameter.setValueCurveAtTime([last, waypoint.value], this.audioContext.currentTime + time, waypoint.time);
			time += waypoint.time;
			last = waypoint.value;
		}
	}
}
