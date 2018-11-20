class Tuner {

  constructor(){
    this.audioctx = new AudioContext()
    this.mediaStreamSource = null
    this.analyser = this.audioctx.createAnalyser()
    // TODO: research this
    this.analyser.fftSize = 2048;
    this.processor = this.audioctx.createScriptProcessor(2048, 1, 1)
    this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    this.buflength = 1024
    this.buf = new Float32Array(this.buflength)
    // TODO: research this
    this.rafId = null
    this.correlator = new PitchCorrelator(this.buf)
  }

  getUserMedia(settings, callback){
    try {
      navigator.getUserMedia =
      //dif browsers
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      navigator.getUserMedia(settings, callback, this.error)
    } catch (e) {
      alert('app not supported by browser')
    }
  }

  error(){
    alert('fail')
  }

  turnOnMicrophone(){
    this.getUserMedia(
      {
        "audio": {
            "mandatory": {
              "googEchoCancellation": "false",
              "googAutoGainControl": "false",
              "googNoiseSuppression": "false",
              "googHighpassFilter": "false"
          },
            "optional": []
        },
      }, this.streamAcquired.bind(this));
  }

  streamAcquired(stream){
    this.mediaStreamSource = this.audioctx.createMediaStreamSource(stream)
    // TODO: //plug in audio meter here
    this.mediaStreamSource.connect(this.analyser)

    this.updatePitch()
  }

  updatePitch(){
    let cycles = new Array
    // TODO: research where buf and samplerate come from
    this.analyser.getFloatTimeDomainData(this.buf)
    //pick up after autocorrelate is defined, it gets called here
    let ac = this.correlator.correlate(this.buf, this.audioctx.sampleRate)
    if (ac === -1){
      // TODO: handle when there's not a good correlation
    } else {
      // TODO: plug in note strings
      // this is where the pitch display happens
      // this is where the note gets determined with getnotefrompitch()
      // this is where cents off from pitch gets determined
      // this is where the rendering logic from cents off gets determined
      // this is where the connection to the animation is
      let pitch = ac
      let note = this.noteFromPitch(pitch)
      console.log(this.noteStrings[note%12]);
    }

    if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	   this.rafID = window.requestAnimationFrame( this.updatePitch.bind(this) );
  }

  noteFromPitch(frequency){
    let noteNum = 12 * (Math.log(frequency/440)/Math.log(2))
    return Math.round(noteNum)+69
  }


}

// TODO: start audio meter stuff on line 43
// TODO: create error handler class
