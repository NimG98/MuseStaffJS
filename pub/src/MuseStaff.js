class MuseStaff {
    constructor() {
        // this.measures = [Measure(), Measure(), Measure()...]
        this.measures = [];
        this.measurePointedOn = null;

        this.editable = false;
    }

    inputListener = (e) => clickNoteToAddToMeasure(e, this);

    setEditable(editable) {
        this.editable = editable;
        this.measures.map( (museMeasure) => {
            museMeasure.setMeasureEditable(editable);
        })
        if(editable && this.measures.length > 0) {
            this.setMeasurePointedOn(0, 0)
            // Make note containers be clickable for changing pointer position
            this.measures.map( (museMeasure) => {
                const museMeasureNotes = Array.from(museMeasure.measure.querySelectorAll(".museStaffNote"));
                museMeasureNotes.map( (noteContainer) => {
                    noteContainer.addEventListener('click', (e) => onNoteClick(e, this) );
                })
            })
            // Add listener for clicking newly pointed column to add notes
            Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('click', this.inputListener );
            })
        }
    }

    addMeasure(measure) {
        var measure = measure || new Measure();
        measure.setMeasureEditable(this.editable)
        // Set id of <table> measure to be the index of the measure in the staff (e.g. measure0)
        measure.measure.setAttribute("id", "measure" + this.measures.length);
        // Add end of measure vertical line to previous measure
        if(this.measures.length > 0) {
            Object.values(this.measures[this.measures.length-1].measure.rows).map( (tr, index) => {
                if(!tr.className.includes("museMeasurePointerContainer")) {
                    if(index >= 3 && index <= 11) {
                        const lastTdChild = getNonHiddenTds(tr.cells)[getNonHiddenTds(tr.cells).length-1]
                        lastTdChild.setAttribute('class', lastTdChild.className + " endMeasureLine"); 
                    }
                }
            })
        }
        this.measures.push(measure);
        // Move pointer to beginning of newly created measure
        if(this.editable) {
            this.setMeasurePointedOn(this.measures.length-1, 0);
        }
    }

    setMeasurePointedOn(measureIndex, noteNumberIndex) {
        // Remove pointer from old measure
        if(this.measurePointedOn) {
            this.measurePointedOn.removePointer();
            // Remove listener for clicking old pointed at column to add notes
            Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('click', this.inputListener);
            })
            this.measurePointedOn.setPointerVisible(false);
            
        }
        this.measurePointedOn = this.measures[measureIndex];
        this.measurePointedOn.setPointerVisible(true);
        this.measurePointedOn.setPointerPosition(noteNumberIndex);

        // Make new note containers be clickable for changing pointer position
        const museMeasureNotes = Array.from(this.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
        museMeasureNotes.map( (noteContainer) => {
            noteContainer.addEventListener('click', (e) => onNoteClick(e, this) );
        })
        // Add listener for clicking newly pointed column to add notes
        Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('click', this.inputListener );
        })
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

        const noteImage = note.createNoteImage();
        // Make new note container be clickable for changing pointer position
        noteImage.addEventListener('click', (e) => onNoteClick(e, this) );
        if(!noteImage.className.includes("highlighted")){
            noteImage.setAttribute('class', noteImage.className + " highlighted");
        }

        const numOfMeasureNoteColumns = this.measurePointedOn.measure.rows[0].cells.length;
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

                this.addMeasure(new Measure());
                notesToOverflow.map( (note) => {
                    this.addNoteAtCurrentMeasurePosition(note)
                });
            }
        }
        this.measurePointedOn.addNoteAtCurrentPosition(note, noteImage);
        if(this.measures.length > 0 && this.measures.indexOf(this.measurePointedOn) !== this.measures.length-1) {
            Object.values(this.measurePointedOn.measure.rows).map( (tr, index) => {
                if(!tr.className.includes("museMeasurePointerContainer")) {
                    if(index >= 3 && index <= 11) {
                        const lastTdChild = getNonHiddenTds(tr.cells)[getNonHiddenTds(tr.cells).length-1]
                        if(!lastTdChild.className.includes("endMeasureLine")){
                            lastTdChild.setAttribute('class', lastTdChild.className + " endMeasureLine");
                        }
                    }
                }
            })
        }
    }
}



/* When clicking on a note, change the measure pointed on and which note the pointer is positioned at*/
function onNoteClick(e, museStaff) {
    // Highlight note
    const noteContainer = e.target.parentNode;
    if(noteContainer.tagName === "TD"){
        return;
    }
    if(!noteContainer.className.includes("highlighted")){
        noteContainer.setAttribute('class', noteContainer.className + " highlighted");
    }

    // Set pointer position to the same td column number of note
    const td = e.target.parentNode.parentNode;
    var noteNumberIndex = null;
    getNonHiddenTds(e.target.parentNode.parentNode.parentNode.cells).filter( (noteTd, index) => {
        if(noteTd === td) {
            noteNumberIndex = index;
        }
        return noteTd === td
    });

    // Get <table> measure that was clicked on
    // loop up the parent elements until el is the <table> element
    var el = td;
    while ((el = el.parentElement) && el.tagName !== 'TABLE');
    // Get measure number out of measure id (measure0 => 0)
    var regex = /\d+/;
    const measureId = el.id.match(regex);
    // If moving pointer on same measure
    if(museStaff.measurePointedOn === museStaff.measures[measureId]) {
        // Remove listener for clicking old pointed at column to add notes
        Object.values(museStaff.measurePointedOn.measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[museStaff.measurePointedOn.pointer.position].removeEventListener('click', museStaff.inputListener);
        })
        museStaff.measures[measureId].setPointerPosition(noteNumberIndex)
        // Make new note containers be clickable for changing pointer position
        const museMeasureNotes = Array.from(museStaff.measures[measureId].measure.querySelectorAll(".museStaffNote"));
        museMeasureNotes.map( (noteContainer) => {
            noteContainer.addEventListener('click', (e) => onNoteClick(e, museStaff) );
        })
        // Add listener for clicking newly pointed column to add notes
        Object.values(museStaff.measures[measureId].measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[museStaff.measures[measureId].pointer.position].addEventListener('click', museStaff.inputListener );
        })
    } else {
        // Make old pointed measure's recently changed note containers be clickable for changing pointer position
        const museMeasureNotes = Array.from(museStaff.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
        museMeasureNotes.map( (noteContainer) => {
            noteContainer.addEventListener('click', (e) => onNoteClick(e, museStaff) );
        })
        // Set new measure to be pointed on (and remove pointer from old pointed on measure)
        museStaff.setMeasurePointedOn(measureId, noteNumberIndex);
    }
}


function clickNoteToAddToMeasure(e, museStaff) {
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
    museStaff.addNoteAtCurrentMeasurePosition(note);
}

