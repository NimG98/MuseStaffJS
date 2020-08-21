class MuseStaff {
    constructor(timeSig) {

        // this.measures = [Measure(), Measure(), Measure()...]
        this.measures = [];
        this.measurePointedOn = null;
        this.editable = false;

        if(timeSig){
            this.timeSig = this.parseTimeSignature(timeSig);
        } else {
            this.timeSig = new TimeSignature(4, 4);
        }

        this.insertNoteType = "quarter";

        this.staff = null;
        this.display();
        
    }

    addNoteClickListener = (e) => clickNoteToAddToMeasure(e, this);
    addNoteTdHoverListener = (e) => displayNoteTdHover(e, "mouseover");
    removeNoteTdHoverListener = (e) => displayNoteTdHover(e, "mouseout");
    changeInsertNoteTypeListener = (e) => clickToChangeInsertNoteType(e, this);
    changePointerListener = (e) => onNoteClick(e, this);

    /* Parses the string timeSigString (e.g. '3/4') into TimeSignature */
    parseTimeSignature(timeSigString) {
        if(/^\d+\/\d+$/.test(timeSigString)){
            const [beatsPerMeasure, beatUnit] = timeSigString.split("/");
            console.log(beatsPerMeasure, beatUnit)
            const timeSignature = new TimeSignature(parseInt(beatsPerMeasure), parseInt(beatUnit));
            return timeSignature;
        } else {
            throw new Error(`The provided time signature is not in proper format: '${timeSigString}'. Try providing a time signature that follows this pattern: '3/4'`);
        }
    }

    setNotes(notes) {
        this.measures = []
        this.measurePointedOn = null;
        this.addMeasure();
        this.setEditable(true);
        var i=0;
        var currentMeasureIndex = this.measures.indexOf(this.measurePointedOn);
        notes.map( (note) => {
            this.addNoteAtCurrentMeasurePosition(note);
            i += 1;
            if(currentMeasureIndex !== this.measures.indexOf(this.measurePointedOn)){
                if(this.measurePointedOn.notes.length === 1) {
                    i=0;
                } else {
                    i=1;
                }
            }
            currentMeasureIndex = this.measures.indexOf(this.measurePointedOn)
            this.setMeasurePointedOn(this.measures.indexOf(this.measurePointedOn), i);
        })
        this.setEditable(false);
    }

    setEditable(editable) {
        this.editable = editable;
        if(editable && this.measures.length > 0) {
            this.setMeasurePointedOn(0, 0)
            // Make note containers be clickable for changing pointer position
            this.measures.map( (museMeasure) => {
                const museMeasureNotes = Array.from(museMeasure.measure.querySelectorAll(".museStaffNote"));
                museMeasureNotes.map( (noteContainer) => {
                    noteContainer.addEventListener('click', this.changePointerListener );
                })
            })
            // Add listener for clicking newly pointed column to add notes
            Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('click', this.addNoteClickListener );
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('mouseover', this.addNoteTdHoverListener );
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('mouseout', this.removeNoteTdHoverListener );
            })
        }
        if(editable){
            const noteSelector = createNoteTypeSelectionDisplay(this.insertNoteType);
            // this.staff.appendChild(noteSelector);
            this.staff.insertBefore(noteSelector, this.staff.children[0]);
            Array.from(noteSelector.querySelectorAll(".museStaffNote")).map( (selectorNote) => {
                selectorNote.addEventListener('click', this.changeInsertNoteTypeListener);
            });
        } else {
            if(this.staff.querySelector(".noteSelectorDisplay")){
                this.staff.removeChild(this.staff.querySelector(".noteSelectorDisplay"));
            }
            if(this.measurePointedOn) {
                const museMeasureNotes = Array.from(this.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
                museMeasureNotes.map( (noteContainer) => {
                    noteContainer.removeEventListener('click', this.changePointerListener );
                })

                this.measurePointedOn.removePointer();
                // Remove listener for clicking old pointed at column to add notes
                Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                    getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('click', this.addNoteClickListener);
                    getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('mouseover', this.addNoteTdHoverListener );
                    getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('mouseout', this.removeNoteTdHoverListener );
                })
                this.measurePointedOn.setPointerVisible(false);
                this.measurePointedOn = null;
            }
        }
        this.measures.map( (museMeasure) => {
            museMeasure.setMeasureEditable(editable);
        })
    }

    /*  
        Add measure to the staff. If measureIndex is provided, insert the measure at that index.
        Otherwise, insert the measure at the end of the staff.
        If a Measure is not provided, a default Measure is created.
    */
    addMeasure(measureIndex) {
        var measureIndex = measureIndex || this.measures.length;
        if(measureIndex > this.measures.length) {
            throw new Error("Measure cannot be inserted into an invalid position: " + measureIndex);
        }
        // var measure = measure || new Measure();
        var measure = new Measure(this.timeSig);

        // Sets the measure to be editable or not based off of the staff's this.editable property 
        measure.setMeasureEditable(this.editable)

        // Set id of <table> measure to be the index of the measure in the staff (e.g. measure0)
        measure.measure.setAttribute("id", "measure" + measureIndex);

        // Add end of measure vertical line to previous measure
        if(this.measures.length > 0 && measureIndex !== 0) {
            Object.values(this.measures[measureIndex-1].measure.rows).map( (tr, index) => {
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

        // If Measure inserted before other Measures
        if(measureIndex < this.measures.length) {
            // change the ids of the <table> measures after the inserted measure to be correctly numbered
            for(var i=measureIndex; i < this.measures.length; i++) {
                this.measures[i].measure.setAttribute("id", "measure" + parseInt(i+1))
            }

            // Add end of measure vertical line to the inserted measure
            Object.values(measure.measure.rows).map( (tr, index) => {
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

        // Insert Measure into staff's list of Measures
        this.measures.splice(measureIndex, 0, measure);

        // Move pointer to beginning of newly created measure
        if(this.editable) {
            this.setMeasurePointedOn(measureIndex, 0);
        }

        this.staff.insertBefore(measure.measure, this.staff.querySelectorAll(".museMeasure")[measureIndex]);
    }

    setMeasurePointedOn(measureIndex, noteNumberIndex) {
        // Remove pointer from old measure
        if(this.measurePointedOn) {
            this.measurePointedOn.removePointer();
            // Remove listener for clicking old pointed at column to add notes
            Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('click', this.addNoteClickListener);
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('mouseover', this.addNoteTdHoverListener );
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].removeEventListener('mouseout', this.removeNoteTdHoverListener );
            })
            this.measurePointedOn.setPointerVisible(false);
            
        }
        this.measurePointedOn = this.measures[measureIndex];
        this.measurePointedOn.setPointerVisible(true);
        this.measurePointedOn.setPointerPosition(noteNumberIndex);

        // Make new note containers be clickable for changing pointer position
        const museMeasureNotes = Array.from(this.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
        museMeasureNotes.map( (noteContainer) => {
            noteContainer.addEventListener('click', this.changePointerListener );
        })
        // Add listener for clicking newly pointed column to add notes
        Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('click', this.addNoteClickListener );
            getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('mouseover', this.addNoteTdHoverListener );
            getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('mouseout', this.removeNoteTdHoverListener );
        })
    }

    display() {
        // returns array of Measure <table> elements from Measure.measure
        const measureTableArray = this.measures.map( (measure) => measure.measure );

        const museStaffDiv = document.createElement('div');
        museStaffDiv.setAttribute("class", "museStaff");
        this.staff = museStaffDiv;

        // Add note type selector
        if(this.editable) {
            const noteSelector = createNoteTypeSelectionDisplay(this.insertNoteType);
            this.staff.appendChild(noteSelector);
            Array.from(noteSelector.querySelectorAll(".museStaffNote")).map( (selectorNote) => {
                selectorNote.addEventListener('click', this.changeInsertNoteTypeListener);
            });
        }

        // Add staff properties (clef and time signature)
        const staffPropertyDiv = createStaffPropertyDisplay("treble", this.timeSig)
        this.staff.appendChild(staffPropertyDiv)

        // append Measure <table> elements to MuseStaff div container
        measureTableArray.map( (measureTable) => {
            this.staff.appendChild(measureTable);
        })
        return this.staff;
    }

    changeInsertNoteType(noteType) {
        if(noteType === this.insertNoteType) {
            return;
        }
        // Remove selection highlight from old note type
        const oldInsertNoteContainer = this.staff.querySelector("#" + this.insertNoteType + "Note");
        oldInsertNoteContainer.setAttribute("class", "museStaffNote")

        this.insertNoteType = noteType;
    }

    addNoteAtCurrentMeasurePosition(note) {

        const noteImage = note.createNoteImage();
        // Make new note container be clickable for changing pointer position
        noteImage.addEventListener('click', this.changePointerListener );
        if(!noteImage.className.includes("highlighted")){
            noteImage.setAttribute('class', noteImage.className + " highlighted");
        }

        const numOfMeasureNoteColumns = this.measurePointedOn.measure.rows[0].cells.length;
        const columnsToTakeUp = getNoteColumnsToTakeUp(note);

        if(columnsToTakeUp > numOfMeasureNoteColumns) {
            alert("Note is too big to fit inside any measure");
            return
        }
        
        var numOfCurrentFilledNoteColumns = 0;
        var overflowed = false;
        var notesToOverflow = [];
        var noteIndexToOverflow = null;

        var addNoteToCurrentMeasure = false;

        this.measurePointedOn.notes.map( (measureNote, index) => {
            if(index !== this.measurePointedOn.pointer.position) {
                // if Rest after note to be added, then can overwrite these Rests to fit the note in the measure
                if(index > this.measurePointedOn.pointer.position && measureNote.noteType === "rest") {
                    return;
                }
                numOfCurrentFilledNoteColumns += getNoteColumnsToTakeUp(measureNote);
                
                if((numOfCurrentFilledNoteColumns + columnsToTakeUp) > numOfMeasureNoteColumns) {
                    if(!overflowed) {
                        overflowed = true;
                        // note to be added at current pointer position can stay in the measure
                        if(index > this.measurePointedOn.pointer.position) {
                            noteIndexToOverflow = index;
                            addNoteToCurrentMeasure = true;
                        // note to be added at current pointer position has to move to new measure
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
                // Remove overflowed notes from current measure and fill remainder of the measure with rests
                this.measurePointedOn.removeNotesStartingFromIndex(noteIndexToOverflow);
                // Add note inside measure if it is supposed to fit
                if(addNoteToCurrentMeasure) {
                    this.addNoteAtCurrentMeasurePosition(note);
                } else {
                    notesToOverflow[0] = note;
                }
                // Insert new measure after current measure pointed on
                const newMeasureIndex = parseInt(this.measurePointedOn.measure.id.match(/\d+/)) + 1;
                console.log(newMeasureIndex)
                this.addMeasure(newMeasureIndex);
                notesToOverflow.map( (noteToOverflow) => {
                    if(noteToOverflow.noteType !== "rest") {
                        this.addNoteAtCurrentMeasurePosition(noteToOverflow)
                    }
                });
            }
        } else {
            // Add note to currently pointed on measure
            this.measurePointedOn.addNoteAtCurrentPosition(note, noteImage);

            // Make new note containers be clickable for changing pointer position
            const museMeasureNotes = Array.from(this.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
            museMeasureNotes.map( (noteContainer) => {
                noteContainer.addEventListener('click', this.changePointerListener );
            })
            // Add listener for clicking newly pointed column to add notes
            Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('click', this.addNoteClickListener );
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('mouseover', this.addNoteTdHoverListener );
                getNonHiddenTds(tr.cells)[this.measurePointedOn.pointer.position].addEventListener('mouseout', this.removeNoteTdHoverListener );
            })
            // Add end of measure line to last td if note added causes last td with endMeasureLine to change
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
    const measureId = parseInt(el.id.match(regex));
    console.log(measureId)
    // If moving pointer on same measure
    if(museStaff.measurePointedOn === museStaff.measures[measureId]) {
        // Remove listener for clicking old pointed at column to add notes
        Object.values(museStaff.measurePointedOn.measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[museStaff.measurePointedOn.pointer.position].removeEventListener('click', museStaff.addNoteClickListener);
            getNonHiddenTds(tr.cells)[museStaff.measurePointedOn.pointer.position].removeEventListener('mouseover', museStaff.addNoteTdHoverListener );
            getNonHiddenTds(tr.cells)[museStaff.measurePointedOn.pointer.position].removeEventListener('mouseout', museStaff.removeNoteTdHoverListener );
        })
        museStaff.measures[measureId].setPointerPosition(noteNumberIndex)
        // Make new note containers be clickable for changing pointer position
        const museMeasureNotes = Array.from(museStaff.measures[measureId].measure.querySelectorAll(".museStaffNote"));
        museMeasureNotes.map( (noteContainer) => {
            noteContainer.addEventListener('click', museStaff.changePointerListener );
        })
        // Add listener for clicking newly pointed column to add notes
        Object.values(museStaff.measures[measureId].measure.rows).map( (tr) => {
            getNonHiddenTds(tr.cells)[museStaff.measures[measureId].pointer.position].addEventListener('click', museStaff.addNoteClickListener );
            getNonHiddenTds(tr.cells)[museStaff.measures[measureId].pointer.position].addEventListener('mouseover', museStaff.addNoteTdHoverListener );
            getNonHiddenTds(tr.cells)[museStaff.measures[measureId].pointer.position].addEventListener('mouseout', museStaff.removeNoteTdHoverListener );
        })
    } else {
        // Make old pointed measure's recently changed note containers be clickable for changing pointer position
        const museMeasureNotes = Array.from(museStaff.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
        museMeasureNotes.map( (noteContainer) => {
            noteContainer.addEventListener('click', museStaff.changePointerListener );
        })
        // Set new measure to be pointed on (and remove pointer from old pointed on measure)
        museStaff.setMeasurePointedOn(measureId, noteNumberIndex);
    }
}


function clickNoteToAddToMeasure(e, museStaff) {
    var noteRowIndex;

    if(e.target.tagName === "DIV" && e.target.className.includes("museStaffNote") && e.target.className.includes("highlighted")){
        noteRowIndex = e.target.parentNode.parentNode.rowIndex;
    }
    // when clicking on pointed note (instead of empty place to add note), e.target is <div> and then gives errors
    else if(e.target.tagName !== "TD") {
        return;
    }
    else if(e.target.parentNode.className.includes("museMeasurePointerContainer")){
        return;
    } else {
        noteRowIndex = e.target.parentNode.rowIndex;
    }
    
    const notesBasedOnRow = Object.keys(noteDirection).reverse();
    const noteValue = notesBasedOnRow[noteRowIndex];
    const noteUnit = museStaff.insertNoteType;
    console.log("noteRowIndex " + noteRowIndex);
    console.log("noteValue " + noteValue);
    const note = new Note(noteValue, noteUnit);
    museStaff.addNoteAtCurrentMeasurePosition(note);
}

function displayNoteTdHover(e, mouseAction) {
    var elementToHighlight;
    if(e.target.tagName === "DIV" && e.target.className.includes("museStaffNote") && e.target.className.includes("highlighted")){
        elementToHighlight = e.target.parentNode;
    }
    else if(e.target.tagName !== "TD") {
        return;
    }
    else if(e.target.parentNode.className.includes("museMeasurePointerContainer")){
        return;
    } else {
        elementToHighlight = e.target;
    }
    if(mouseAction === "mouseover") {
        elementToHighlight.style.backgroundColor = "#EFDAFF";
        elementToHighlight.style.opacity = "0.6";
    }
    if(mouseAction === "mouseout") {
        elementToHighlight.style.backgroundColor = "";
        elementToHighlight.style.opacity = "";
    }
}

function createStaffPropertyDisplay(clefType, timeSignature) {

    const staffPropertyDiv = document.createElement("div");
    staffPropertyDiv.setAttribute("class", "museStaffPropertySection")

    // Clef display
    const clefDiv = createClefDisplay(clefType);
    staffPropertyDiv.appendChild(clefDiv);

    // Time signature display
    const timeSigDiv = createTimeSignatureDisplay(timeSignature)
    staffPropertyDiv.appendChild(timeSigDiv);

    // Create ledger lines that staff properties will be placed on top of
    const numOfRows = 15;
    const staffPropertyLinesSection = document.createElement('table');
    staffPropertyLinesSection.setAttribute('class', 'staffPropertyLinesSection');
    const tbody = document.createElement('tbody');
    staffPropertyLinesSection.appendChild(tbody);

    for(var i = 0; i < numOfRows+1; i++) {
        const noteRow = document.createElement('tr');
        tbody.appendChild(noteRow);
        // note rows with staff lines
        if(i == 3 || i === 5 || i === 7 || i === 9 || i === 11) {
            const line = document.createElement('div');
            line.setAttribute('class', 'museMeasureLine');
            noteRow.appendChild(line);
        }
        noteRow.appendChild(document.createElement("td"));
    }
    staffPropertyDiv.appendChild(staffPropertyLinesSection);

    return staffPropertyDiv;
}

function createClefDisplay(clefType) {
    const clefDiv = document.createElement("div");
    clefDiv.setAttribute("class", "clefDisplay");

    const clefImage = document.createElement("img");
    clefImage.setAttribute("class", "clefImage")
    if(clefType === "treble") {
        clefImage.setAttribute("src", "src/static/clef-treble.png");
    }
    clefDiv.appendChild(clefImage);

    return clefDiv;
}

function createTimeSignatureDisplay(timeSignature){
    const timeSigDiv = document.createElement("div");
    timeSigDiv.setAttribute("class", "timeSignatureDisplay")

    const beatsPerMeasureText = document.createElement("p");
    beatsPerMeasureText.innerHTML = timeSignature.beatsPerMeasure;
    
    const beatUnitText = document.createElement("p");
    beatUnitText.innerHTML = timeSignature.beatUnit;

    timeSigDiv.appendChild(beatsPerMeasureText);
    timeSigDiv.appendChild(beatUnitText);

    return timeSigDiv;
}

function createNoteTypeSelectionDisplay(insertNoteType) {
    const noteSelectionDisplay = document.createElement("div");
    noteSelectionDisplay.setAttribute("class", "noteSelectorDisplay");

    const noteSelectionHeader = document.createElement("h3");
    noteSelectionHeader.setAttribute("class", "noteSelectorHeader");
    noteSelectionHeader.innerHTML = "Notes:"

    const noteSelectionDiv = document.createElement("div");
    noteSelectionDiv.setAttribute("class", "noteSelector");

    Object.keys(noteShapeByUnit.note).map( noteUnit => {
        const noteDiv = document.createElement("div");
        noteDiv.setAttribute("class", "museStaffNote");
        noteDiv.setAttribute("id", noteUnit + "Note");

        const imgSrc = noteShapeByUnit.note[noteUnit].image;
        const noteImg = document.createElement("img");
        noteImg.setAttribute("class", "museStaffNoteImage");
        noteImg.setAttribute("src", imgSrc);

        if(insertNoteType === noteUnit) {
            if(!noteDiv.className.includes("noteSelectorHighlighted")){
                noteDiv.setAttribute("class", noteDiv.className + " noteSelectorHighlighted")
            }
        }

        noteDiv.appendChild(noteImg);
        noteSelectionDiv.appendChild(noteDiv);
    })

    noteSelectionDisplay.appendChild(noteSelectionHeader);
    noteSelectionDisplay.appendChild(noteSelectionDiv);

    return noteSelectionDisplay;
}

function clickToChangeInsertNoteType(e, museStaff) {
    console.log(e.target);
    var noteContainer;
    if(e.target.tagName === "IMG") {
        noteContainer = e.target.parentNode;
    } else {
        noteContainer = e.target
    }
    if(!noteContainer.className.includes("noteSelectorHighlighted")){
        noteContainer.setAttribute('class', noteContainer.className + " noteSelectorHighlighted");
        console.log(noteContainer.className)
    }

    const noteType = noteContainer.id.replace("Note", "");
    console.log(noteType)
    museStaff.changeInsertNoteType(noteType);
}