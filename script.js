var synth = new Synth();
var keyboard = new Keyboard();

let osc = synth.addOscillatorKey();
let filter = synth.addFilter();
synth.connect(osc.outputJack, filter.inputJack);

let gain = synth.addGain();
gain.Gain = 0.5;
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
