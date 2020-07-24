import {noteDirection, noteShapeByUnitValue, noteShapeLineComponent, noteShapeDotComponent} from './constants/noteShapes';


class Note {
    constructor(note, noteValue, dotted=false) {
        if(!(checkAllowedNote(note, noteValue))){
            throw new Error("Note is invlaid or is not currently supported.");
        }
        this.note = note;
        this.noteValue = noteValue;
        this.dotted = dotted;
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
        if(!(noteValue in noteShapeByUnitValue[noteType])) {
            return false;
        }
        return true;
    }

    getNoteImage() {
        const noteContainer = document.createElement('div');
        noteContainer.setAttribute("class", "museStaffNote")
        const noteImg = document.createElement('img');
        noteImg.setAttribute("class", "museStaffNoteImage")
        
        if(this.noteType === "note") {
            var noteImgSrc = noteShapeByUnitValue[this.noteType][this.noteValue].image;
            // whole note doesn't have stem, and has preset pictures with the note lines
            if (noteDirection[this.note].line && noteShapeByUnitValue[this.noteType][this.noteValue].line) {
                noteImgSrc = noteShapeByUnitValue[this.noteType][this.noteValue].line[noteDirection[this.note].line.start];
            // downward stem notes
            } else if(noteDirection[this.note].stemDownwards) {
                // eigth and sixteenth downward stem notes are not transformations of the upward stem
                if(noteShapeByUnitValue[this.noteType][this.noteValue].stemDownwards) {
                    noteImgSrc = noteShapeByUnitValue[this.noteType][this.noteValue].stemDownwards;
                } else {
                    // rotate the note image 180deg to make the stem downwards
                    noteImg.setAttribute("class", noteImg.className + " rotate180"); 
                    // add line to note
                    if(noteDirection[this.note].line) {

                    }
                }
            // upward stem notes
            } else {

            }
        // rest notes
        } else {

        }

        noteImg.setAttribute("src", noteImgSrc);
    }
}