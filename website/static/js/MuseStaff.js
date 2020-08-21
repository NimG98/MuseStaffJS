/* JS Library */
"use strict"; // always need a semicolon before an IIFE

(function(global) {

    /* MuseStaff */
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
                    // Remove listener for changing pointer position
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
                // Might need to remove listener from previous measure (in case of overflow) for changing pointer position
                this.measures.map( (museMeasure) => {
                    const museMeasureNotes = Array.from(museMeasure.measure.querySelectorAll(".museStaffNote"));
                    museMeasureNotes.map( (noteContainer) => {
                        noteContainer.removeEventListener('click', this.changePointerListener );
                    })
                })
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
                    // Remove listener for clicking old pointed at column to add notes
                    Object.values(this.measurePointedOn.measure.rows).map( (tr) => {
                        getNonHiddenTds(tr.cells).map( (td) => {
                            // When overflowed after clicking note, mouseout doesn't get to happen for where tdHover was happening.
                            // So manually remove the hover color
                            td.style.backgroundColor = "";
                            td.style.opacity = "";
    
                            td.removeEventListener('click', this.addNoteClickListener);
                            td.removeEventListener('mouseover', this.addNoteTdHoverListener );
                            td.removeEventListener('mouseout', this.removeNoteTdHoverListener );
                        })
                    })
                    // Remove overflowed notes from current measure and fill remainder of the measure with rests
                    this.measurePointedOn.removeNotesStartingFromIndex(noteIndexToOverflow);
                    // If needed to fill remainder of measure with rests, make those new rest note containers be clickable for changing pointer position
                    if(this.editable) {
                        const museMeasureNotes = Array.from(this.measurePointedOn.measure.querySelectorAll(".museStaffNote"));
                        museMeasureNotes.map( (noteContainer) => {
                            noteContainer.addEventListener('click', this.changePointerListener );
                        })
                    }
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


    /* Measure */
    class Measure {
        constructor(timeSig) {
            this.notes = [];
            this.clef = "treble";
            this.timeSig = timeSig;
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
                    const {newNotes, needToCallFillRemainingWithRests} = pushNoteForward(tdPointedOn, 0, columnsToTakeUp, [...this.notes], this.pointer.position);
                    // If last row, don't need reference to old this.notes. Can replace this.notes to newNotes
                    // newNotes also affected by if 
                    if(index === Object.values(this.measure.rows).length-1) {
                        this.notes = newNotes;
                    }
                    if(needToCallFillRemainingWithRests){
                        fillRemainingWithRests(this, index, this.notes.length-1)
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
    
        /* Remove all notes starting from the note at the specified index and then notes after the index */
        removeNotesStartingFromIndex(removeIndex) {
            // no point of removing everything starting from index 0 since it will be the same measure
            if(removeIndex === 0) {
                return;
            }
            
            // Set pointer position of measure to be before the removed notes
            this.setPointerPosition(removeIndex-1);
    
            // Start removing from removeIndex to end of this.notes
            for(var i=removeIndex; i < this.notes.length; i++) {
                Object.values(this.measure.rows).map( (tr, currentRowindex) => {
                    // Since each removed note's td is becoming hidden, the number of non hidden tds decrease.
                    // So, getNonHiddenTds(...)[removeIndex] instead of getNonHiddenTds(...)[i]
                    const currentTd = getNonHiddenTds(this.measure.rows[currentRowindex].cells)[removeIndex];
                    // Remove note image
                    if(currentTd.hasChildNodes() && !currentTd.parentNode.className.includes("museMeasurePointerContainer")) {
                        currentTd.removeChild(currentTd.firstChild);
                    }
                    // Make td hidden
                    currentTd.setAttribute('class', " tdHidden");
                })
            }
            this.notes.splice(removeIndex, this.notes.length-removeIndex);
            // Fill remainder of measure with rests
            Object.values(this.measure.rows).map( (tr, currentRowindex) => {
                fillRemainingWithRests(this, currentRowindex, removeIndex-1);
            })
        }
    }
    
    function pushNoteForward(noteTd, numColumnsToPush, columnsToTakeUp, newNotes, position) {
        var currentTd = noteTd;
        var notePosition = position;
        var noteImage = null;
        // Need copy of notes, since if rests are being taken over and deleted from the notes list,
        // when you get to the next row, you still need to see if newNotes[notePosition].noteType === "rest".
        // So, don't modify this.notes, only modify newNotes. Then when all rows are done, then change this.notes to newNotes.
        // var newNotes = [...notes];
        // var newNotes = notes;
        if(currentTd.hasChildNodes() && numColumnsToPush !== 0) {
            noteImage = currentTd.removeChild(currentTd.firstChild);
            currentTd.setAttribute('class', currentTd.className + " tdHidden");
        }
        // if(numColumnsToPush === 0) {
        //     numColumnsToPush = columnsToTakeUp;
        // }
        var unhidTd = false;
        var i=0;
        for(i; i < numColumnsToPush+columnsToTakeUp-1; i++) {
            var nextSibling = currentTd.nextSibling
            // if(numColumnsToPush === 0){
            if(numColumnsToPush !== 0 && i === numColumnsToPush && !unhidTd) {
                // if(i === numColumnsToPush-1){
                if(noteImage) {
                    currentTd.appendChild(noteImage)
                }
                currentTd.setAttribute('class', currentTd.className.replace(/tdHidden/g, ""));
                unhidTd = true;
                // }
            }
            else if(i === columnsToTakeUp-1 && !unhidTd){
                if(noteImage) {
                    currentTd.appendChild(noteImage)
                }
                currentTd.setAttribute('class', currentTd.className.replace(/tdHidden/g, ""));
                unhidTd = true;
            }
            // }
            // }
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
                    nextSibling.setAttribute('class', nextSibling.className + " tdHidden");
                    ({newNotes, needToCallFillRemainingWithRests} = pushNoteForward(nextSibling, columnsToTakeUp-i-1+numColumnsToPush, newNoteColumnsToTakeUp, newNotes, notePosition));
                }
            }
            currentTd = nextSibling;
        }
        if(i === columnsToTakeUp-1){
            if(noteImage) {
                currentTd.appendChild(noteImage)
            }
            // currentTd.setAttribute('class', currentTd.className.replace(/tdHidden/g, ""));
        }
        for(var i = 0; i < columnsToTakeUp-1; i++) {
            var nextSibling = currentTd.nextSibling
            // weird
            if(!nextSibling) {
                break;
            }
            if(!nextSibling.className.includes("tdHidden")){
                notePosition += 1;
                // // if note is a rest, just overwrite it (delete the rest)
                // if(newNotes[notePosition].noteType === "rest"){
                //     // Remove rest note image if on note row with rest image
                //     if(nextSibling.hasChildNodes()) {
                //         nextSibling.removeChild(nextSibling.firstChild);
                //     }
                //     // Make td hidden, since it's taken over
                //     nextSibling.setAttribute('class', nextSibling.className + " tdHidden");
    
                //     newNotes.splice(notePosition, 1)
                //     // Set notePosition back, since this will no longer be a note
                //     notePosition -= 1;
                // } else {
                if(!newNotes[notePosition] || newNotes[notePosition].noteType === "rest"){
                    break;
                } else {
                var newNoteColumnsToTakeUp = getNoteColumnsToTakeUp(newNotes[notePosition]);
                ({newNotes, needToCallFillRemainingWithRests} = pushNoteForward(nextSibling, 0, newNoteColumnsToTakeUp, newNotes, notePosition));
                }
            }
            currentTd = nextSibling;
        }
    
        currentTd = noteTd;
        var hiddenCount = 0;
        var nextSibling = null;
        var notePosition = position;
        var needToCallFillRemainingWithRests = false;
        while(currentTd.nextSibling && currentTd.nextSibling.className.includes("tdHidden")) {
            var nextSibling = currentTd.nextSibling;
            hiddenCount +=1;
            currentTd = nextSibling;
        }
        if(hiddenCount >= columnsToTakeUp){
            if(currentTd.nextSibling){
                notePosition += 1;
                needToCallFillRemainingWithRests = pushNoteBackward(currentTd.nextSibling, hiddenCount-(columnsToTakeUp-1), getNoteColumnsToTakeUp(newNotes[notePosition]), newNotes, notePosition);
            } else {
                needToCallFillRemainingWithRests = true;
            }
        }
    
        return {newNotes, needToCallFillRemainingWithRests}
    }
    
    function pushNoteBackward(noteTd, numColumnsToPush, columnsToTakeUp, notes, position) {
        var currentTd = noteTd;
        var notePosition = position;
        var noteImage = null;
    
        // weird
        if(!currentTd) {
            return;
        }
    
        // If on row where the note image that needs to pushed backward is,
        // then remove the image and store it for later
        if(currentTd.hasChildNodes() && numColumnsToPush !== 0) {
            noteImage = currentTd.removeChild(currentTd.firstChild);
        }
    
        // Make current td hidden, since moving note to earlier td
        // currentTd.setAttribute('class', currentTd.className + " tdHidden");
        currentTd.setAttribute('class', " tdHidden"); // don't do currentTd.className + " tdHidden", since td could have had class endMeasureLine
    
        for(var i = 0; i < numColumnsToPush; i++) {
            var previousSibling = currentTd.previousSibling;
            currentTd = previousSibling;
        }
        // On td that note is moved backwards to. So make this td unhidden now
        currentTd.setAttribute('class', currentTd.className.replace(/tdHidden/g, ""));
        // If on row where note image needs to be placed, then insert the note image
        if(noteImage) {
            currentTd.appendChild(noteImage);
        }
    
        var hiddenCount = 0;
        var nextSibling = null;
        var notePosition = position;
        var needToCallFillRemainingWithRests = false;
        while(currentTd.nextSibling && currentTd.nextSibling.className.includes("tdHidden")) {
            var nextSibling = currentTd.nextSibling;
            hiddenCount +=1;
            currentTd = nextSibling;
        }
        if(hiddenCount >= columnsToTakeUp){
            notePosition += 1;
            if(currentTd.nextSibling){
                needToCallFillRemainingWithRests = pushNoteBackward(currentTd.nextSibling, hiddenCount-(columnsToTakeUp-1), getNoteColumnsToTakeUp(notes[notePosition]), notes, notePosition);
            } else {
                needToCallFillRemainingWithRests = true;
            }
        }
    
        return needToCallFillRemainingWithRests;
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
    
    
    
    function fillRemainingWithRests(museMeasure, rowIndex, noteIndex) {
        // Get to first hidden td after the last td for the last note in the measure
        const noteNonHiddenTdToAddRestsAfter = getNonHiddenTds(museMeasure.measure.rows[rowIndex].cells)[noteIndex];
        const noteColumnsToTakeUp = getNoteColumnsToTakeUp(museMeasure.notes[noteIndex]);
        var currentTd = noteNonHiddenTdToAddRestsAfter;
        currentTd.setAttribute('class', currentTd.className.replace("endMeasureLine", ""));
    
        for(var i = 0; i < noteColumnsToTakeUp; i++) {
            var nextSibling = currentTd.nextSibling;
            currentTd = nextSibling;
        }
    
        // Type of rest notes to add
        /* const beatUnit = museMeasure.timeSig.beatUnit;
        const restUnitName = Object.keys(noteUnitMinEquivalents).filter( (noteUnit) => {
            return noteUnitMinEquivalents[noteUnit] === beatUnit;
        })[0]; */
        const restUnitName = "sixteenth";
        
        var tdPointedOn = currentTd;
        while(tdPointedOn) {
            if(tdPointedOn.hasChildNodes()) {
                tdPointedOn.removeChild(tdPointedOn.firstChild);
            }
            if(tdPointedOn.className.includes("tdHidden")) {
                tdPointedOn.setAttribute('class', tdPointedOn.className.replace(/tdHidden/g, ""));
            }
            const restNote = new Rest(restUnitName)
            const restImage = restNote.createNoteImage();
            if(rowIndex === 7){
                tdPointedOn.appendChild(restImage);
            }
            if(rowIndex === 15) {
                museMeasure.notes.push(restNote);
            }
            tdPointedOn = tdPointedOn.nextSibling;
        }
    }
    
    function getNonHiddenTds(cells) {
        return Object.values(cells).filter( (td) => {
            return !td.className.includes("tdHidden");
        })
    }

    /* Note */
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
                }
                if(this.noteUnit === "whole") {
                    noteImg.setAttribute("class", noteImg.className + " wholeNoteImage");
                } else {
                    // downward stem notes
                    if(noteDirection[this.noteValue].stemDownwards) {
                        // eigth and sixteenth downward stem notes are not transformations of the upward stem
                        if(noteShapeByUnit[this.noteType][this.noteUnit].stemDownwards) {
                            noteImgSrc = noteShapeByUnit[this.noteType][this.noteUnit].stemDownwards;
                            noteImg.setAttribute("class", noteImg.className + " rotate180Image"); 
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
            } else if(this.noteType === "rest") {
                noteImg.setAttribute("class", noteImg.className + " restImage");
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
        const noteType = noteValue === "rest" ? "rest" : "note";
    
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
    
    
    class Rest extends Note {
        constructor(noteUnit, dotted=false) {
            super("rest", noteUnit, dotted=false)
        }
    }

    /* Time Signature */
    class TimeSignature {
        constructor(beatsPerMeasure, beatUnit) {
            if(validateTimeSignature(beatsPerMeasure, beatUnit)){
                this.beatsPerMeasure = beatsPerMeasure;
                this.beatUnit = beatUnit;
            } else {
                throw new Error(`Invalid time signature: ${beatsPerMeasure}/${beatUnit}`);
            }
        }
    }

    function validateTimeSignature(beatsPerMeasure, beatUnit) {
        /* possibleBeatsPerMeasure = Array.from(new Array(64), (x, i) => i + 1); // [1, 2, 3, 4, 5, ..., 64]
        possibleBeatUnits = [1, 2, 4, 8, 16, 32, 64]; */

        // Using up to max 16 beats and notes for now
        const possibleBeatsPerMeasure = Array.from(new Array(16), (x, i) => i + 1); // [1, 2, 3, 4, 5, ..., 16]
        const possibleBeatUnits = [1, 2, 4, 8, 16];
        
        return possibleBeatsPerMeasure.includes(beatsPerMeasure) && possibleBeatUnits.includes(beatUnit);
    }


    /* Constants */
    /* Number of min supported notes (16th note) equivalent to other note unit values 
    E.g. 1 whole note = 16 16th notes
    */
    const noteUnitMinEquivalents = {
        whole: 16,
        half: 8,
        quarter: 4,
        eighth: 2,
        sixteenth: 1
    }

    /* Number of notes needed to make up a whole note
    E.g. 16 16th notes = 1 whole note
    */
    const noteUnitMaxEquivalents = {
        whole: 1,
        half: 2,
        quarter: 4,
        eighth: 8,
        sixteenth: 16
    }

    const noteDirection = {
        B3: {
            stemDownwards: false,
            line: {
                start: "end",
                numOfLines: 1
            }
        },
        C4: {
            stemDownwards: false,
            line: {
                start: "middle",
                numOfLines: 1
            }
        },
        D4: {
            stemDownwards: false,
            line: null
        },
        E4: {
            stemDownwards: false,
            line: null
        },
        F4: {
            stemDownwards: false,
            line: null
        },
        G4: {
            stemDownwards: false,
            line: null
        },
        A4: {
            stemDownwards: false,
            line: null
        },
        B4: {
            stemDownwards: true,
            line: null
        },
        C5: {
            stemDownwards: true,
            line: null
        },
        D5: {
            stemDownwards: true,
            line: null
        },
        E5: {
            stemDownwards: true,
            line: null
        },
        F5: {
            stemDownwards: true,
            line: null
        },
        G5: {
            stemDownwards: true,
            line: null
        },
        A5: {
            stemDownwards: true,
            line: {
                start: "middle",
                numOfLines: 1
            }
        },
        B5: {
            stemDownwards: true,
            line: {
                start: "end",
                numOfLines: 1
            }
        }
    }
    
    
    const noteShapeByUnit = {
        note: {
            whole: {
                image: "src/static/note-whole.png",
                line: {
                    end: "src/static/note-whole-line-top.png",
                    middle: "src/static/note-whole-line-middle.png"
                }
            },
            half: {
                image: "src/static/note-half.png"
            },
            quarter: {
                image: "src/static/note-quarter.png"
            },
            eighth: {
                image: "src/static/note-eighth.png",
                stemDownwards: "src/static/note-eighth-down.png"
            },
            sixteenth: {
                image: "src/static/note-sixteenth.png",
                stemDownwards: "src/static/note-sixteenth-down.png"
            }
        },
        rest: {
            whole: {
                image: "src/static/rest-whole.png",
            },
            half: {
                image: "src/static/rest-half.png"
            },
            quarter: {
                image: "src/static/rest-quarter.png"
            },
            eighth: {
                image: "src/static/rest-eighth.png",
            },
            sixteenth: {
                image: "src/static/rest-sixteenth.png",
            }
        }
    }
    
    const noteShapeLineComponent = {
        end: "src/static/note-line-top.png",
        middle: "src/static/note-line-middle.png"
    }
    
    const noteShapeDotComponent = "src/static/note-dot.png"

    global.MuseStaff = global.MuseStaff || MuseStaff
    global.Note = global.Note || Note
    global.Rest = global.Rest || Rest

})(window);