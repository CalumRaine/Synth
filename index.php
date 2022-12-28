<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="./style.css"/>
	<script src="./control.js"></script>
	<script src="./connection.js"></script>
	<script src="./filter.js"></script>
	<script src="./gain.js"></script>
	<script src="./synth.js"></script>
	<script src="./oscillator.js"></script>
</head>
<body>
	<button onclick="synth.Output = synth.wire">Speakers</button>
	<button onclick="synth.addOscillator()">Oscillator +</button>
	<button onclick="synth.addGain()">Gain +</button>
	<button onclick="synth.addFilter()">Filter +</button>
	<br/>
	<script>
		var synth = new Synth();
	</script>
</body>
</html>
