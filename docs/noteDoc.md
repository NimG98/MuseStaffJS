---
id: noteDoc
title: Note
sidebar_label: Note
---

## Constructor

Creates a new `Note` object, based on the note pitch value and note unit duration. If the passed in values for note pitch value and note unit are not supported in this library, the `Note` object will not be created. After successful creation of the `Note` object, it associates itself
with an image for the specific type of note.

### Syntax

<div class="constructorText">Note(<em>noteValue, noteUnit, dotted=false</em>)</div>


### Parameters

| Parameter | Description | Required | 
| --- | --- | --- |
| <em>noteValue</em> | Musical note pitch value (e.g. "F4"). For rest notes, the `noteValue` parameter is passed as "rest". `Note` will n| Required | 
| <em>noteUnit</em> | Musical note unit duration.  | Required | 
| <em>dotted</em> | If the note is to be dotted (i.e. 1.5 times the noteUnit)  | Optional | 

## Options

| Property | Default | Type | Description |
| --- | --- | --- | --- |
| <strong class="docsClassOptionNames">noteValue</strong>  | received from `noteValue` parameter in constructor | String | The note's musical pitch value (e.g. "F4"). The current supported note values range from "B3" to "B5". For rest notes that don't have pitch value, the `noteValue` property is set to the value "rest". |
| <strong class="docsClassOptionNames">noteUnit</strong>  | received from `noteUnit` parameter in constructor | String | The note's unit duration (e.g. "quarter" note). The current supported note units are "whole", "half", "quarter", "eighth", and "sixteenth" notes. |
| <strong class="docsClassOptionNames">noteType</strong>  | dependent on what's passed into the constructor ("note" or "rest") | String | The type of the note. Either "note" for regular notes with pitch value, or the `noteType` is "rest". |
| <strong class="docsClassOptionNames">dotted</strong>  | false | boolean | If the note is to be dotted (i.e. 1.5 times the noteUnit). <span style="color:red">*Note:*</span> not yet properly supported in library. |
