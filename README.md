# MuseStaffJS 

## Overview

MuseStaffJS is a front-end JavaScript library for displaying and modifying musical staves. 

![](captured.gif)

## Documentation and Examples
**Landing Page**: https://mighty-hollows-85822.herokuapp.com \
**Documentation**: https://mighty-hollows-85822.herokuapp.com/docs/museStaffDoc1 \
**Example Usage**: https://mighty-hollows-85822.herokuapp.com/docs/examples.html

Site was created using [Docusaurus](https://docusaurus.io/).

# Getting Started

## Loading the modules

Load `MuseStaff.js` into your HTML with a `<script>` tag:

```
<script type="text/javascript" src='MuseStaff.js'></script>
```

Make sure to include the css stylesheet as well:

```
<link rel="stylesheet" type="text/css" href="MuseStaff.css">
```


## Done

Now you can call the API methods on the `MuseStaff` object!

```
const museStaff = new MuseStaff();
museStaff.addMeasure();
document.querySelector("body").appendChild(museStaff.staff)
```
