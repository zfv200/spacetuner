class Tuner {

  constructor(domAdapter){
    this.domAdapter = domAdapter
    this.audioctx = new AudioContext()
    this.settings = new Settings()
    this.mediaStreamSource = null
    this.analyser = this.audioctx.createAnalyser()
    this.analyser.fftSize = this.settings.fftSize
    this.buf = new Float32Array(this.settings.buflength)
    this.rafId = null
    this.correlator = new PitchCorrelator(this.buf)
  }

  getUserMedia(settings, callback){
    try {
      navigator.getUserMedia =
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
    this.getUserMedia(this.settings.userMediaObj, this.streamAcquired.bind(this));
  }

  streamAcquired(stream){
    this.mediaStreamSource = this.audioctx.createMediaStreamSource(stream)
    this.mediaStreamSource.connect(this.analyser)
    this.updatePitch()
  }

  updatePitch(){
    this.analyser.getFloatTimeDomainData(this.buf)
    let ac = this.correlator.correlate(this.buf, this.audioctx.sampleRate)
    if (ac === -1){
      //probably don't do anything?
    } else {
      let note = this.noteFromPitch(ac)
      this.domAdapter.test.innerHTML = this.settings.notes[note%12]
      this.domAdapter.stars1.animation = `animStar ${note}s linear infinite`
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
