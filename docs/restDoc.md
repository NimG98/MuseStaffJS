---
id: restDoc
title: Rest
sidebar_label: Rest
---

## Constructor

Creates a new `Rest` note object. The `Rest` object calls the `Note` object with the `noteValue` set as "rest", instead of a pitch value.
All of the other functionality is the same between the `Rest` and `Note` objects. 

### Syntax

***class Rest extends Note***

<div class="constructorText">
    Rest(<em>noteUnit, dotted=false</em>)
</div>


### Parameters

| Parameter | Description | Required | 
| --- | --- | --- |
| <em>noteUnit</em> | Musical rest unit duration.  | Required | 
| <em>dotted</em> | If the rest is to be dotted (i.e. 1.5 times the noteUnit)  | Optional |

## Options

| Property | Default | Type | Description |
| --- | --- | --- | --- |
| <strong class="docsClassOptionNames">noteUnit</strong>  | received from `noteUnit` parameter in constructor | String | The rest note's unit duration (e.g. "quarter" rest). The current supported rest note units are "whole", "half", "quarter", "eighth", and "sixteenth". |
| <strong class="docsClassOptionNames">noteType</strong>  | "rest" | String | The noteType for a rest note is "rest". |
| <strong class="docsClassOptionNames">dotted</strong>  | false | boolean | If the rest note is to be dotted (i.e. 1.5 times the noteUnit). <span style="color:red">*Note:*</span> not yet properly supported in library. |
