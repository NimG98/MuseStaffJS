"use strict";

const staff = new MuseStaff();
// staff.setEditable(true);
staff.addMeasure();
staff.addMeasure();
staff.addMeasure();
staff.setEditable(true);
// staff.setEditable(false);
// staff.setEditable(true);


const body = document.querySelector('body')
body.appendChild(staff.staff);


const staff2 = new MuseStaff("2/16");
staff2.setEditable(true);
staff2.addMeasure();
staff2.addMeasure();
staff2.addMeasure();
body.appendChild(staff2.staff);


const staff3 = new MuseStaff("3/4");
const notes = [new Note("F4", "quarter"), new Note("D5", "sixteenth"), new Rest("eighth"), new Note("A5", "half"), new Note("B3", "quarter"), new Note("B4", "whole")]
// staff3.setNotes(notes);
staff3.setEditable(true);
body.appendChild(staff3.staff);

