class PitchCorrelator{
  
  constructor(){
    this.minSamples = 0
    this.qualifiedCorrelation = 0.9
  }

  correlate(buf, sampleRate){
    let size = buf.length
    let maxSamples = Math.floor(size/2)
    let correlations = new Array(maxSamples)
    let bestOffset = -1
    let bestCorrelation = 0
    let rms = 0
    let foundGoodCorrelation = false
    let lastCorrelation = 1

    rms = this.RMSer(buf, rms, size)

    if (this.lowSignal(rms)){
      return -1
    }

    for (let offset=this.minSamples;offset<maxSamples;offset++){
      let correlation = this.runThroughBuffer(maxSamples, offset, buf)
      correlations[offset] = correlation
      if (this.validCorrelation(correlation, lastCorrelation)){
        foundGoodCorrelation = true
        if (correlation > bestCorrelation){
          bestCorrelation = correlation
          bestOffset = offset
        }
      } else if (foundGoodCorrelation){
        // TODO: research this part to make better
        return this.shiftFunc(correlations, bestOffset, sampleRate)
      }
      lastCorrelation = correlation
    }

    return bestCorrelation > 0.01 ? sampleRate/bestOffset : -1
  }

  RMSer(buf, rms, size){
    //determines rms of input
    for (let i = 0;i<size;i++){
      let val = buf[i]
      rms += val*val
    }
    return Math.sqrt(rms/size)
  }

  runThroughBuffer(maxSamples, offset, buf){
    let correlation = 0;
    for (let i=0;i<maxSamples;i++){
      correlation += Math.abs((buf[i])-(buf[i+offset]))
    }
    correlation = 1 - (correlation/maxSamples)
    return correlation
  }

  validCorrelation(correlation, lastCorrelation){
    return ((correlation>this.qualifiedCorrelation)&&(correlation>lastCorrelation)) ?
    true : false
  }

  shiftFunc(correlations, bestOffset, sampleRate){
    let shift = (correlations[bestOffset+1]-correlations[bestOffset-1])/correlations[bestOffset]
    return sampleRate/(bestOffset+(8*shift))
  }

  lowSignal(rms){
    return rms < 0.05 ? true : false
  }

}
