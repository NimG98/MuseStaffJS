/* 
    Time Signature Examples 
*/

/* Example 1 */
const example1 = document.querySelector(".exampleTimeSig1");
const staff = new MuseStaff();
staff.addMeasure();
example1.appendChild(staff.staff)

/* Example 2 */
const example2 = document.querySelector(".exampleTimeSig2");
const staff2 = new MuseStaff("3/8");
staff2.addMeasure();
example2.appendChild(staff2.staff)

/* Example 3 */
const example3 = document.querySelector(".exampleSetNotes");
const staff3 = new MuseStaff("5/4");
const notes = [new Note("F4", "quarter"), new Note("D5", "sixteenth"), new Note("A5", "half"), new Note("B3", "quarter"), new Rest("eighth"), new Note("B4", "whole")]
// const notes = [new Note("F4", "quarter"), new Note("D5", "sixteenth"), new Note("A5", "half"), new Note("B3", "quarter"), new Note("B4", "sixteenth"), new Note("B4", "sixteenth")]
// const notes = [new Note("F4", "whole"), new Note("D5", "half"), new Note("F4", "quarter"), new Note("B4", "sixteenth"), new Rest("eighth")]
staff3.setNotes(notes);
// staff3.setEditable(true);
example3.appendChild(staff3.staff);

/* Example 4 */
const example4 = document.querySelector(".exampleEditAddMeasure1");
var staff4 = new MuseStaff();
staff4.setEditable(true);
staff4.addMeasure();
staff4.addMeasure();
example4.appendChild(staff4.staff);

const example4Button = document.querySelector(".buttonAddNewMeasure");
var example4ButtonClicked = false;
example4Button.addEventListener("click", function(e) {
    if(example4ButtonClicked){
        alert("For this example, the purpose is to display the location of the pointer on the last added measure. Resetting...")
        example4.removeChild(example4.firstChild);
        staff4 = new MuseStaff();
        staff4.setEditable(true);
        staff4.addMeasure();
        staff4.addMeasure();
        example4.appendChild(staff4.staff);
        example4ButtonClicked=false;
    } else {
        staff4.addMeasure();
        example4ButtonClicked = true;
    }
})

/* Example 5 */
const example5 = document.querySelector(".exampleEditAddMeasure2");
var staff5 = new MuseStaff();
staff5.addMeasure();
staff5.addMeasure();
staff5.setEditable(true);
example5.appendChild(staff5.staff);

/* Example 6 */
const example6 = document.querySelector(".exampleInsertNotes1");
var staff6 = new MuseStaff("6/4");
staff6.addMeasure();
staff6.addMeasure();
staff6.setEditable(true);
example6.appendChild(staff6.staff);

/* Example 7 */
const example7 = document.querySelector(".exampleInsertNotes2");
var staff7 = new MuseStaff("2/2");
staff7.setEditable(true);
staff7.addMeasure();
example7.appendChild(staff7.staff);


/* Example 8 */
const example8 = document.querySelector(".exampleOverflow1");
var staff8 = new MuseStaff("5/4");
staff8.setEditable(true);
staff8.addMeasure();
example8.appendChild(staff8.staff);

/* Example 9 */
const example9 = document.querySelector(".exampleOverflow2");
var staff9 = new MuseStaff("2/16");
staff9.setEditable(true);
staff9.addMeasure();
example9.appendChild(staff9.staff);

