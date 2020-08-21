---
id: measureDoc
title: Measure
sidebar_label: Measure
---

## Constructor

Creates a new `Measure` object with a default set of Rest notes, based on the time signature.\
If `Measure.editable` is true, the pointer is set to the note at the beginning of the Measure.

### Syntax

<div class="constructorText">Measure(<em>timeSignature</em>)</div>


### Parameters

| Parameter | Description | Required | 
| --- | --- | --- |
| <em>timeSignature</em> | [TimeSignature](timeSigDoc.html) for the measure. Comes from the time signature of the [MuseStaff](museStaffDoc1) object that the measure is a part of. | Required | 

## Options

| Property | Default | Type | Description |
| --- | --- | --- | --- |
| <strong class="docsClassOptionNames">notes</strong>  | [ ] | Array[[Note](noteDoc.html)] | The [Note](noteDoc.html) objects, i.e. the musical notes that are within this Measure |
| <strong class="docsClassOptionNames">timeSig</strong> | `TimeSignature(4,4)` | [TimeSignature](timeSigDoc.html) | Time signature of the measure. Comes from the time signature of the [MuseStaff](museStaffDoc1) object that the measure is a part of. |
| <strong class="docsClassOptionNames">measure</strong> | null | `<table class="museMeasure">` | The measure display element (which is a `<table>` element) |
| <strong class="docsClassOptionNames">editable</strong> | false | boolean | If the measure is in "edit-mode", where you can dynamically click the measure to add notes. Comes from the `editable` property of the [MuseStaff](museStaffDoc1) object that the measure is a part of. |
| <strong class="docsClassOptionNames">pointer</strong> | {`visible`: false, `position`: null} | {`visible`: boolean, `position`: indexNumber}  | If the measure is editable, any note on the measure can be clicked and the pointer points at that note. When `Measure.editable` is true, `pointer.visible` might be true if this measure is the current measure that the pointer is being pointed on out of all the staff's measures. `pointer.position` is the index of the currently pointed at note in `Measure.notes`.  |
