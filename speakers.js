class Speakers extends SoundModule {
	inputJack = null;

	constructor(id, audioContext){
		super(id, [Module.SPEAKERS], audioContext);
		this.inputJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.destination; });
		this.make();
	}

	make(){
		this.nodes.push(this.audioContext);
	}
}
