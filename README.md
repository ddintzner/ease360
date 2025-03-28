ease360°
------------

[1]: <https://github.com/dintzner/ease360>

_A modern js framework for silky smooth 360°s._

#### Description

ease360° is a 360 degree image spin sequencer, designed for a better feel. Utilizing HTML 5 canvas and javascript, ease360° offers greater performance and control than previous methods. Responsive layouts, retina images, event handling and smart preloading are all supported. Basic setup only requires 3 parameters, but you can do much more. 

#### Features include

-Physics based solution for 360 spin

-Responsive design options 

-Modern HTML 5 canvas implentation

-Multiple callbacks and animation methods

-Mobile and tablet support

-Retina/HighDPI support


#### Repo

github:
[https://github.com/ddintzner/ease360](https://github.com/ddintzner/ease360)


#### Updates
**03/28/2025 : 0.2.75**
Declaring a responsive set of images has been updated. Do not declare an image set, width or height outside the responsive setting, all image sets should be within the responsive array (see example below). 
New 'changeFramesResponsive()' for frame updates on a responsive sets. The physics control of 'damping' is now a setting. 

**03/22/2025 : 0.2.7**
New 'backgroundSize' settings 'cover-center' and 'cover-top'. 

**11/8/2024 : 0.2.65**
Updated 'changeFrames' event to wait until engine has stopped before updating image set. 

**11/8/2024 : 0.2.6**
Enchancement for 'changeFrames' event with preloadSmart = true.  When 'changeFrames' event is triggered, the current angle will be loaded in first.  Also will carry over preloadSmart feature over to the new set of images.

**11/8/2024 : 0.2.5**
Fixed 'changeFrames' event - 2nd set not loading with preloadSmart = true

**2/23/2024 : 0.2.4**
Fixed issue with 'preloadSmart' not rendering additional canvas frames.

**3/5/2020 :**
If you add retina set to a breakpoint, you are no longer required to include a retina set images for all breakpoints. You can now mix and match what breakpoints you want to include a retina set (framesHighDPI).

**3/3/2020 :**
Fixed 'startAngle' issue. Now initial interaction starts at the defined angle. No longer resets back to angle 0.

**11/11/2019 :**
Setting 'transparencySupport' is added.  Default is 'true', clears canvas before drawing new image.

**11/01/2019 :**
Transparent png support

**04/16/2019 :**
Updated ease360.js and ease360.min.js, replaced '.selector' -deprecated/removed from jquery
To view complete replacement update, reference commit : https://github.com/ddintzner/ease360/commit/ae2df3a4bf4a923b2a7d0296438cda61848c3d27


#### Usage

Jquery +1.7 is required, and needs to be declared before ease360 js.

Example:

```html
    <script type="text/javascript" src="//code.jquery.com/jquery-1.7.0.min.js"/></script/>
    <script type="text/javascript" src="js/ease360.min.js"/></script/>
```
Define and call your ease360° variable.

```html
    var myEase360 = $('#el').ease360(options);
```


### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
frames | array	| null	| A list of string paths of ordered frames - required
width | int | null | Pixel width dimension of the source frames - required
height | int | null | Pixel height dimension of the source frames - required
framesHighDPI | array  | - | This is a list of ordered string paths, twice the dimensions size as the frames array.  Also known as "retina" frames.
frameDirection | int  | 1 | Set -1 to reverse the frames array sequence.
backgroundSize | enum | 'stretch' | "stretch" will size your images to the element provided.  "cover" renders the frame at the largest size contained within, or covering, the background positioning area. "cover-center" combines the features of "cover" with centering.  "cover-top" combines the "cover" option while pinning the render to the top of the canvas.
backgroundOffsetY | float | '0px' | Pixel offset in y dimension when backgroundSize is set to "cover".
backgroundOffsetX | float |  '0px' | Pixel offset in x dimension when backgroundSize is set to "cover".
preloadSmart | boolean | false | When setting to "true", every other frame will load, resulting in 50% of the entire set. The rest of set will load and become active upon user initiation. If set to true, the frames array is required to be an even length.
flex | array | {'w' : false} | Set to true when the element is a percentage based width.  Ex: {'w' : true} will create a 'flex' Ease360.
touchdirection | enum | 'left-right' | 'left-right' captures users drag/touch horizontally.  'up-down' captures users drag/touch vertically. 
responsive | array | - | Provided set of breakpoints and their options. "breakpoint" parameter required when declaring set. See Below.
breakpoint | int |  - | The max value where the breakpoint feature set will stop. Needs to be set in the responsive array, when responsive is declared.
transparencySupport | boolean |  true | Clears the canvas before drawing new sequence image.  Set to 'false' for legacy support. 
damping | float | 0.95  | Physics setting with a value between 0.85 - 0.98 will create an effect from very firm to very fluid. A value of 1.0 will create a nonstop spin. setter-getter

### Properties

Option | Type | Default | Description
------ | ---- | ------- | -----------
angle() | int	| -	| Returns the current angle. Values can be 0-359. getter
progress | float	| 0	| Returns a 0-1 value on the loading progress of the provided frame set. getter


### Methods/Events

Method | Parameters | Default | Description
------ | ---------- | ------- | -----------
angle(angle) | int | - | Sets angle position if  argument is provided. setter
angleTo(angle, time) | int, float(optional)	|0, 1.0	| Animates sequence to angle. Duration is 1s unless provided.
angleStep(angle) | int	|0 | Sets angle position.
spinOver(speed) | float | 1.0 | Creates a continous play thru on frame set. Speed parameter can be positive or negative. Designed to be used as a rollover effect. 
spinOut() | none | - | Used to cancel SpinOver() method.
changeFrame()  |  array, array (required) | - | updates the frames with a provided set. *If ease360 was initialized with framesHighDPI, then a 2nd array for highDPI is required.
changeFramesResponsive() |  array (required) | - | if initialized ease360 with responsive sets, then use changeFramesResponsive() over changeFrame() to update frames. The array needs to include each breakpoint set of frames in the same order as the initialization.

### Callbacks

Method | Description
------ |  -----------
progressUpdate | Triggered on change to the progress property.
angleUpdate | Triggered on change to the angle property.
responsiveUpdate | Triggered on change to the responsive set used.
stateUpdate | Triggered on change to the engine status. Values are "init", "start", "active" and "stop".

### Basic  Example

The below is an example on a basic initialization.

```javascript
	
"use strict";
	
   var myEase360;  // define ease360  variable
   var greenTeapot = ["teapot_0.jpg", 
    				  "teapot_1.jpg", 
    				  "teapot_2.jpg",
    				  // thru -- >
					  "teapot_35.jpg"]

	$(function() { 
		
		   myEase360 = $('#myEase360').ease360({
		        frames: greenTeapot,  
		        width : 540,  // source image width
		        height: 540  // source image height
	       });
		
	});
		

```


### Responsive  Example with Callbacks

The below is an example on using the changeFramesResponsive() method for changing responsive image sets. 

```javascript

"use strict";

var myEase360; 

//Gray set
var vehicleframesTucsonGray1440 = [];
var vehicleframesTucsonGray1024 = [];
var vehicleframesTucsonGray640  = [];
var vehicleframesTucsonGray534  = [];

//Red set
var vehicleframesTucsonRed1440 = [];
var vehicleframesTucsonRed1024 = [];
var vehicleframesTucsonRed640  = [];
var vehicleframesTucsonRed534  = [];

//White set
var vehicleframesTucsonWhite1440 = [];
var vehicleframesTucsonWhite1024 = [];
var vehicleframesTucsonWhite640  = [];
var vehicleframesTucsonWhite534  = [];

//The Current Set
var vehicleframesTucson1440 = [];
var vehicleframesTucson1024 = [];
var vehicleframesTucson640  = [];
var vehicleframesTucson534  = [];


for(let i = 1; i <= 36; i++){

  vehicleframesTucsonGray1440.push("./image/hyundai/2025-tucson-hev-blue-awd-amazon-gray-pearl-" +  ('000' + i).slice(-3) + "?wid=1440&fmt=webp-alpha");
  vehicleframesTucsonGray1024.push("./image/hyundai/2025-tucson-hev-blue-awd-amazon-gray-pearl-" +  ('000' + i).slice(-3) + "?wid=1024&fmt=webp-alpha");
  vehicleframesTucsonGray640.push("./image/hyundai/2025-tucson-hev-blue-awd-amazon-gray-pearl-" +  ('000' + i).slice(-3) + "?wid=640&fmt=webp-alpha");
  vehicleframesTucsonGray534.push("./image/hyundai/2025-tucson-hev-blue-awd-amazon-gray-pearl-" +  ('000' + i).slice(-3) + "?wid=534&fmt=webp-alpha");

  vehicleframesTucsonRed1440.push("./image/hyundai/2025-tucson-hev-blue-awd-ultimate-red-" +  ('000' + i).slice(-3) + "?wid=1440&fmt=webp-alpha");
  vehicleframesTucsonRed1024.push("./image/hyundai/2025-tucson-hev-blue-awd-ultimate-red-" +  ('000' + i).slice(-3) + "?wid=1024&fmt=webp-alpha");
  vehicleframesTucsonRed640.push("./image/hyundai/2025-tucson-hev-blue-awd-ultimate-red-" +  ('000' + i).slice(-3) + "?wid=640&fmt=webp-alpha");
  vehicleframesTucsonRed534.push("./image/hyundai/2025-tucson-hev-blue-awd-ultimate-red-" +  ('000' + i).slice(-3) + "?wid=534&fmt=webp-alpha");

  vehicleframesTucsonWhite1440.push("./image/hyundai/2025-tucson-hev-blue-awd-creamy-white-pearl-" +  ('000' + i).slice(-3) + "?wid=1440&fmt=webp-alpha");
  vehicleframesTucsonWhite1024.push("./image/hyundai/2025-tucson-hev-blue-awd-creamy-white-pearl-" +  ('000' + i).slice(-3) + "?wid=1024&fmt=webp-alpha");
  vehicleframesTucsonWhite640.push("./image/hyundai/2025-tucson-hev-blue-awd-creamy-white-pearl-" +  ('000' + i).slice(-3) + "?wid=640&fmt=webp-alpha");
  vehicleframesTucsonWhite534.push("./image/hyundai/2025-tucson-hev-blue-awd-creamy-white-pearl-" +  ('000' + i).slice(-3) + "?wid=534&fmt=webp-alpha");

}

vehicleframesTucson1440 = vehicleframesTucsonSilver1440;
vehicleframesTucson1024 = vehicleframesTucsonSilver1024; 
vehicleframesTucson640 = vehicleframesTucsonSilver640;
vehicleframesTucson534 = vehicleframesTucsonSilver534;

$(function() { 
      
    myEase360 = $('#myEase360').ease360({
    backgroundSize: "cover-center", 
    preloadSmart : false,  // we don't want to preload the images for this
    startAngle: 60, // angle, not frame where we want to start, it needs to be included in the imagesource set
    damping :  0.925,
    responsive:  [
      {
        breakpoint: 1440,  // 1440 below and above
        frames: vehicleframesTucson1440, 
        flex : {"w" :  true}, 
        width : 1440, // width of the source file set at 1440
        height: 722   // height of the source file set at 1440
      }, 
      {
        breakpoint: 1024,  //  below 1024
        frames: vehicleframesTucson1024, 
        flex : {"w" :  true}, 
        width : 1024,  // width of the source file set at 1024
        height: 534    // height of the source file set at 1024
      }, 
      {
        breakpoint: 640,  //  below 640
        frames: vehicleframesTucson640,
        flex : {"w" :  true},  
        width : 640,   // width of the source file set at 640
        height: 360    // height of the source file set at 640
      }, 
      {
        breakpoint: 534,  //  below 534
        frames: vehicleframesTucson534,
        flex : {"w" :  true},  
        width : 534,   // width of the source file set at 534
        height: 301    // height of the source file set at 534
      }
    ],
    progressUpdate: function() { myProgress(); },
    responsiveUpdate: function() { myResponsiveUpdate(); }
  });


     
    function changeColor(c) {

      if(c == "gray") {
        vehicleframesTucson1440 = vehicleframesTucsonGray1440;
        vehicleframesTucson1024 = vehicleframesTucsonGray1024; 
        vehicleframesTucson640 = vehicleframesTucsonGray640;
        vehicleframesTucson534 = vehicleframesTucsonGray534;

      }
      if(c == "red"){
        vehicleframesTucson1440 = vehicleframesTucsonRed1440;
        vehicleframesTucson1024 = vehicleframesTucsonRed1024; 
        vehicleframesTucson640 = vehicleframesTucsonRed640;
        vehicleframesTucson534 = vehicleframesTucsonRed534;

      }

      if(c == "white"){
        vehicleframesTucson1440 = vehicleframesTucsonWhitel1440;
        vehicleframesTucson1024 = vehicleframesTucsonWhite1024; 
        vehicleframesTucson640 = vehicleframesTucsonWhite640;
        vehicleframesTucson534 = vehicleframesTucsonWhite534;

      }

      //the amount and order of the array being passed should be the same as the 'responsive' in the initialization of the ease360
      myEase360.changeFramesResponsive([vehicleframesTucson1440, vehicleframesTucson1024, vehicleframesTucson640, vehicleframesTucson534]);
            
    }


```

#### Browser support

ease360° works on IE8+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

jQuery 1.7

#### License

Copyright (c) 2016 Derek Dintzner

Licensed under the MIT license.


