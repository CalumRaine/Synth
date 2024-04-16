# Synth

A browser-based synth using the Web Audio API and HTML.

![synth screenshot](./images/screenshot10.png)

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

* Add "hold" button to sustain keys
* Look for memory leak in stopSound()
* Optimise compressor parameters
* Use velocity from MIDI messages on key press
* Add preset patches
* Consider collapsible sections, i.e. modules or components
* Add wood skins and metal skins etc.
* Add recording/editing functionality
* Improve naming of inputs to assist screen readers
* Add cool controllers (instead of just a keyboard)
    * Use the trackpad like a theremin?
    * Edit incoming audio files

