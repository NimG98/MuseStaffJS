/* JS Library */
"use strict";

class StaffRow {
    constructor() {
        this.notes = [[]];
        this.clef = "treble";
        this.timeSig = new TimeSignature(4, 4);

        this.lyrics = [];
        // this.editable = false;
        // this.playable = false;
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

    /* Creates a Staff that is one line*/
    createStaffRow(notes) {
        // for now, number of supported notes is 15 (rows=15)
        const numOfNoteRows = 15;
        const staff = document.createElement('table');
        staff.setAttribute('class', 'museStaffRow');
        const staffTbody = document.createElement('tbody');
        staff.appendChild(staffTbody);

        const numOfNoteColumns = calculateNumOfMeasureNoteColumns(this.timeSig.beatsPerMeasure,this.timeSig.beatUnit);

        for(var i = 0; i < numOfNoteRows; i++) {
            const noteRow = document.createElement('tr');
            staffTbody.appendChild(noteRow);

            if(i == 3 || i === 5 || i === 7 || i === 9 || i === 11) {
                const line = document.createElement('div');
                line.setAttribute('class', 'museStaffLine');
                noteRow.appendChild(line);
            }

            for(var j = 0; j < numOfNoteColumns; j++) {
                const noteColumn = document.createElement('td');
                noteColumn.addEventListener('click', addNoteToStaff)
                noteRow.appendChild(noteColumn);
                // noteColumn.style.backgroundColor = "Aqua";
            }
        }

        return staff;
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

function addNoteToStaff(e) {
    e.preventDefault();
}

