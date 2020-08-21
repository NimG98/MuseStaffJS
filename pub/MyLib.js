/* JS Library */
"use strict";
const { MuseStaff } = require("./src/MuseStaff");

 // always need a semicolon before an IIFE


// import { MuseStaff, clickNoteToAddToMeasure, clickToChangeInsertNoteType, createClefDisplay, createNoteTypeSelectionDisplay, createStaffPropertyDisplay, createTimeSignatureDisplay, displayNoteTdHover, onNoteClick } from "./src/MuseStaff.js";
// import { Measure, getNonHiddenTds, fillRemainingWithRests, fillDefaultMeasure, createMeasure, createEmptyMeasure, getNoteColumnsToTakeUp, calculateNumOfMeasureNoteColumns, pushNoteBackward, pushNoteForward } from "./src/Measure.js";
// import { Note, Rest, getNoteDotImage, getNoteLineImage, checkAllowedNote } from "./src/Note.js";
// import { TimeSignature, validateTimeSignature } from "./src/TimeSignature.js";
// import { noteShapeDotComponent, noteShapeLineComponent, noteShapeByUnit, noteDirection } from "./src/constants/noteShapes.js";
// import { noteUnitMinEquivalents, noteUnitMaxEquivalents } from "./src/constants/notes.js";


(function(global) {

    // let OldStaff = MuseStaff;

    // function MuseStaff(timeSig) {
	// 	this = new OldStaff(timeSig);
    // }
    
    const oldStaff = MuseStaff;

    // let MuseStaff = oldStaff;

    MuseStaff.prototype = {
        "setNotes": oldStaff.setNotes,
        "setEditable": oldStaff.setEditable,
        "addMeasure": oldStaff.addMeasure,
    }

    const oldNote = Note;
    Note.prototype = {
    }

    const oldRest = Rest;
    Rest.prototype = {
    }


    // // private
    // const func1 = () => {
    //     MuseStaff
    // }

    global.MuseStaff = global.MuseStaff || MuseStaff
    global.Note = global.Note || Note
    global.Rest = global.Rest || Rest


})(window);