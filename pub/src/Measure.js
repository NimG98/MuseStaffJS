/* JS Library */
"use strict";

class Measure {
    constructor() {
        this.notes = [];
        this.clef = "treble";
        this.timeSig = new TimeSignature(5, 16);
        this.measure = null;
        this.lyrics = [];
        this.editable = false;
        // this.playable = false;
        this.pointer = {
            visible: false,
            position: null
        }
        createMeasure(this);
    }

    setNotes(notes) {
        //check if sum of notes note values equivalent or less than columns in measure
        // if less than measure, fill remaining with Rests


        // assign notes to this.notes
        this.notes = notes;
    }

    setClefType(clefType) {
        this.clef = clefType;
    }

    setTimeSig(beatsPerMeasure, beatUnit) {
        try {
            this.timeSig = TimeSignature(beatsPerMeasure, beatUnit);
        } catch {
            alert("Please input a correct time signature.")
        }
    }

    setLyrics(lyrics) {
        this.lyrics = lyrics;
    }

    setPointerVisible(boolean) {
        this.pointer.visible = boolean;
        if(!boolean) {
            //this.removePointer();
            this.pointer.position = null;
        }
    }

    setMeasureEditable(boolean) {
        this.editable = boolean;
        this.setPointerVisible(boolean);
    }

    // remove pointer and highlight from old note that was pointed on
    removePointer() {
        // remove highlight from old note
        const oldPointerPosition = this.pointer.position;
        const oldNotePointedOn = this.notes[oldPointerPosition];

        var oldNotePointedOnRowIndex;
        if(oldNotePointedOn.noteType === "note") {
            oldNotePointedOnRowIndex = Object.keys(noteDirection).reverse().indexOf(oldNotePointedOn.noteValue);
        }
        // for Rest notes, place in middle line of staff measure (8th row)
        else {
            oldNotePointedOnRowIndex = 7;
        }
        const oldNotePointedOnContainer = getNonHiddenTds(this.measure.rows[oldNotePointedOnRowIndex].cells)[oldPointerPosition].querySelector('.highlighted');
        oldNotePointedOnContainer.setAttribute('class', "museStaffNote");

        // remove pointer from old td column location
        const oldPointerColumnLocation = getNonHiddenTds(this.measure.querySelector('.museMeasurePointerContainer').cells)[oldPointerPosition]
        oldPointerColumnLocation.removeChild(oldPointerColumnLocation.firstChild);
    }

    setPointerPosition(noteNumberIndex) {
        // remove pointer and highlight from old note that was pointed on
        if(Number.isInteger(this.pointer.position) && noteNumberIndex !== this.pointer.position) {
            this.removePointer();
        }
        if(noteNumberIndex === this.pointer.position) {
            return;
        }
        // Set new pointer position
        this.pointer.position = noteNumberIndex;
        const note = this.notes[this.pointer.position];
        if(note) {
            var notePointedOnRowIndex;
            if(note.noteType === "note") {
                notePointedOnRowIndex = Object.keys(noteDirection).reverse().indexOf(note.noteValue);
            }
            // for Rest notes, place in middle line of staff measure (8th row)
            else {
                notePointedOnRowIndex = 7;
            }
            const noteContainer = getNonHiddenTds(this.measure.rows[notePointedOnRowIndex].cells)[this.pointer.position].querySelector('.museStaffNote');
            noteContainer.setAttribute('class', noteContainer.className + " highlighted");
        }

        // Create new pointer and add to new td location
        const pointerImg = document.createElement('img');
        pointerImg.setAttribute('class', "museMeasurePointerImage");
        pointerImg.setAttribute('src', "src/static/pointer.png");
        getNonHiddenTds(this.measure.querySelector('.museMeasurePointerContainer').cells)[this.pointer.position].appendChild(pointerImg);
    }

