# Synth

A browser-based synth using the Web Audio API and HTML.

Very early stages of development.  Known bugs.  Need to get a working prototype quickly, will fix later.

![synth screenshot](./images/screenshot.png)

## Features

* Polyphonic
* On-screen keyboard
    * Play by clicking mouse
    * Play by pressing corresponding qwerty keys
    * Drag "handle" to remap qwerty keys around keyboard
* MIDI Keyboard
    * Tested with M-Audio Keystation Mini 32
    * Volume knob will modify whichever parameter has focus
* Audio immediately responds to parameter changes
* Oscillators
    * Various wave forms
    * Shift and detune parameters
* Filters
    * Various pass/band types
    * Cutoff frequency parameter
* Amplifier
    * Gain parameter
    * ADSR envelope 

## To Do

* Add button to generate a new patch
* Add button to duplicate the current patch
* Make parameters logarithmic
* Use "detune cents" property of oscillator for shift/detune
* Add filter ADSR
* Add frequency glide
* Add LFO to frequency, filter and amp
* Add option to sync LFOs
* Map volume knob to cycle through dropdown select elements too
* Use velocity from MIDI messages on key press
* Figure out how to stop polyphonic sounds from overloading the speakers
* Add option to export/import patches as JSON
* Add stereo sound
* Automatically redraw keyboard when window is resized
* Add wood skins and metal skins etc.
* Add recording/editing functionality
* Add cool controllers (instead of just a keyboard)
    * Use the trackpad like a theremin?
    * Edit incoming audio files

