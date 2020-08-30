---
id: timeSigDoc
title: Time Signature
sidebar_label: Time Signature
---

## Constructor

Creates a new `TimeSignature` object. If the parameters `beatsPerMeasure` and `beatUnit` do not make up a valid time signature or a supported time signature, then an error is thrown and the `TimeSignature` object is not created.

The `TimeSignature` object is used by the [MuseStaff](/docs/museStaffDoc1) object to determine the number and unit of notes allowed in one of its measures. The [Measure](/docs/measureDoc) object stores a certain number of notes that can fit in a measure,
based on the time signature. For example, a time signature of "4/4" means that 4
quarter notes can fit in the Measure, but 5 quarter notes cannot for instance.

### Syntax

<div class="constructorText">TimeSignature(<em>beatsPerMeasure, beatUnit</em>)</div>


### Parameters

| Parameter | Description | Required | 
| --- | --- | --- |
| <em>beatsPerMeasure</em> | How many notes of unit `beatUnit` is allowed to fit in one measure | Required | 
| <em>beatUnit</em> | The beat unit size for a measure | Required |


## Options

| Property | Default | Type | Description |
| --- | --- | --- | --- |
| <strong class="docsClassOptionNames">beatsPerMeasure</strong>  | 4 | number | The number of notes (that have note unit value of `beatUnit`) that are specified to be the max for a measure of this time signature. `beatsPerMeasure` can be any number >=1; however, in this library it is restricted to 16. |
| <strong class="docsClassOptionNames">beatUnit</strong>  | 4 | number | The beat unit size of a note, where a `beatsPerMeasure` number of those notes is the maximum allowed in one measure. |