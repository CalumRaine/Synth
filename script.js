var synth = new Synth();
var keyboard = new Keyboard();
document.onkeydown = function(event){
	if (event.repeat){
		return;
	}
	keyboard.keyDown(event.keyCode);
};

document.onkeyup = function(event){
	keyboard.keyUp(event.keyCode);
}

function calumFunction(){
	let osc = synth.addOscillatorKey(true);
	osc.Type = "sawtooth";

	let filter = synth.addFilter(true);
	let gain = synth.addGain(true);
	gain.Gain = 0.2;

	synth.connect(osc.outputJack, filter.inputJack);
	synth.connect(filter.outputJack, gain.inputJack);
	synth.connect(gain.outputJack, synth.speakers.inputJack);

	let fEnv = synth.addEnvelopeRelative(-100);
	fEnv.addTriggerWaypoint(0, 0.2);
	fEnv.addTriggerWaypoint(50, 0.2);
	fEnv.addTriggerWaypoint(0, 0.2);
	synth.connect(fEnv.outputJack, osc.frequencyJack);

	let gEnv = synth.addEnvelopeAbsolute(0.2);
	gEnv.addReleaseWaypoint(0, 1);
	synth.connect(gEnv.outputJack, gain.gainJack);

	let lfo = synth.addOscillatorFixed(false);
	lfo.Frequency = 2;
	lfo.Type = "sawtooth";

	let lfoGain = synth.addGain(false);
	lfoGain.Gain = 1000;
	synth.connect(lfo.outputJack, lfoGain.inputJack);

	synth.connect(lfoGain.outputJack, filter.frequencyJack);
}
