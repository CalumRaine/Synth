<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="./style.css"/>
	<script src="./keyboard.js"></script>
	<script src="./synth.js"></script>
	<script src="./script.js"></script>
</head>
<body>
	<button onclick="keyboard.addKey(49)">GO!</button>
	<br/>
	<br/>

	<button onclick="synth.Output = synth.wire">Speakers</button>
	<button onclick="synth.addOscillator()">Oscillator +</button>
	<button onclick="synth.addGain()">Gain +</button>
	<button onclick="synth.addFilter()">Filter +</button>
	<br/>
	<script>
		//var synth = new Synth();
	</script>
</body>
</html>
