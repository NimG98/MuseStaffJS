/* Time Signature Examples */

const example1 = document.querySelector(".exampleTimeSig1");

const staff = new MuseStaff();
staff.addMeasure();
example1.appendChild(staff.staff)
