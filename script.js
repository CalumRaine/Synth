var synth = new Synth();
var keyboard = new Keyboard();
document.onkeydown = function(event){
	if (event.repeat){
		return;
	}
	keyboard.keyDown(event.keyCode);
};

let osc = synth.addOscillatorKey(true);
osc.Type = "sawtooth";

let filter = synth.addFilter(true);
let gain = synth.addGain(true);
gain.Gain = 0.2;

synth.connect(osc.outputJack, filter.inputJack);
synth.connect(filter.outputJack, gain.inputJack);
synth.connect(gain.outputJack, synth.speakers.inputJack);

let env = synth.addEnvelopeRelative(-100);
env.addWaypoint(0, 0.2);
env.addWaypoint(50, 0.2);
env.addWaypoint(0, 0.2);
synth.connect(env.outputJack, osc.frequencyJack);
