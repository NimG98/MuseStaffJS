# js-library-gillnimr

MuseStaffJS Landing Page: https://calm-coast-64479.herokuapp.com/examples.html

MuseStaffJS Documentation: https://calm-coast-64479.herokuapp.com/docs/museStaffDoc1/

# Getting Started

## Library

View the latest release of [MuseStaffJS](https://github.com/csc309-summer-2020/js-library-gillnimr).

## Loading the modules

Load `MuseStaff.js` into your HTML with a `<script>` tag:

```
<script type="text/javascript" src='MuseStaff.js'></script>
```

Make sure to include css stylesheet as well:

```
<link rel="stylesheet" type="text/css" href="MuseStaff.css">
```


## Done

Now you can call the API methods on the `MuseStaff` object!

```
const staff = new MuseStaff();
staff.addMeasure();
document.querySelector("body").appendChild(staff.staff)
```
