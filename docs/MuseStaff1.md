---
id: museStaffDoc1
title: MuseStaff
sidebar_label: Initialization
---

## Constructor

Creates a new `MuseStaff` object.

### Syntax

<div class="constructorText">MuseStaff(<em>timeSignature</em>)</div>


### Parameters

| Parameter | Description | Required | 
| --- | --- | --- |
| <em>timeSignature</em> | String format of time signature (e.g. "3/4"). If not provided, the default time signature "4/4" is used. | Optional | 

## Options

All the global options available.

| Property | Default | Type | Description |
| --- | --- | --- | --- |
| <strong class="docsClassOptionNames">timeSig</strong>  | `TimeSignature(4,4)` | [TimeSignature](/docs/timeSigDoc) | The time signature for the staff. Restricts the number and size of notes allowed in each measure of the staff.|
| <strong class="docsClassOptionNames">editable</strong> | false | boolean | If the staff is in "edit-mode", where you can dynamically click the staff to add notes.|
| <strong class="docsClassOptionNames">measures</strong> | [ ] | Array[[Measure](/docs/measureDoc)] | Array of all the measures in the staff. The order of the [Measure](/docs/measureDoc) objects correspond to the order of the measures displayed in the staff. |
| <strong class="docsClassOptionNames">measurePointedOn</strong> | null | [Measure](/docs/measureDoc) | If the staff is editable, the staff has a reference to which measure and note the pointer is positioned at. |
| <strong class="docsClassOptionNames">staff</strong> | null | `<div class="museStaff">` | The staff display element. |
| <strong class="docsClassOptionNames">insertNoteType</strong> | "quarter" | String | The unit type of the current note that is selected to be inserted while in "edit-mode". `MuseStaff.insertNoteType` can be one of the following: "whole", "half", "quarter", "eighth", "sixteenth". |

## Displaying MuseStaff on the front-end

`MuseStaff.staff` would be the element that you would add to your DOM.
For example, after creating a `MuseStaff`, for it to display on the screen, you can append `MuseStaff.staff` to the body of an html page:
```
const museStaff = new MuseStaff();
museStaff.addMeasure();

// Body element in html
const body = document.querySelector("body")
body.appendChild(museStaff.staff)
```