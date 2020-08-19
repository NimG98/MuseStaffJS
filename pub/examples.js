"use strict";

const staff = new MuseStaff();
// staff.setEditable(true);
staff.addMeasure();
staff.addMeasure();
staff.addMeasure(new Measure());
staff.setEditable(true);
const body = document.querySelector('body')
body.appendChild(staff.display());
