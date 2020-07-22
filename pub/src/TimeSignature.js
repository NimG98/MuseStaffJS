class TimeSignature {
    constructor(beatsPerMeasure, beatUnitValue) {
        if(this.validateTimeSignature(beatsPerMeasure, beatUnitValue)){
            this.beatsPerMeasure = beatsPerMeasure;
            this.beatUnitValue = beatUnitValue;
        } else {
            throw new Error("Invalid time signature");
        }
    }
}

TimeSignature.prototype.validateTimeSignature = (beatsPerMeasure, beatUnitValue) => {
    /* possibleBeatsPerMeasure = Array.from(new Array(64), (x, i) => i + 1); // [1, 2, 3, 4, 5, ..., 64]
    possibleBeatUnitValues = [1, 2, 4, 8, 16, 32, 64]; */

    // Using up to max 16 beats and notes for now
    const possibleBeatsPerMeasure = Array.from(new Array(16), (x, i) => i + 1); // [1, 2, 3, 4, 5, ..., 16]
    const possibleBeatUnitValues = [1, 2, 4, 8, 16];
    
    return possibleBeatsPerMeasure.includes(beatsPerMeasure) && possibleBeatUnitValues.includes(beatUnitValue);
}