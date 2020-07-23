export const noteDirection = {
    B3: {
        stemUpwards: true,
        line: "end"
    },
    C4: {
        stemUpwards: true,
        line: "middle"
    },
    D4: {
        stemUpwards: true,
        line: null
    },
    E4: {
        stemUpwards: true,
        line: null
    },
    F4: {
        stemUpwards: true,
        line: null
    },
    G4: {
        stemUpwards: true,
        line: null
    },
    A4: {
        stemUpwards: true,
        line: null
    },
    B4: {
        stemUpwards: false,
        line: null
    },
    C5: {
        stemUpwards: false,
        line: null
    },
    D5: {
        stemUpwards: false,
        line: null
    },
    E5: {
        stemUpwards: false,
        line: null
    },
    F5: {
        stemUpwards: false,
        line: null
    },
    G5: {
        stemUpwards: false,
        line: null
    },
    A5: {
        stemUpwards: false,
        line: "middle"
    },
    B5: {
        stemUpwards: false,
        line: "end"
    }
}


export const noteShapeByUnit = {
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
            stemUpwards: "../static/note-eighth-down.png"
        },
        sixteenth: {
            image: "../static/note-sixteenth.png",
            stemUpwards: "../static/note-sixteenth-down.png"
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