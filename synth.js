class Synth extends Control {
	ac = new AudioContext();
	nodes = [];
	nextId = 1;
	wire = null;
	holding = null;

	constructor(){
		super(0, null, "Speakers");
		this.node = this.ac.destination;
		this.nodes.push(this);
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
