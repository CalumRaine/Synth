var synth = new Synth();
var keyboard = new Keyboard();

let osc = synth.addOscillatorFixed();
let filter = synth.addFilter();
let gain = synth.addGain();

synth.connect(osc.outputJack, filter.inputJack);
synth.connect(filter.outputJack, gain.inputJack);
synth.connect(gain.outputJack, synth.speakers.inputJack);

document.onkeydown = function(event){
	if (event.repeat){
		return;
	}
	else {
		keyboard.keyDown(event.keyCode);
	}
}

document.onkeyup = function(event){
	keyboard.keyUp(event.keyCode);
}

document.addEventListener("Synth Event", function(event) { keyboard.eventHandler(event); } );
