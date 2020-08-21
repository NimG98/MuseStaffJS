"use strict";

const staff = new MuseStaff();
// staff.setEditable(true);
staff.addMeasure();
staff.addMeasure();
staff.addMeasure();
staff.setEditable(true);
staff.display();
const body = document.querySelector('body')
body.appendChild(staff.staff);