    addNoteAtCurrentPosition(note, noteImage) {
        const columnsToTakeUp = getNoteColumnsToTakeUp(note);
        var noteRowIndex;
        if(note.noteType === "note") {
            noteRowIndex = Object.keys(noteDirection).reverse().indexOf(note.noteValue);
        }
        // for Rest notes, place in middle line of staff measure (8th row)
        else {
            noteRowIndex = 7;
        }

        var noteImage = noteImage || note.createNoteImage();
        if(!noteImage.className.includes("highlighted")){
            noteImage.setAttribute('class', noteImage.className + " highlighted");
        }

        if(this.notes[this.pointer.position]) {

            Object.values(this.measure.rows).map( (tr, index) => {
                const tdPointedOn = getNonHiddenTds(this.measure.rows[index].cells)[this.pointer.position];
                if(tdPointedOn.hasChildNodes() && !tdPointedOn.parentNode.className.includes("museMeasurePointerContainer")) {
                    tdPointedOn.removeChild(tdPointedOn.firstChild);

                }
                if(index === noteRowIndex) {
                    tdPointedOn.appendChild(noteImage);
                }
                this.notes[this.pointer.position] = note;


                // Supporting multiple notes in same location on top of each other - PENDING
                /* if(index === noteRowIndex) {
                    if(tdPointedOn.hasChildNodes()) {
                        tdPointedOn.removeChild(tdPointedOn.firstChild);
                    }
                    tdPointedOn.appendChild(noteImage);

                } else {
                    // multiple notes in same location
                    if(tdPointedOn.hasChildNodes()) {
                        this.notes[this.pointer.position]
                        tdPointedOn.firstChild;
                    }
                } */
                const newNotes = pushNoteForward(tdPointedOn, 0, columnsToTakeUp, this.notes, this.pointer.position);
                // If last row, don't need reference to old this.notes. Can replace this.notes to newNotes
                // newNotes also affected by if 
                if(index === Object.values(this.measure.rows).length-1) {
                    this.notes = newNotes;
                }
            })
        
        // Only occurs during creation of measure, since no default Rest notes yet
        } else {
            if(!this.pointer.position) {
                this.pointer.position = 0;
            }
            // Put image in td, make other tds hidden if part of the same note
            Object.values(this.measure.rows).map( (tr, index) => {
                const tdPointedOn = getNonHiddenTds(this.measure.rows[index].cells)[this.pointer.position];
                if(index === noteRowIndex) {
                    tdPointedOn.appendChild(noteImage);
                }
                var currentTd = tdPointedOn;
                for(var i = 0; i < columnsToTakeUp-1; i++) {
                    var nextSibling = currentTd.nextSibling
                    nextSibling.setAttribute('class', nextSibling.className + " tdHidden");
                    currentTd = nextSibling;
                }

            })
            this.notes.splice(this.pointer.position, 0, note);
        }
        
    }
}

