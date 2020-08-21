---
id: museStaffDoc2
title: MuseStaff
sidebar_label: Methods
---

## Methods

### <span class="docsMethodNameTitle">addMeasure</span>

Creates a new [Measure](measureDoc.html) and adds it to the staff. If *`measureIndex`* is provided, insert the measure into the staff at that index. Otherwise, insert the measure at the end of the staff.

#### Syntax

<div class="docsMethodNameText">addMeasure(<em>measureIndex</em>)</div>


#### Parameters

| Parameter | Description | Required | 
| --- | --- | --- | 
| <em>measureIndex</em> | Index to insert [Measure](measureDoc.html) object into `MuseStaff.measures` | Optional | 


### <span class="docsMethodNameTitle">setNotes</span>

Set the staff's notes to be the ones provided in the array of [Note](noteDoc.html) objects, `notes`.
If the staff is not empty (i.e. filled with notes beforehand), then the staff is emptied before setting the staff's notes to the ones in `notes`. 

#### Syntax

<div class="docsMethodNameText">setNotes(<em>notes</em>)</div>


#### Parameters

| Parameter | Description | Required | 
| --- | --- | --- | 
| <em>notes</em> | Array of [Note](noteDoc.html) objects to be placed in the staff. | Required | 

### <span class="docsMethodNameTitle">setEditable</span>

Set the staff to be editable or not.
If the staff is editable, (i.e. in "edit-mode"), the staff can be clicked to insert and modify notes.
Otherwise, the staff just displays the current notes in the staff's [Measure](measureDoc.html) objects.

#### Syntax

<div class="docsMethodNameText">setEditable(<em>editable</em>)</div>


#### Parameters

| Parameter | Description | Required | 
| --- | --- | --- | 
| <em>editable</em> | Boolean indicating if the staff should be editable. | Required | 
