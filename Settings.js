class Settings {
  constructor(){
    this.notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    this.userMediaObj = {"audio": {"mandatory": {"googEchoCancellation": "false","googAutoGainControl": "false","googNoiseSuppression": "false","googHighpassFilter": "false"},"optional": []},}
    this.buflength = 1024
    this.fftSize = 2048
  }
}
