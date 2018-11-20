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
    this.rafId = null
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

    let ac = this.autoCorrelate(this.buf, this.audioctx.sampleRate)
    if (ac === -1){
      console.log("hey");
      // TODO: handle when there's not a good correlation
    } else {
      console.log('woo!');
      // TODO: plug in note strings
      // this is where the pitch display happens
      // this is where the note gets determined with getnotefrompitch()
      // this is where cents off from pitch gets determined
      // this is where the rendering logic from cents off gets determined
      // this is where the connection to the animation is
      console.log(ac);
      let pitch = ac
      let note = this.noteFromPitch(pitch)
    }

    if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	   this.rafID = window.requestAnimationFrame( this.updatePitch.bind(this) );
  }

  noteFromPitch(frequency){
    let noteNum = 12 * (Math.log(frequency/440)/Math.log(2))
    return Math.round(noteNum)+69
  }

  autoCorrelate(buf, sampleRate){
    // TODO: refactor into own class, correlator
    let SIZE = buf.length
    let MAX_SAMPLES = Math.floor(SIZE/2)
    let MIN_SAMPLES = 0;
    let GOOD_ENOUGH_CORRELATION = 0.9;
    let bestOffset = -1;
    let bestCorrelation = 0
    let rms = 0;
    let foundGoodCorrelation = false
    let correlations = new Array(MAX_SAMPLES)

    for (let i = 0;i<SIZE;i++){
      let val = buf[i]
      rms += val*val
    }
    rms = Math.sqrt(rms/SIZE)
    if (rms<0.01){
      // TODO: is this where I should check signal?
      return -1
    }

    let lastCorrelation=1
    for (let offset = MIN_SAMPLES;offset<MAX_SAMPLES;offset++){
      let correlation = 0;
      for (let i = 0; i<MAX_SAMPLES;i++){
        correlation += Math.abs((buf[i])-(buf[i+offset]))
      }
      correlation = 1 - (correlation/MAX_SAMPLES)
      correlations[offset] = correlation
      if ((correlation>GOOD_ENOUGH_CORRELATION)&&(correlation>lastCorrelation)){
        foundGoodCorrelation = true
        if (correlation > bestCorrelation){
          bestCorrelation = correlation
          bestOffset = offset
        }
      } else if (foundGoodCorrelation){
        // TODO: research this part to make better
        let shift = (correlations[bestOffset+1]-correlations[bestOffset-1])/correlations[bestOffset]

        return sampleRate/(bestOffset+(8*shift))
      }
      lastCorrelation = correlation
    }
    if (bestCorrelation > 0.01){
      return sampleRate/bestOffset
    }
    return -1
  }


}

// TODO: start audio meter stuff on line 43
// TODO: create error handler class
