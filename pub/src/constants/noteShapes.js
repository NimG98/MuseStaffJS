export const noteDirection = {
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


export const noteShapeByUnitValue = {
    note: {
        whole: {
            image: "../static/note-whole.png",
            line: {
                end: "../static/note-whole-line-top.png",
                middle: "../static/note-whole-line-middle.png"
            }
        },
        half: {
            image: "../static/note-half.png"
        },
        quarter: {
            image: "../static/note-quarter.png"
        },
        eighth: {
            image: "../static/note-eighth.png",
            stemDownwards: "../static/note-eighth-down.png"
        },
        sixteenth: {
            image: "../static/note-sixteenth.png",
            stemDownwards: "../static/note-sixteenth-down.png"
        }
    },
    rest: {
        whole: {
            image: "../static/rest-whole.png",
        },
        half: {
            image: "../static/rest-half.png"
        },
        quarter: {
            image: "../static/rest-quarter.png"
        },
        eighth: {
            image: "../static/rest-eighth.png",
        },
        sixteenth: {
            image: "../static/rest-sixteenth.png",
        }
    }
}

export const noteShapeLineComponent = {
    end: "../static/note-line-top.png",
    middle: "../static/note-line-middle.png"
}

export const noteShapeDotComponent = "../static/note-dot.png"