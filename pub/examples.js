"use strict";

const staff = new MuseStaff();
staff.addMeasure(new Measure());
// staff.addMeasure(new Measure());
const body = document.querySelector('body')
body.appendChild(staff.display());
