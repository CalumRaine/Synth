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

	trigger(keyId){
		let time = 0;
		let parameter = this.getParameter(keyId);
		let last = this.from + parameter.calumValue;
		parameter.value = last;
		for (let waypoint of this.waypoints){
			parameter.setValueCurveAtTime([last, waypoint.value + parameter.calumValue], this.audioContext.currentTime + time, waypoint.time);
			time += waypoint.time;
			last = waypoint.value + parameter.calumValue;
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
