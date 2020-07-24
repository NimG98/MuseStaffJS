import {noteDirection, noteShapeByUnit, noteShapeLineComponent, noteShapeDotComponent} from './constants/noteShapes';


class Note {
    constructor(noteValue, noteUnit, dotted=false) {
        if(!(checkAllowedNote(noteValue, noteUnit))){
            throw new Error("Note is invlaid or is not currently supported.");
        }
        this.noteValue = noteValue;
        this.noteUnit = noteUnit;
        this.dotted = dotted;
        if(this.noteValue === "rest") {
            this.noteType = "rest";
        } else {
            this.noteType = "note";
        }
    }

    createNoteImage() {
        const noteContainer = document.createElement('div');
        noteContainer.setAttribute("class", "museStaffNote")

        const noteImg = document.createElement('img');
        noteImg.setAttribute("class", "museStaffNoteImage")
        noteContainer.appendChild(noteImg);

        // for upward stem notes (without lines), and rest notes
        var noteImgSrc = noteShapeByUnit[this.noteType][this.noteUnit].image;
        
        if(this.noteType === "note") {
            // whole note doesn't have stem, and has preset pictures with the note lines
            if (noteDirection[this.noteValue].line && noteShapeByUnit[this.noteType][this.noteUnit].line) {
                noteImgSrc = noteShapeByUnit[this.noteType][this.noteUnit].line[noteDirection[this.noteValue].line.start];
            // non whole notes
            } else {
                // downward stem notes
                if(noteDirection[this.noteValue].stemDownwards) {
                    // eigth and sixteenth downward stem notes are not transformations of the upward stem
                    if(noteShapeByUnit[this.noteType][this.noteUnit].stemDownwards) {
                        noteImgSrc = noteShapeByUnit[this.noteType][this.noteUnit].stemDownwards;
                    } else {
                        // rotate the note image 180deg to make the stem downwards
                        noteImg.setAttribute("class", noteImg.className + " rotate180"); 
                    }
                }
                // add line to note
                if(noteDirection[this.noteValue].line) {
                    const noteLineImg = getNoteLineImage(this);
                    noteContainer.appendChild(noteLineImg);
                }
            }
        }
        noteImg.setAttribute("src", noteImgSrc);

        // add dot to note/rest
        if(this.dotted) {
            const noteDotImg = getNoteDotImage(this);
            noteContainer.appendChild(noteDotImg);
        }

        return noteContainer;
    }
}

/* Check if note is valid (supported in the allowed set of notes).
    For now, B3-B5, and sixteenth, eighth, quarter, half, and whole notes are supported */
function checkAllowedNote(noteValue, noteUnit) {
    noteType = noteValue === "rest" ? "rest" : "note";

    if(noteType === "note") {
        if(!(noteValue in noteDirection)) {
            return false;
        }
    }
    if(!(noteUnit in noteShapeByUnit[noteType])) {
        return false;
    }
    return true;
}

function getNoteLineImage(note) {
    const noteLineImg = document.createElement('img');

    var angle = "";
    // line image rotated 180deg for downward stem notes
    if(noteDirection[note.noteValue].stemDownwards) {
        angle = " rotate180";
    }
    noteLineImg.setAttribute("class", "museStaffNoteLineImage" + angle);
    const noteLineImgSrc = noteShapeLineComponent[noteDirection[note.noteValue].line.start];
    noteLineImg.setAttribute("src", noteLineImgSrc);

    return noteLineImg;
}

function getNoteDotImage(note) {
    const noteDotImg = document.createElement('img');
    var reflect = "";
    // dot image reflected vertically
    if(noteDirection[note.noteValue].stemDownwards) {
        reflect = " vertReflect";
    }
    noteDotImg.setAttribute("class", "museStaffNoteDotImage" + reflect);
    const noteDotImgSrc = noteShapeDotComponent;
    noteDotImg.setAttribute("src", noteDotImgSrc);
}