/* JS Library */
"use strict";

// import {noteDirection} from './constants/noteShapes';


class Measure {
    constructor() {
        this.notes = [];
        this.clef = "treble";
        this.timeSig = new TimeSignature(4, 4);
        //this.measure = createMeasure(this.timeSig.beatsPerMeasure,this.timeSig.beatUnit);
        this.lyrics = [];
        // this.editable = false;
        // this.playable = false;
        this.pointer = {
            visible: false,
            position: 0
        }
    }

    setNotes(notes) {
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

    setPointerPosition(noteNumberIndex) {
        const oldPointerNote = this.notes[this.pointer.position];
        const oldPointerNoteRowIndex = Object.keys(noteDirection).reverse().indexOf(oldPointerNote.noteValue);

        

        //document.querySelector('museMeasure').querySelectorAll('tr')[oldPointerNoteRowIndex].querySelectorAll('td')[this.pointer.position]


        this.pointer.position = noteNumberIndex;

        
    }

    addNoteAtCurrentPosition(note) {
        const columnsToTakeUp = noteUnitMinEquivalents[note.noteUnit];
        var noteRowIndex;
        if(note.noteType === "note") {
            noteRowIndex = Object.keys(noteDirection).reverse().indexOf(note.noteValue);
        }
        // for rest notes, place in middle line of staff measure (8th row)
        else {
            noteRowIndex = 8;
        }

        const noteImage = note.createNoteImage();

        if(this.notes[this.pointer.position]) {
            noteImage.addEventListener('click', onNoteClick);
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

/* Creates a Measure */
function createMeasure(beatsPerMeasure, beatUnit) {
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
        if(i === 16) {
            noteRow.setAttribute('class', 'museMeasurePointerContainer');
            const pointerImg = document.createElement('img');
            pointerImg.setAttribute("class", "museMeasurePointerImage")
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

function clickNoteToAddToMeasure(e) {
    e.preventDefault();

    const noteRowIndex = this.rowIndex;
    const notesBasedOnRow = Object.keys(noteDirection).reverse();
    const noteValue = notesBasedOnRow[noteRowIndex];
}



function onNoteClick(e) {
    // td column number of note
    const noteNumberIndex = this.parentNode.cellIndex
    this.setAttribute("class", this.className + " highlighted");
    setPointerPosition(noteNumberIndex);
}