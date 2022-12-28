class Synth extends Control {
	ac = new AudioContext();
	nodes = [];
	nextId = 1;
	wire = null;
	holding = null;
	output = null;

	constructor(){
		super(0, null, "Speakers");
		this.node = this.ac.destination;
	}

	set Output(connection){
		connection.to = this;
		this.output = connection;
		connection.from.nodes.forEach(node => { node.disconnect(); node.connect(this.ac.destination) });
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

	make(frequency){
		console.log("Make", frequency);
		this.nodes.forEach(node => node.make(frequency));
		this.nodes.forEach(node => node.connect());
		this.connect();
	}

	connect(){
		this.output.from.LastNode.connect(this.ac.destination);
	}
}

document.onkeydown = function(event){
	if (event.keyCode == 67){
		return synth.make(261.626);
	}
	else if (event.keyCode == 68){
		return synth.make(293.665);
	}
	else if (event.keyCode == 69){
		return synth.make(329.628);
	}
	else if (event.keyCode == 70){
		return synth.make(349.228);
	}
	else if (event.keyCode == 71){
		return synth.make(391.995);
	}
	else if (event.keyCode == 65){
		return synth.make(440);
	}
	else if (event.keyCode == 66){
		return synth.make(493.883);
	}
}

document.onmousedown = function(event){
	if (event.target.className != "handle"){
		return;
	}
	synth.holding = event;
}

document.onmouseup = function(event){
	if (synth.holding == null){
		return;
	}

	let from = synth.holding;
	let to = event;
	let element = from.target.parentElement;

	let shiftX = to.screenX - from.screenX;
	let shiftY = to.screenY - from.screenY;

	let left = parseFloat(element.style.left.replace("px", ""));
	if (isNaN(left)){
		left = 0;
	}

	let top = parseFloat(element.style.top.replace("px", ""));
	if (isNaN(top)){
		top = 0;
	}

	element.style.left = left + shiftX + "px";
	element.style.top = top + shiftY + "px";

	synth.holding = null;
}
