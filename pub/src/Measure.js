/* JS Library */
"use strict";

// import {noteDirection} from './constants/noteShapes';


class Measure {
    constructor() {
        this.notes = [];
        this.clef = "treble";
        this.timeSig = new TimeSignature(3, 4);
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

    inputListener = (e) => clickNoteToAddToMeasure(e, this);

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
        //bad -> document.querySelector('.museMeasure').querySelectorAll('tr')[oldPointerNoteRowIndex].querySelectorAll('td')[oldPointerPosition]
        oldNotePointedOnContainer.setAttribute('class', "museStaffNote");

        // remove pointer from old td column location
        //const oldPointerColumnLocation = this.measure.rows[this.measure.rows.length-1].cells[oldPointerPosition]
        const oldPointerColumnLocation = getNonHiddenTds(this.measure.querySelector('.museMeasurePointerContainer').cells)[oldPointerPosition]
        // console.log("oldPointerColumnLocation:")
        oldPointerColumnLocation.removeChild(oldPointerColumnLocation.firstChild);

        Object.values(this.measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[oldPointerPosition].removeEventListener('click', this.inputListener);
        })
    }

    setPointerPosition(noteNumberIndex) {
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

        // remove pointer and highlight from old note that was pointed on

        // Create new pointer and add to new td location
        const pointerImg = document.createElement('img');
        pointerImg.setAttribute('class', "museMeasurePointerImage");
        pointerImg.setAttribute('src', "src/static/pointer.png");
        getNonHiddenTds(this.measure.querySelector('.museMeasurePointerContainer').cells)[this.pointer.position].appendChild(pointerImg);
        Object.values(this.measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[this.pointer.position].addEventListener('click', this.inputListener );
        })
    }

    addNoteAtCurrentPosition(note) {
        const columnsToTakeUp = getNoteColumnsToTakeUp(note);
        var noteRowIndex;
        if(note.noteType === "note") {
            noteRowIndex = Object.keys(noteDirection).reverse().indexOf(note.noteValue);
        }
        // for Rest notes, place in middle line of staff measure (8th row)
        else {
            noteRowIndex = 7;
        }

        const noteImage = note.createNoteImage();
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
                pushNoteForward(tdPointedOn, 0, columnsToTakeUp, this.notes, this.pointer.position);
            })
            //this.notes.splice(this.pointer.position, 0, note);
            //this.setPointerPosition(this.pointer.position);
        
        // Only occurs during creation of measure, since no default Rest notes yet
        } else {
            if(!this.pointer.position) {
                this.pointer.position = 0;
            }
            // console.log(this.pointer.position);
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

            // const noteContainer = getNonHiddenTds(this.measure.rows[noteRowIndex].cells)[this.pointer.position].querySelector('.museStaffNote');
            // noteContainer.setAttribute('class', noteContainer.className + " highlighted");

            // this.setPointerPosition(this.pointer.position);
            // this.pointer.position +=1;
        }
        
    }
}

function pushNoteForward(noteTd, numColumnsToPush, columnsToTakeUp, notes, position) {
    var currentTd = noteTd;
    var notePosition = position;
    var noteImage = null;
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
            var newNoteColumnsToTakeUp = getNoteColumnsToTakeUp(notes[notePosition]);
            pushNoteForward(nextSibling, numColumnsToPush, newNoteColumnsToTakeUp, notes, notePosition);
        }
        //nextSibling.setAttribute('class', nextSibling.className + " tdHidden");
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
        //
        if(!nextSibling.className.includes("tdHidden")){
            notePosition += 1;
            var newNoteColumnsToTakeUp = getNoteColumnsToTakeUp(notes[notePosition]);
            pushNoteForward(nextSibling, 0, newNoteColumnsToTakeUp, notes, notePosition);
        }
        //nextSibling.setAttribute('class', nextSibling.className + " tdHidden");
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
        pushNoteBackward(currentTd.nextSibling, hiddenCount-(columnsToTakeUp-1), getNoteColumnsToTakeUp(notes[notePosition]), notes, notePosition);
    }
}

function pushNoteBackward(noteTd, numColumnsToPush, columnsToTakeUp, notes, position) {
    var currentTd = noteTd;
    var notePosition = position;
    var noteImage = null;

    // weird
    if(!currentTd) {
        return;
    }
    //

    if(currentTd.hasChildNodes() && numColumnsToPush !== 0) {
        noteImage = currentTd.removeChild(currentTd.firstChild);
        currentTd.setAttribute('class', currentTd.className + " tdHidden");
    }

    for(var i = 0; i < numColumnsToPush; i++) {
        var previousSibling = currentTd.previousSibling;
        //nextSibling.setAttribute('class', nextSibling.className + " tdHidden");
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
        } else {
            //noteRow.addEventListener('click', (e) => clickNoteToAddToMeasure(e, this) )
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

// 
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
        // museMeasure.setPointerPosition(museMeasure.pointer.position + 1);
    }
    // Remove highlight from non-pointed notes that were newly created
    const highlightedDefaultNotes = Array.from(museMeasure.measure.querySelectorAll('.highlighted'));
    // console.log(highlightedDefaultNotes)
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


// function onNoteClick(e, museMeasure) {
//     /* const noteNumberIndex = this.parentNode.cellIndex;
//     this.setAttribute("class", this.className + " highlighted"); */

//     // Highlight note
//     const noteContainer = e.target.parentNode;
//     console.log(noteContainer)
//     if(noteContainer.tagName === "TD"){
//         return;
//     }
//     noteContainer.setAttribute('class', noteContainer.className + " highlighted");

//     // Set pointer position to the same td column number of note
//     const td = e.target.parentNode.parentNode;
//     var noteNumberIndex = null;
//     getNonHiddenTds(e.target.parentNode.parentNode.parentNode.cells).filter( (noteTd, index) => {
//         if(noteTd === td) {
//             noteNumberIndex = index;
//         }
//         return noteTd === td
//     });

//     console.log(noteNumberIndex);
//     museMeasure.setPointerPosition(noteNumberIndex);
// }


function clickNoteToAddToMeasure(e, museMeasure) {
    // console.log(e.target);
    // when clicking on pointed note (instead of empty place to add note), e.target is <div> and then gives errors
    if(e.target.tagName !== "TD") {
        return;
    }
    const noteRowIndex = e.target.parentNode.rowIndex;
    const notesBasedOnRow = Object.keys(noteDirection).reverse();
    const noteValue = notesBasedOnRow[noteRowIndex];
    const noteUnit = "quarter";
    console.log("noteRowIndex " + noteRowIndex);
    console.log("noteValue " + noteValue);
    const note = new Note(noteValue, noteUnit);
    museMeasure.addNoteAtCurrentPosition(note);
}