"use strict";

const staff = new MuseStaff();
// staff.setEditable(true);
staff.addMeasure();
staff.addMeasure();
staff.addMeasure();
staff.setEditable(true);
const body = document.querySelector('body')
body.appendChild(staff.staff);


const staff2 = new MuseStaff("2/16");
staff2.setEditable(true);
staff2.addMeasure();
staff2.addMeasure();
staff2.addMeasure();
body.appendChild(staff2.staff);

