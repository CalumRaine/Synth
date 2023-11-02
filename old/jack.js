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
