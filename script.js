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

	let gain = synth.addGain(true);
	gain.Gain = 0.2;

	synth.connect(osc.outputJack, gain.inputJack);
	synth.connect(gain.outputJack, synth.speakers.inputJack);

	let gEnv = synth.addEnvelopeAbsolute(0.2);
	gEnv.addReleaseWaypoint(0, 3);
	synth.connect(gEnv.outputJack, gain.gainJack);
}
