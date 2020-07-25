class MuseStaff {
    constructor() {
        // //this.measures has created Meausre <table> elements from Measure.createMeasure()
        // this.measures = [Measure(), Measure(), Measure()...]
        this.measures = [];
        this.measurePointedOn = null;
    }

    addMeasure(measure) {
        // Add end of measure vertical line to previous measure
        if(this.measures.length > 0) {
            this.measures[this.measures.length-1].rows.map( (tr) => {
                if(!tr.className.includes("museMeasurePointerContainer")) {
                    const lastTdChild = tr.cells[tr.cells.length-1];
                    lastTdChild.setAttribute("class", lastTdChild.className + " endMeasureLine"); 
                }
            })
            // this.measures[this.measures.length-1].querySelectorAll('tr').map( (tr) => {
            // })
        }
        this.measures.push(measure.createMeasure());
        // Move pointer to beginning of newly created measure
        setMeasurePointedOn(this.measures.length-1);

    }

    setMeasurePointedOn(measureIndex) {
        this.measurePointedOn = this.measures[measureIndex];
        this.measurePointedOn
    }

    display() {
        return this.measures;
    }
}