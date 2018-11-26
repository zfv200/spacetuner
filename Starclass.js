class Starclass {
  constructor(){
    this.stars = Array.prototype.slice.call(document.querySelectorAll('.star'))
    this.startingMargin = 50
    this.currentNote = null
  }

  applyClassesToStars(pitchCentsOff, note){
    let direction = this.moveCloserOrFurther(pitchCentsOff, this.startingMargin, this.currentNote, note)
    console.log(direction);
    this.currentNote = note
    this.startingMargin = pitchCentsOff
    console.log(pitchCentsOff);
    this.stars.map(star=>{
      star.className = direction
    })
  }

  moveCloserOrFurther(pitchCentsOff, startingMargin, currentNote, newNote){
    if (Math.abs(pitchCentsOff)>startingMargin){
      return "closer"
    }
    if (Math.abs(pitchCentsOff)<8){
      return "inTune"
    }
    if (currentNote===newNote && (Math.abs(pitchCentsOff) < Math.abs(startingMargin))){
      return "closer"
    } else {
      debugger;
      return "further"
    }
  }
}
