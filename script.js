var synth = new Synth();
var keyboard = new Keyboard();
document.onkeydown = function(event){
	if (event.repeat){
		return;
	}
	keyboard.keyDown(event.keyCode);
};

let osc = synth.addOscillatorKey(true);
let filter = synth.addFilter(true);
let gain = synth.addGain(true);

synth.connect(osc.outputJack, filter.inputJack);
synth.connect(filter.outputJack, gain.inputJack);
synth.connect(gain.outputJack, synth.speakers.inputJack);

let env = synth.addEnvelopeAbsolute(0);
env.addWaypoint(0.5, 2);
env.addWaypoint(0.01, 1);
synth.connect(env.outputJack, gain.gainJack);
