class Starclass {
  constructor(){
    this.stars = Array.prototype.slice.call(document.querySelectorAll('.star'))
    this.startingMargin = 0
    this.currentNote = null
  }

  applyClassesToStars(pitchCentsOff, note){
    let direction = this.moveCloserOrFurther(pitchCentsOff, this.startingMargin, this.currentNote, note)
    console.log(direction);
    this.currentNote = note
    this.startingMargin = pitchCentsOff
    console.log(pitchCentsOff);
    this.stars.map(star=>{
      //if it's sharp
      if (Math.abs(pitchCentsOff)<8){
        debugger;
      } else if (Math.abs(pitchCentsOff)===pitchCentsOff){
        star.className = "red"
      //if it's flat:
      } else if (Math.abs(pitchCentsOff)!==pitchCentsOff){
        star.className = "green"
      //tuning logic here, switch statement for value?
      }
    })
  }

  moveCloserOrFurther(pitchCentsOff, startingMargin, currentNote, newNote){
    if (currentNote===newNote && (Math.abs(pitchCentsOff) < Math.abs(startingMargin))){
      return "closer"
    } else {
      return "further"
    }
  }
}
