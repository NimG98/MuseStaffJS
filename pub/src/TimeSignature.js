class TimeSignature {
    constructor(beatsPerMeasure, beatUnit) {
        if(validateTimeSignature(beatsPerMeasure, beatUnit)){
            this.beatsPerMeasure = beatsPerMeasure;
            this.beatUnit = beatUnit;
        } else {
            throw new Error(`Invalid time signature: ${beatsPerMeasure}/${beatUnit}`);
        }
    }
}

function validateTimeSignature(beatsPerMeasure, beatUnit) {
    /* possibleBeatsPerMeasure = Array.from(new Array(64), (x, i) => i + 1); // [1, 2, 3, 4, 5, ..., 64]
    possibleBeatUnits = [1, 2, 4, 8, 16, 32, 64]; */

    // Using up to max 16 beats and notes for now
    const possibleBeatsPerMeasure = Array.from(new Array(16), (x, i) => i + 1); // [1, 2, 3, 4, 5, ..., 16]
    const possibleBeatUnits = [1, 2, 4, 8, 16];
    
    return possibleBeatsPerMeasure.includes(beatsPerMeasure) && possibleBeatUnits.includes(beatUnit);
}