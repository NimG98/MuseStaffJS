import {noteDirection, noteShapeByUnit, noteShapeLineComponent, noteShapeDotComponent} from './constants/noteShapes';


class Note {
    constructor(note, noteValue) {
        if(!checkAllowedNote(note, noteValue)){
            throw new Error("Note is invlaid or is not currently supported.");
        }
        this.note = note;
        this.noteValue = noteValue;
        if(this.note === "rest") {
            this.noteType = "rest";
        } else {
            this.noteType = "note";
        }
    }

    /* Check if note is valid (supported in the allowed set of notes).
    For now, B3-B5, and sixteenth, eighth, quarter, half, and whole notes are supported */
    checkAllowedNote(note, noteValue) {
        noteType = note === "rest" ? "rest" : "note";

        if(noteType === "note") {
            if(!(note in noteDirection)) {
                return false;
            }
        }
        if(!(noteValue in noteShapeByUnit[noteType])) {
            return false;
        }
        return true;
    }

    getNoteImage() {
        const noteContainer = document.createElement('div');
        
    }
}