MuseStaffJS Landing Page: https://calm-coast-64479.herokuapp.com/

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
