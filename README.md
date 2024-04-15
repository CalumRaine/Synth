# Synth

A browser-based synth using the Web Audio API and HTML.

![synth screenshot](./images/screenshot9.png)

## Features

* Polyphonic
* On-screen keyboard
    * Play by clicking mouse
    * Play by pressing corresponding qwerty keys
    * Drag "handle" to remap qwerty keys around keyboard
* MIDI Keyboard
    * Tested with M-Audio Keystation Mini 32
    * Volume knob will modify whichever parameter has focus
* Oscillators
    * Various wave forms
    * Shift and detune parameters
* Filters
    * Various pass/band types
    * Cutoff frequency parameter
* Amplifier
    * Gain parameter
    * ADSR envelope
* Stereo panning
    * With LFO and envelope
* Parameters
    * Immediately update audio when changed
    * Have linear or exponential mappings for enhanced control, e.g. pitch shift (linear) or frequency cutoff (exp)
    * Can be continuous or discrete, e.g. detune (continuous) or pitch shift (discrete notes)
    * Right click to reset back to initial value
* LFOs
    * Can be synced for improved polyphony
    * Can use standard wave shapes or a random generator
* Import and export patches as JSON files

## How To Run

Just download the repository and open `index.html` in a browser window.

## To Do

* Amp LFO: prevent negative volume
    * Change "depth" parameter to percentage of Math.min(value, 1-value)
    * Will keep within bounds of 0 to 1
* Amp LFO bug: Overrides volume during release phase so doesn't fade out properly
    * Connect constantSource() to another gain output 
    * Linear ramp gain to 0 across release time when key released
    * Will need to slightly rewrite master/sync because every key press will need its own gain/env now
    * Also allows for LFO Delay feature, i.e. LFO attack
        * I think use exponential ramp for this, not linear
* Add "hold" button to sustain keys
* Use velocity from MIDI messages on key press
* Try exponential ramps instead of linear ramps
* Add preset patches
* Consider collapsible sections, i.e. modules or components
* Add wood skins and metal skins etc.
* Add recording/editing functionality
* Add cool controllers (instead of just a keyboard)
    * Use the trackpad like a theremin?
    * Edit incoming audio files

