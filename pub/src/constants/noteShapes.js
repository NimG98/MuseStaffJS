const noteDirection = {
    B3: {
        stemDownwards: false,
        line: {
            start: "end",
            numOfLines: 1
        }
    },
    C4: {
        stemDownwards: false,
        line: {
            start: "middle",
            numOfLines: 1
        }
    },
    D4: {
        stemDownwards: false,
        line: null
    },
    E4: {
        stemDownwards: false,
        line: null
    },
    F4: {
        stemDownwards: false,
        line: null
    },
    G4: {
        stemDownwards: false,
        line: null
    },
    A4: {
        stemDownwards: false,
        line: null
    },
    B4: {
        stemDownwards: true,
        line: null
    },
    C5: {
        stemDownwards: true,
        line: null
    },
    D5: {
        stemDownwards: true,
        line: null
    },
    E5: {
        stemDownwards: true,
        line: null
    },
    F5: {
        stemDownwards: true,
        line: null
    },
    G5: {
        stemDownwards: true,
        line: null
    },
    A5: {
        stemDownwards: true,
        line: {
            start: "middle",
            numOfLines: 1
        }
    },
    B5: {
        stemDownwards: true,
        line: {
            start: "end",
            numOfLines: 1
        }
    }
}


const noteShapeByUnit = {
    note: {
        whole: {
            image: "src/static/note-whole.png",
            line: {
                end: "src/static/note-whole-line-top.png",
                middle: "src/static/note-whole-line-middle.png"
            }
        },
        half: {
            image: "src/static/note-half.png"
        },
        quarter: {
            image: "src/static/note-quarter.png"
        },
        eighth: {
            image: "src/static/note-eighth.png",
            stemDownwards: "src/static/note-eighth-down.png"
        },
        sixteenth: {
            image: "src/static/note-sixteenth.png",
            stemDownwards: "src/static/note-sixteenth-down.png"
        }
    },
    rest: {
        whole: {
            image: "src/static/rest-whole.png",
        },
        half: {
            image: "src/static/rest-half.png"
        },
        quarter: {
            image: "src/static/rest-quarter.png"
        },
        eighth: {
            image: "src/static/rest-eighth.png",
        },
        sixteenth: {
            image: "src/static/rest-sixteenth.png",
        }
    }
}

const noteShapeLineComponent = {
    end: "src/static/note-line-top.png",
    middle: "src/static/note-line-middle.png"
}

const noteShapeDotComponent = "src/static/note-dot.png"