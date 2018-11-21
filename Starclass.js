class Starclass {
  constructor(){
    this.stars = Array.prototype.slice.call(document.querySelectorAll('.star'))
  }

  applyClassesToStars(pitchCentsOff){
    console.log(pitchCentsOff);
    this.stars.map(star=>{
      //tuning logic here, switch statement for value?
    })
  }
}
