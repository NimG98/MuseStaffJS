/* JS Library */
"use strict";

// import {noteDirection} from './constants/noteShapes';


class Measure {
    constructor() {
        this.notes = [];
        this.clef = "treble";
        this.timeSig = new TimeSignature(4, 4);
        this.measure = null;
        this.lyrics = [];
        // this.editable = false;
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
            this.pointer.position = null;
        }
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
        console.log("oldPointerColumnLocation:")
        console.log(oldPointerColumnLocation)
        oldPointerColumnLocation.removeChild(oldPointerColumnLocation.firstChild);
    }

    setPointerPosition(noteNumberIndex) {
        if(this.pointer.position) {
            this.removePointer();
        }
        // Set new pointer position
        this.pointer.position = noteNumberIndex;
        const note = this.notes[this.pointer.position];
        if(note) {
            var notePointedOnRowIndex;
            if(note.noteType === "note") {
                notePointedOnRowIndex = Object.keys(noteDirection).reverse().indexOf(notePointedOn.noteValue);
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
        noteImage.addEventListener('click', (e) => onNoteClick(e, this) );

        var noteImageAdded = false;
        if(this.notes[this.pointer.position]) {
            const tdPointedOn = getNonHiddenTds(this.measure.rows[noteRowIndex].cells)[this.pointer.position];
            while(tdPointedOn.nextSibling) {

            }
            /* const rowContentStartingFromPointerPosition = this.measure.rows[noteRowIndex].cells.slice(this.pointer.position, this.notes.length);
            for(var i = 0; i < rowContentStartingFromPointerPosition.length; i++) {
                if(!td.className.includes("tdHidden")){

                }
            } */
            this.setPointerPosition(this.pointer.position+1);
        
        // Only occurs during creation of measure, since no default Rest notes yet
        } else {
            if(!this.pointer.position) {
                this.pointer.position = 0;
            }
            console.log(this.pointer.position);
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
            console.log(this.notes);

            // const noteContainer = getNonHiddenTds(this.measure.rows[noteRowIndex].cells)[this.pointer.position].querySelector('.museStaffNote');
            // noteContainer.setAttribute('class', noteContainer.className + " highlighted");

            // this.setPointerPosition(this.pointer.position);
            // this.pointer.position +=1;
        }
        
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
        return (beatsPerMeasure*beatUnit)*(2*toMultiply);
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
            noteRow.addEventListener('click', clickNoteToAddToMeasure)
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
    const restUnitName = Object.keys(noteUnitMinEquivalents).filter( (noteUnit) => {
        return noteUnitMinEquivalents[noteUnit] === beatUnit;
    })[0];
    for(var i = 0; i < beatsPerMeasure; i++) {
        museMeasure.addNoteAtCurrentPosition(new Rest(restUnitName));
        museMeasure.pointer.position +=1;
        // museMeasure.setPointerPosition(museMeasure.pointer.position + 1);
    }
    museMeasure.setPointerVisible(false);
}



function fillRemainingWithRests(museMeasure, noteIndex) {

}

function getNonHiddenTds(cells) {
    return Object.values(cells).filter( (td) => {
        return !td.className.includes("tdHidden");
    })
}

function clickNoteToAddToMeasure(e) {
    e.preventDefault();

    const noteRowIndex = this.rowIndex;
    const notesBasedOnRow = Object.keys(noteDirection).reverse();
    const noteValue = notesBasedOnRow[noteRowIndex];
}



function onNoteClick(e, museMeasure) {
    /* const noteNumberIndex = this.parentNode.cellIndex;
    this.setAttribute("class", this.className + " highlighted"); */

    // Highlight note
    const noteContainer = e.target.querySelector('.museStaffNote');
    noteContainer.setAttribute('class', noteContainer.className + " highlighted");

    // Set pointer position to the same td column number of note
    const noteNumberIndex = e.target.cellIndex;
    museMeasure.setPointerPosition(noteNumberIndex);
}