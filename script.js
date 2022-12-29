var synth = new Synth();
var keyboard = new Keyboard();

let osc = synth.addOscillatorKey();
	let freqLfo = synth.addOscillatorFixed();
	freqLfo.Frequency = 1;

	let freqLfoGain = synth.addGain();
	freqLfoGain.Gain = 10;
	synth.connect(freqLfo.outputJack, freqLfoGain.inputJack);
	synth.connect(freqLfoGain.outputJack, osc.frequencyJack);

let filter = synth.addFilter();
synth.connect(osc.outputJack, filter.inputJack);

let gain = synth.addGain();
gain.Gain = 0.5;
synth.connect(filter.outputJack, gain.inputJack);
synth.connect(gain.outputJack, synth.speakers.inputJack);
	let gainLfo = synth.addOscillatorFixed();
	gainLfo.Frequency = 2;
	gainLfo.Type = "sawtooth";
	synth.connect(gainLfo.outputJack, gain.gainJack);

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
