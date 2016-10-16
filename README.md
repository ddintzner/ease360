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


#### Demo

website:
[http://ease360.io/](http://ease360.io/)

github:
[https://github.com/ddintzner/ease360](https://github.com/ddintzner/ease360)


### Usage

Jquery +1.7 is required, and needs to be declared before ease360 js.

Example:

```html
    <script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"/></script/>
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
width | int | null | Pixel width dimension of the provided frames - required
height | int | null | Pixel height dimension of the provided frames - required
framesHighDPI | array  | - | This is a list of ordered string paths, twice the dimensions size as the frames array.  Also known as "retina" frames.
backgroundSize | enum | 'stretch' | "stretch" will size your images to the element provided.  "cover" renders the frame at the largest size contained within, or covering, the background positioning area.
backgroundOffsetY | float | '0px' | Pixel offset in y dimension when backgroundSize is set to "cover".
backgroundOffsetX | float |  '0px' | Pixel offset in x dimension when backgroundSize is set to "cover".
preloadSmart | boolean | false | When setting to "true", every other frame will load, resulting in 50% of the entire set. The rest of set will load and become active upon user initiation. If set to true, the frames array is required to be an even length.
flex | array | {'w' : false} | Set to true when the element is a percentage based width.  Ex: {'w' : true} will create a 'flex' Ease360.
touchdirection | enum | 'left-right' | 'left-right' captures users drag/touch horizontally.  'up-down' captures users drag/touch vertically. 
responsive | array | - | Provided set of breakpoints and their options. "breakpoint" parameter required when declaring set. See Below.
breakpoint | int |  - | The max value where the breakpoint feature set will stop. Needs to be set in the responsive array, when responsive is declared.


### Properties

Option | Type | Default | Description
------ | ---- | ------- | -----------
timeline.angle | int	| 0	| Returns the current angle. Values can be 0-359. getter
progress | float	| 0	| Returns a 0-1 value on the loading progress of the provided frame set. getter
physics.damping | float	| 0.95	| Setting a value between 0.85 - 0.98 will create an effect from very firm to very fluid. A value of 1.0 will create a nonstop spin. setter-getter


### Methods/Events

Method | Parameters | Default | Description
------ | ---- | ------- | -----------
angleTo(angle, time) | int, float(optional)	|0, 1.0	| Animates sequence to angle. Duration is 1s unless provided.
angleStep(angle) | int	|0 | Sets angle position.
angleStep(angle) | int	|0 | Sets angle position.


### Callbacks

Method | Description
------ |  -----------
progressUpdate | Triggered on change to the progress property.
angleUpdate | Triggered on change to the angle property.
responsiveUpdate | Triggered on change to the responsive set used.
stateUpdate | Triggered on change to the engine status. Values are "init", "start", "active" and "stop".

### Basic  Example

The below  is an excerpt from the ease360 example page http://ease360.io/examples/ease360-ex1.html

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
		        width : 540,  
		        height: 540
	       });
		
	});
		

```


### Responsive  Example with Callbacks

The below  is an excerpt from the ease360 example page http://ease360.io/examples/ease360-ex3.html

```javascript

"use strict";

    var myEase360;  // define variable
    
    var greenTeapot = [];
    var greenTeapotRetina = [];
    var pathgr = "./images/teapot_green_36/";
          
    for(var i = 0; i < 36; i++){
          greenTeapot.push(pathgr + "teapot_" + i + ".jpg");
          greenTeapotRetina.push(pathgr + "teapot_" + i + "@2x.jpg");
    }

    var orangeTeapot = [];
    var orangeTeapotRetina = [];
    var pathor = "./images/teapot_orange_360/";
         
    for(var i = 0; i < 360; i+=5){
        orangeTeapot.push(pathor + "teapot_" + i + ".jpg");
        orangeTeapotRetina.push(pathor + "teapot_" + i + "@2x.jpg");
    }
        
   var blueTeapot = [];
   var blueTeapotRetina = [];
   var pathbl = "./images/teapot_blue_36/";
        
    for(var i = 0; i < 36; i++){
        blueTeapot.push(pathbl + "teapot_" + i + ".jpg");
        blueTeapotRetina.push(pathbl + "teapot_" + i + "@2x.jpg");
    }

    $(function() { 
        
           myEase360 = $('#myEase360').ease360({
                frames: orangeTeapot,  //required
                framesHighDPI: orangeTeapotRetina,
                width : 540,   //required
                height: 540,   //required
                backgroundSize: "cover",  
                backgroundOffsetY: 10,
                responsive : [
                 {
                        breakpoint: 1280,  //max width
                        frames: greenTeapot, 
                        framesHighDPI: greenTeapotRetina, 
                        width : 540,  
                        height: 540,  
                        backgroundOffsetY: 10,  
                     },   
                    {
                        breakpoint: 1024,  //max width
                        frames: greenTeapot, 
                        framesHighDPI: greenTeapotRetina, 
                        width : 540, 
                        height: 540,  
                        flex : {"w" :  true},  // optional - default false - needed if element is % at breakpoint
                        backgroundOffsetY: -50,  
                     },   
                     {
                        breakpoint: 768,  //max width
                        frames: blueTeapot, 
                        framesHighDPI: blueTeapotRetina, 
                        flex : {"w" :  true},   // optional - default false - needed if element is % at breakpoint
                        width : 540, 
                        height: 540,  
                        backgroundOffsetY: 10, 
                     }
                ],
                
                progressUpdate :function() {  myProgressUpdate(); },  
                angleUpdate : function() {  myAngleUpdate(); },  
                stateUpdate: function() {  myStateUpdate(); },
                responsiveUpdate: function() {  myResponsiveUpdate(); }
         });

    });
    
    var $b, $c, $d, $e, $f;
    $b = $('.info li[data-id="loadingProgress"]') 
    $c = $('.info li[data-id="currentFrame"]') 
    $d = $('.info li[data-id="currentImage"]');
    $e = $('.instructions');     
    $f = $('.info li[data-id="stateUpdate"]');
        
     function myResponsiveUpdate(){
		
		//reset loader properties
		$('#loader').removeClass('opacity0');     
		$('#myEase360 canvas').removeClass('opacity1');    
		$("#loader").css({"z-index" :  1000}); 

    }   
       
    function myProgressUpdate() {

         var v =  Math.floor(myEase360.progress * 100 );
         
         $b.html("framesloaded: " + v  +  "%" );
    	 if( v <= 100 )$('#progress').css('width',   v  + '%');
    	
    	//if we are loaded
    	 if( v == 100 ){

    		 	 $('#loader').delay(1000).queue(function( ){ 
    		 	 	  
    		 	 	 $(this).addClass('opacity0');     
    		 	 	 $('#myEase360 canvas').addClass('opacity1');    
			         $(this).css({"z-index" : 0}); 
			         $('#progress').css('width', '0%');
			         $(this).dequeue();
		         
         		});
    	}
    }
    
    
   function myAngleUpdate() {
         
        if (  myEase360 == null) return;
        
        $c.html("current angle: " +  myEase360.timeline.angle + "°");
        $e.not('.opacity0').addClass('opacity0');

        if(!myEase360.images.length) return;  //if we are on a set that hasnt yet been loaded
        var imagepath = myEase360.images[myEase360.timeline.angle].src;
        var n = imagepath.lastIndexOf("/");
        imagepath = imagepath.substring(n+1, imagepath.length);
        $d.html("current image: " +  imagepath);
         
    }
    

    function myStateUpdate() {
                    
        $f.html("stateUpdate: " + myEase360.states.status);
        $f.removeClass("opacity0").delay(1000).queue(function( ){ 
                            
             $(this).addClass("opacity0");  //helper CSS found on examples.css
             $(this).dequeue();
             
        });

     }
```