function pushNoteForward(noteTd, numColumnsToPush, columnsToTakeUp, notes, position) {
    var currentTd = noteTd;
    var notePosition = position;
    var noteImage = null;
    // Need copy of notes, since if rests are being taken over and deleted from the notes list,
    // when you get to the next row, you still need to see if newNotes[notePosition].noteType === "rest".
    // So, don't modify this.notes, only modify newNotes. Then when all rows are done, then change this.notes to newNotes.
    var newNotes = [...notes];
    if(currentTd.hasChildNodes() && numColumnsToPush !== 0) {
        noteImage = currentTd.removeChild(currentTd.firstChild);
        currentTd.setAttribute('class', currentTd.className + " tdHidden");
    }
    if(numColumnsToPush === 0) {
        numColumnsToPush = columnsToTakeUp;
    }

    for(var i = 0; i < numColumnsToPush-1; i++) {
        var nextSibling = currentTd.nextSibling
        if(!nextSibling.className.includes("tdHidden")){
            notePosition += 1;
            // if note is a rest, just overwrite it (delete the rest)
            if(newNotes[notePosition].noteType === "rest"){
                // Remove rest note image if on note row with rest image
                if(nextSibling.hasChildNodes()) {
                    nextSibling.removeChild(nextSibling.firstChild);
                }
                // Make td hidden, since it's taken over
                nextSibling.setAttribute('class', nextSibling.className + " tdHidden");

                newNotes.splice(notePosition, 1)
                // Set notePosition back, since this will no longer be a note
                notePosition -= 1;
            } else {
                var newNoteColumnsToTakeUp = getNoteColumnsToTakeUp(newNotes[notePosition]);
                pushNoteForward(nextSibling, numColumnsToPush-i-1, newNoteColumnsToTakeUp, newNotes, notePosition);
            }
        }
        currentTd = nextSibling;
    }
    if(noteImage) {
        currentTd.appendChild(noteImage)
    }
    for(var i = 0; i < columnsToTakeUp-1; i++) {
        var nextSibling = currentTd.nextSibling
        // weird
        if(!nextSibling) {
            break;
        }
        if(!nextSibling.className.includes("tdHidden")){
            notePosition += 1;
            var newNoteColumnsToTakeUp = getNoteColumnsToTakeUp(newNotes[notePosition]);
            pushNoteForward(nextSibling, 0, newNoteColumnsToTakeUp, newNotes, notePosition);
        }
        currentTd = nextSibling;
    }

    currentTd = noteTd;
    var hiddenCount = 0;
    var nextSibling = null;
    var notePosition = position;
    while(currentTd.nextSibling && currentTd.nextSibling.className.includes("tdHidden")) {
        var nextSibling = currentTd.nextSibling;
        hiddenCount +=1;
        currentTd = nextSibling;
    }
    if(hiddenCount >= columnsToTakeUp){
        notePosition += 1;
        pushNoteBackward(currentTd.nextSibling, hiddenCount-(columnsToTakeUp-1), getNoteColumnsToTakeUp(newNotes[notePosition]), newNotes, notePosition);
    }

    return newNotes
}

function pushNoteBackward(noteTd, numColumnsToPush, columnsToTakeUp, notes, position) {
    var currentTd = noteTd;
    var notePosition = position;
    var noteImage = null;

    // weird
    if(!currentTd) {
        return;
    }

    if(currentTd.hasChildNodes() && numColumnsToPush !== 0) {
        noteImage = currentTd.removeChild(currentTd.firstChild);
        currentTd.setAttribute('class', currentTd.className + " tdHidden");
    }

    for(var i = 0; i < numColumnsToPush; i++) {
        var previousSibling = currentTd.previousSibling;
        currentTd = previousSibling;
    }
    if(noteImage) {
        currentTd.appendChild(noteImage);
    }

    var hiddenCount = 0;
    var nextSibling = null;
    var notePosition = position;
    while(currentTd.nextSibling && currentTd.nextSibling.className.includes("tdHidden")) {
        var nextSibling = currentTd.nextSibling;
        hiddenCount +=1;
        currentTd = nextSibling;
    }
    if(hiddenCount >= columnsToTakeUp){
        notePosition += 1;
        pushNoteBackward(currentTd.nextSibling, hiddenCount-(columnsToTakeUp-1), getNoteColumnsToTakeUp(notes[notePosition]), notes, notePosition);
    }
}

/* Splits up the measure into the max number of columns according to the beat unit of the min supported note.

    I.e. If the 16th note is the min supported note, and the measure has a time signature of 4/4,
    then a measure is composed of 16 columns.

*/
function calculateNumOfMeasureNoteColumns(beatsPerMeasure, beatUnit) {
    const toMultiply = 4/beatUnit;
    if (toMultiply === 1) {
        return (beatsPerMeasure*beatUnit);
    } else {
        return (beatsPerMeasure*beatUnit)*(toMultiply*toMultiply);
    }
}

function getNoteColumnsToTakeUp(note){
    var columnsToTakeUp = noteUnitMinEquivalents[note.noteUnit];
    if(note.dotted) {
        if(note.noteUnit === "sixteenth") {
            alert("Cannot add a dot to a " + note.noteUnit + " note, as it requires a note smaller than the supported set of notes");
        } else { 
            columnsToTakeUp += columnsToTakeUp / 2;
        }
    }
    return columnsToTakeUp;
}

