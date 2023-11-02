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
