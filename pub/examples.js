"use strict";
const body = document.querySelector('body')


const staff = new MuseStaff();
// staff.setEditable(true);
staff.addMeasure();
staff.addMeasure();
staff.addMeasure();
staff.setEditable(true);
// staff.setEditable(false);
// staff.setEditable(true);
body.appendChild(staff.staff);


const staff2 = new MuseStaff("2/16");
staff2.setEditable(true);
staff2.addMeasure();
staff2.addMeasure();
staff2.addMeasure();
body.appendChild(staff2.staff);


const staff3 = new MuseStaff("5/4");
const notes = [new Note("F4", "quarter"), new Note("D5", "sixteenth"), new Note("A5", "half"), new Note("B3", "quarter"), new Rest("eighth"), new Note("B4", "whole")]
// const notes = [new Note("F4", "quarter"), new Note("D5", "sixteenth"), new Note("A5", "half"), new Note("B3", "quarter"), new Note("B4", "sixteenth"), new Note("B4", "sixteenth")]
// const notes = [new Note("F4", "whole"), new Note("D5", "half"), new Note("F4", "quarter"), new Note("B4", "sixteenth"), new Rest("eighth")]

staff3.setNotes(notes);
// staff3.setEditable(true);
body.appendChild(staff3.staff);


const staff4 = new MuseStaff();
staff4.addMeasure();
staff4.setEditable(true);

body.appendChild(staff4.staff);