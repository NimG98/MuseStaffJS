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
    eigh6th: 8,
    sixteenth: 16
}


/* Mapping of treble to bass cleff notes */
/* const trebleToBassNotes = {
    B3:
    C4:
    D4:
    E4:
    F4:
    G4:
    A4:
    B4:
    C5:
    D5:
    E5:
    F5:
    G5:
    A5: 
    B5: 
} */