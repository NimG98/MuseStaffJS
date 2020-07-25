class MuseStaff {
    constructor() {
        // this.measures = [Measure(), Measure(), Measure()...]
        this.measures = [];
        this.measurePointedOn = null;
    }

    addMeasure(measure) {
        // Add end of measure vertical line to previous measure
        if(this.measures.length > 0) {
            this.measures[this.measures.length-1].measure.rows.map( (tr) => {
                if(!tr.className.includes("museMeasurePointerContainer")) {
                    const lastTdChild = tr.cells[tr.cells.length-1];
                    lastTdChild.setAttribute("class", lastTdChild.className + " endMeasureLine"); 
                }
            })
            // this.measures[this.measures.length-1].querySelectorAll('tr').map( (tr) => {
            // })
        }
        this.measures.push(measure);
        // Move pointer to beginning of newly created measure
        this.setMeasurePointedOn(this.measures.length-1);

    }

    setMeasurePointedOn(measureIndex) {
        this.measurePointedOn = this.measures[measureIndex];
        this.measurePointedOn.setPointerPosition(0);
    }

    display() {
        // returns array of Measure <table> elements from Measure.measure
        const measureTableArray = this.measures.map( (measure) => measure.measure );
        const museStaffDiv = document.createElement('div');
        // append Measure <table> elements to MuseStaff div container
        measureTableArray.map( (measureTable) => {
            museStaffDiv.appendChild(measureTable);
        })
        return museStaffDiv;
    }
}