/* Creates a Measure */
function createEmptyMeasure(beatsPerMeasure, beatUnit) {
    // for now, number of supported notes is 15 (rows=15)
    const numOfNoteRows = 15;
    const measure = document.createElement('table');
    measure.setAttribute('class', 'museMeasure');
    const measureTbody = document.createElement('tbody');
    measure.appendChild(measureTbody);

    const numOfNoteColumns = calculateNumOfMeasureNoteColumns(beatsPerMeasure, beatUnit);

    for(var i = 0; i < numOfNoteRows+1; i++) {
        const noteRow = document.createElement('tr');
        measureTbody.appendChild(noteRow);
        // last row for the pointer
        if(i === 15) {
            noteRow.setAttribute('class', 'museMeasurePointerContainer');
        }
        // note rows with staff lines
        if(i == 3 || i === 5 || i === 7 || i === 9 || i === 11) {
            const line = document.createElement('div');
            line.setAttribute('class', 'museMeasureLine');
            noteRow.appendChild(line);
        }

        for(var j = 0; j < numOfNoteColumns; j++) {
            const noteColumn = document.createElement('td');
            noteRow.appendChild(noteColumn);
        }
    }

    return measure;
}


function createMeasure(museMeasure) {
    museMeasure.measure = createEmptyMeasure(museMeasure.timeSig.beatsPerMeasure, museMeasure.timeSig.beatUnit);
    fillDefaultMeasure(museMeasure);

}

function fillDefaultMeasure(museMeasure){
    const beatsPerMeasure = museMeasure.timeSig.beatsPerMeasure;
    const beatUnit = museMeasure.timeSig.beatUnit;
    // Add default Rest notes to new measure
    const restUnitName = Object.keys(noteUnitMaxEquivalents).filter( (noteUnit) => {
        return noteUnitMaxEquivalents[noteUnit] === beatUnit;
    })[0];
    for(var i = 0; i < beatsPerMeasure; i++) {
        museMeasure.addNoteAtCurrentPosition(new Rest(restUnitName));
        museMeasure.pointer.position +=1;
    }
    // Remove highlight from non-pointed notes that were newly created
    const highlightedDefaultNotes = Array.from(museMeasure.measure.querySelectorAll('.highlighted'));
    if(highlightedDefaultNotes.length > 0) {
        highlightedDefaultNotes.map( (noteContainer, index) => {
            if(index !== museMeasure.pointer.position) {
                noteContainer.setAttribute('class', "museStaffNote");
            } else {
                /* first note className is "class="museStaffNote highlighted highlighted"" for some reason
                remove one of the highlighted: */
                noteContainer.setAttribute('class', noteContainer.className.replace("highlighted", ""));
            }
        })
    }

    museMeasure.setPointerVisible(false);
}



function fillRemainingWithRests(museMeasure, noteIndex) {
    const tdPointedOn = getNonHiddenTds(museMeasure.measure.rows[index].cells)[noteIndex];
    const beatUnit = museMeasure.timeSig.beatUnit;
    const restUnitName = Object.keys(noteUnitMaxEquivalents).filter( (noteUnit) => {
        return noteUnitMaxEquivalents[noteUnit] === beatUnit;
    })[0];
    
    while(tdPointedOn) {
        if(tdPointedOn.hasChildNodes()) {
            tdPointedOn.removeChild(tdPointedOn.firstChild);
        }
        if(tdPointedOn.className.includes("tdHidden")) {
            tdPointedOn.setAttribute('class', "");
        }
        const restImage = new Rest(restUnitName).createNoteImage();
        tdPointedOn.appendChild(restImage);
        tdPointedOn = tdPointedOn.nextSibling;
    }
}

function getNonHiddenTds(cells) {
    return Object.values(cells).filter( (td) => {
        return !td.className.includes("tdHidden");
    })
}