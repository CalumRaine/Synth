# Synth

A browser-based synth using the Web Audio API and HTML.

![synth screenshot](./images/screenshot7.png)

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
* LFOs can be synced for improved polyphony
* Import and export patches as JSON files

## How To Run

Just download the repository and open `index.html` in a browser window.

## To Do

* Use compressor to prevent polyphonic sounds overloading speakers
* Amp LFO: prevent negative volume
* Scroll on parameter to slide it left/right
* Fix QWERTY mapping on black keys
* Use velocity from MIDI messages on key press
* Try exponential ramps instead of linear ramps
* Add preset patches
* Consider collapsible sections, i.e. modules or components
* Add wood skins and metal skins etc.
* Add recording/editing functionality
* Add cool controllers (instead of just a keyboard)
    * Use the trackpad like a theremin?
    * Edit incoming audio files

