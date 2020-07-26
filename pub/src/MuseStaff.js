class MuseStaff {
    constructor() {
        // this.measures = [Measure(), Measure(), Measure()...]
        this.measures = [];
        this.measurePointedOn = null;
    }

    addMeasure(measure) {
        // Add end of measure vertical line to previous measure
        if(this.measures.length > 0) {
            this.measures[this.measures.length-1].measure.rows.map( (tr) => {
                if(!tr.className.includes("museMeasurePointerContainer")) {
                    const lastTdChild = tr.cells[tr.cells.length-1];
                    lastTdChild.setAttribute('class', lastTdChild.className + " endMeasureLine"); 
                }
            })
            // this.measures[this.measures.length-1].querySelectorAll('tr').map( (tr) => {
            // })
        }
        this.measures.push(measure);
        // Move pointer to beginning of newly created measure
        this.setMeasurePointedOn(this.measures.length-1);

    }

    setMeasurePointedOn(measureIndex) {
        // Remove pointer from old measure
        if(this.measurePointedOn) {
            this.measurePointedOn.setPointerVisible(false);
            this.measurePointedOn.removePointer();
        }
        this.measurePointedOn = this.measures[measureIndex];
        this.measurePointedOn.setPointerVisible(true);
        this.measurePointedOn.setPointerPosition(0);
    }

    display() {
        // returns array of Measure <table> elements from Measure.measure
        const measureTableArray = this.measures.map( (measure) => measure.measure );
        const museStaffDiv = document.createElement('div');
        // append Measure <table> elements to MuseStaff div container
        measureTableArray.map( (measureTable) => {
            museStaffDiv.appendChild(measureTable);
        })
        return museStaffDiv;
    }

    addNoteAtCurrentMeasurePosition(note) {
        const numOfMeasureNoteColumns = this.measurePointedOn.rows[0].cells.length;
        const columnsToTakeUp = getNoteColumnsToTakeUp(note);
        var numOfCurrentFilledNoteColumns = 0;
        var overflowed = false;
        var notesToOverflow = [];
        var noteIndexToOverflow = null;
        this.measurePointedOn.notes.map( (note, index) => {
            if(index !== this.measurePointedOn.pointer.position) {
                // if Rest after note to be added, then can overwrite these Rests to fit the note in the measure
                if(index > this.measurePointedOn.pointer.position && note.noteType === "rest") {
                    return;
                }
                numOfCurrentFilledNoteColumns += getNoteColumnsToTakeUp(note);
                
                if((numOfCurrentFilledNoteColumns + columnsToTakeUp) > numOfMeasureNoteColumns) {
                    if(!overflowed) {
                        overflowed = true;
                        if(index > this.measurePointedOn.pointer.position) {
                            noteIndexToOverflow = index;
                            
                        } else {
                            noteIndexToOverflow = this.measurePointedOn.pointer.position;
                        }
                        notesToOverflow = this.measurePointedOn.notes.slice(noteIndexToOverflow, this.measurePointedOn.notes.length);
                    }
                }
            }
        })
        // New note will overflow measure. Create new measure and push notes there.
        if(overflowed) {
            const numOfOverflowedColumns = (numOfCurrentFilledNoteColumns + columnsToTakeUp) - numOfMeasureNoteColumns;
            if(columnsToTakeUp > numOfMeasureNoteColumns) {
                alert("Note is too big to fit inside any measure");
                return
            } else {
                fillRemainingWithRests(this.measurePointedOn, noteIndexToOverflow);
                    // replace current pointer position note and subsequent notes with Rest notes
                    // replace note at index and subsequent notes with Rest notes

                this.addMeasure(Measure());
                notesToOverflow.map( (note) => {
                    addNoteAtCurrentMeasurePosition(note)
                });
            }
        }
        this.measurePointedOn.addNoteAtCurrentPosition(note);
    }
}


