/*

  ____   __   ____  ____     ____   ___   __       __  ____
 (  __) / _\ / ___)(  __)   ( __ \ / __) /  \    _(  )/ ___)
 ) _) /    \\___ \ ) _)     (__  ((  _ \(  0 )_ / \) \\___ \
 (____)\_/\_/(____/(____)   (____/ \___/ \__/(_)\____/(____/

 Version: 0.2.65
 Author: Derek Dintzner
 Company: INNOCEANUSA
 Website: http://ease360js.com


 */

( function(factory) {
		'use strict';     
		if ( typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		} else if ( typeof exports !== 'undefined') {
			module.exports = factory(require('jquery'));
		} else {
			factory(jQuery);
		}

	}(function($) {

		'use strict';

		var Ease360 = window.Ease360 || {};

		Ease360 = ( function() {

				var instanceUid = 0;

				function Ease360(element, settings, selector) {

					var _ = this,
					    dataSettings;

					//set defaults for our initialized defaults

					_.defaults = {

						init : function init() {

							//order of init operations
							this.createProperties(), this.createImagesSet();
							this.buildOut();
						},
						loadcomplete : false,
						totalLoaded : 0,
						totalframes : 360,
						frameDirection : 1, // negative value will reverse the image sequence the user provides on init
						startAngle : 0,
						file : undefined,
						num : 0,
						initialized: false,
						c : false,
						preloadInitial : true,
						transparencySupport : true,
						loadingPosition : 0,
						loadingFramesGoal : 180, //default value based on .5 loading
						backgroundSize : "default", //  same as "stretch" or "cover"
						backgroundOffsetX : 0,
						backgroundOffsetY : 0,
						load : [],
						responsive : [],
						responsiveActive : 0,
						resizeTimer : null,
						images : [],
						width : 0,
						height : 0,
						frames : [],
						framesSetActive : 0,
						framesHighDPI : [],
						canvas : {},
						canvasSettings : {},
						events : {
							// event vars
							startPos : {
								"x" : null,
								"y" : null
							},
							currentPos : {
								"x" : null,
								"y" : null
							},
							prevPos : {
								"x" : null,
								"y" : null
							},
							differencePos : {
								"x" : null,
								"y" : null
							},
							threshold : 2,
							changeFrames : false,
							activatedGestureEvent : false,
							interactStart : false,
							mouseEventInterval : undefined
						},
						eventDirection : "left-right", // or "up-down, "all", "none""
						timeline : {
							angle : 0, // t
							startValue : 0, //b
							endValue : 180, // c
							duration : 0.5, // d --in frames
							durationDefault : 0.5,
							timer : 0,
							difference : undefined,
							activeTween : false,
							directTweenActive : false,
							easeInterval : undefined
						},
						physics : {
							position : 1, //starting position based on 0 - 3600
							speed : 0,
							damping : 0.95,
							acceleration : 0,
							delta_multiplier : 0.8,
							positionCap : 3600
						},
						states : {
							factoring : 1,
							firstInteraction : true,
							destroy : false,
							engine: false,
							status : "init" // "init", "start", 'active", "stop"
						},
						flex : {},
						progress : 0,
						updates : undefined,
						stateUpdate : undefined,
						progressUpdate : undefined,
						angleUpdate : undefined,
						responsiveUpdate : undefined,
						el : selector, // to be filled when created
						loadSet : [],
						currentSet : [],
						increment : undefined,
						
					};

					$.extend(_, _.defaults);

					$.extend(_, settings);

					_.timeline.angle = _.startAngle;
					_.physics.position = _.timeline.angle * 10;

					_.initStart(true);

				}

				return Ease360;

			}());

		Ease360.prototype.initStart = function(creation) {

			var _ = this;

			if (creation) {

				_.createProperties(), _.createImagesSet();
				_.buildOut();
			}
		}

		Ease360.prototype.createProperties = function() {

			//E V E N T S
			var _ = this;

			//responsive : create object
			if (_.responsive.length != 0) {

				for (var i = 0; i < _.responsive.length; i++) {

					if (_.responsive[i].frames == undefined) {
						_.responsive[i].framesReference = true;
						//
						_.responsive[i].frames = _.frames;

					} else {

						_.responsive[i].framesReference = false;
					}

					if (_.responsive[i].framesHighDPI == undefined)
						_.responsive[i].framesHighDPI = _.framesHighDPI;
					if (_.responsive[i].width == undefined)
						_.responsive[i].width = _.width;
					if (_.responsive[i].height == undefined)
						_.responsive[i].height = _.height;
					if (_.responsive[i].flex == undefined)
						_.responsive[i].flex = {
							"w" : false,
							"h" : false
						};
					if (_.responsive[i].backgroundOffsetX == undefined)
						_.responsive[i].backgroundOffsetX = _.backgroundOffsetX;
					if (_.responsive[i].backgroundOffsetY == undefined)
						_.responsive[i].backgroundOffsetY = _.backgroundOffsetY;
					if (_.responsive[i].frameDirection == undefined)
						_.responsive[i].frameDirection = _.frameDirection;
					if (_.responsive[i].startAngle == undefined)
						_.responsive[i].startAngle = _.startAngle;
						_.physics.position = _.timeline.angle * 10;

					if (_.responsive[i].preloadSmart == undefined)
						_.responsive[i].preloadSmart = _.preloadSmart;

					_.responsive[i].images = [];
					_.responsive[i].load = {};
					_.responsive[i].events = {};
					_.responsive[i].loadSet = [];
					_.responsive[i].loadSet = _.loadSets(_.responsive[i]);

					for (var j = 0; j < _.responsive[i].loadSet.length; j++) {

						for (var e in _.responsive[i].loadSet[j]) {

							//list out all the properties for each loadset

						}
					}

					_.responsive[i].loadingPosition = 0;
					_.responsive[i].totalLoaded = 0;
					_.responsive[i].currentSet = [];
					_.responsive[i].activated = false;

				}

				// set our window listener
				$(window).bind('resize._', function() {
					_.resize()
				});

				//preappend the master set as the largest, default set
				var d = {};

				d.breakpoint = 10000000000, //max width
				d.frames = _.frames;
				d.framesHighDPI = _.framesHighDPI//if the exist
				d.flex = _.flex;
				d.width = _.width;
				d.height = _.height;
				d.backgroundOffsetY = _.backgroundOffsetY;
				d.backgroundOffsetX = _.backgroundOffsetX;
				d.images = [];
				d.totalLoaded = 0;
				d.currentSet = [];
				d.activated = false;
				d.load = {};
				d.events = {};
				d.increment = 360 / d.frames.length;
				d.totalframes = d.frames.length;
				d.preloadSmart = _.preloadSmart;
				d.loadSet = _.loadSets(_);

				_.responsive.unshift(d);
				// will add the default node to the front of the array

				//set current breakpoint to the frames
				var breakpoint,
				    responsiveCurrentIndex;
				breakpoint = responsiveCurrentIndex = 0;

				for (var i = 0; i < _.responsive.length; i++) {

					if (window.innerWidth < _.responsive[i].breakpoint) {
						breakpoint = _.responsive[i].breakpoint;
						responsiveCurrentIndex = i;
						_.responsiveActive = responsiveCurrentIndex;
					}
				}

				_.frames = _.responsive[_.responsiveActive].frames;
				_.framesHighDPI = _.responsive[_.responsiveActive].framesHighDPI;
				_.loadSet = _.responsive[_.responsiveActive].loadSet;
				_.currentSet = _.responsive[_.responsiveActive].currentSet;
				_.backgroundOffsetX = _.responsive[_.responsiveActive].backgroundOffsetX;
				_.backgroundOffsetY = _.responsive[_.responsiveActive].backgroundOffsetY;
				_.responsive[_.responsiveActive].activated = true;
				_.increment = _.responsive[_.responsiveActive].increment;
				_.totalframes = _.responsive[_.responsiveActive].frames.length;
				_.height = _.responsive[_.responsiveActive].height;
				_.width = _.responsive[_.responsiveActive].width;

			} else {

				_.increment = 360 / _.frames.length;
				_.loadSet = _.loadSets(_);

				// set our window listener
				$(window).bind('resize._', function() {
					_.resize()
				});

			}

			if (_.backgroundSize == "cover" || _.backgroundSize ==  "cover-center"  || _.backgroundSize == "cover-top" ) {
				_.aspectRatio = {
					"w" : _.width / _.height,
					"h" : 1
				};
				_.windowSize = {
					"w" : $(window).width(),
					"h" : $(window).height()
				};
			}
		}

		Ease360.prototype.createImagesSet = function() {

			var _ = this;

			//dpi reference
			if (_.framesHighDPI.length == _.frames.length) {
				_.states.factoring = window.devicePixelRatio;
				_.load.frames = (_.states.factoring > 1  ) ? Array.prototype.slice.call(_.framesHighDPI) : Array.prototype.slice.call(_.frames);

			} else {

				_.load.frames = Array.prototype.slice.call(_.frames);
			}

			//check if we are reversing order of images
			if (_.frameDirection < 0)
				_.load.frames.reverse();

			for (var i = 0; i < 360; i++) {

				var img = new Image;
				_.images.push(img);

			}
		};

		Ease360.prototype.refresh = function() {

			var _ = this;

			var _width = _.el.css("width");
			//get our target width
			var _height = _.el.css("height");
			//and height

			// we are a percentage
			if (_width.includes("%")) {

				var parentWidth = _.el.offsetParent().width();
				_width = _width.substring(0, _width.length - 1);
				_width *= .01;
				_width = parentWidth * _width;
			}

			// we are a percentage
			if (_height.includes("%")) {

				var parentHeight = _.el.parent().height();
				_height = _height.substring(0, _height.length - 1);
				_height *= .01;
				_height = parentHeight * _height;

			}

			_.el.find("canvas").width(_width);
			//set our canvas element to be the same
			_.el.find("canvas").height(_height);

			_.canvas.c.width = _.canvas.width = _width;
			_.canvas.c.height = _.canvas.height = _height;
			_.states.status = "init";
			_.canvasSettings = _.canvasMath(_.images[_.timeline.angle]);


			_.canvasDraw(_.images[_.timeline.angle]);

		}

		Ease360.prototype.resize = function() {

			var _ = this;

			//responsiveActive = ?

			clearTimeout(_.resizeTimer);
			_.resizeTimer = setTimeout(function() {
				resizedw();
			}, 200);

			function resizedw() {

				clearTimeout(_.resizeTimer);
				var w = $(window).width();

				//if we are not in a responsive set
				/* 	*/

				if (!_.responsive.length) {

					_.refresh();
					return;
				}

				var breakpoint,
				    responsiveCurrentIndex;
				breakpoint = responsiveCurrentIndex = 0;

				for (var i = 0; i < _.responsive.length; i++) {

					if (w < _.responsive[i].breakpoint) {
						breakpoint = _.responsive[i].breakpoint;
						responsiveCurrentIndex = i;
					}
				}

				var previousActive = _.responsiveActive;
				_.responsiveActive = responsiveCurrentIndex

				//rebuild / init if we are in a new breakpoint or the set is a bleed
				if (_.responsiveActive !== previousActive || (_.responsive[_.responsiveActive].flex.w == true || _.responsive[_.responsiveActive].flex.h == true )) {
					_.responsiveInit(previousActive);
				}
			}

		}

		Ease360.prototype.responsiveInit = function(previousActive) {

			var _ = this;

			//use if we are in the same breakpoint set, but flex has the canvas resize and redrawn
			//then exit out

			if (previousActive == _.responsiveActive) {

				var _width = _.el.width();
				//get our target width
				var _height = _.el.height();
				//and height

				_.el.find("canvas").width(_width);
				//set our canvas element to be the same
				_.el.find("canvas").height(_height);

				_.canvas.c.width = _.canvas.width = _width;
				_.canvas.c.height = _.canvas.height = _height;

				_.states.status = "init";

				_.canvasSettings = _.canvasMath(_.images[_.timeline.angle]);
				_.canvasDraw(_.images[_.timeline.angle]);
				return;
			}

			//set the previous image set , if it is more than what is currently there
			//save previous set if it wasnt saved before
			if (_.responsive[previousActive].images.length == 0) {

				_.responsive[previousActive].images = Array.prototype.slice.call(_.images);
				_.responsive[previousActive].currentSet = _.currentSet;
				_.responsive[previousActive].loadingPosition = _.loadingPosition;
				_.responsive[previousActive].loadSet = _.loadSet;
				_.responsive[previousActive].load.frames = Array.prototype.slice.call(_.load.frames);
				_.responsive[previousActive].events.interactStart = _.events.interactStart;
				_.responsive[previousActive].totalLoaded = _.totalLoaded;
				_.responsive[previousActive].loadingFramesGoal = _.loadingFramesGoal;
				_.responsive[previousActive].activated = true;
				_.responsive[previousActive].totalframes = _.totalframes;
				_.responsive[previousActive].loadedSet = _.currentSet;

				//check to see if the previous responsive set was a frames reference, and the master set hasnt been loaded
				if (_.responsive[previousActive].framesReference && !_.responsive[0].activated) {

					//then set the masterset to the the previously loaded
					_.responsive[0].images = Array.prototype.slice.call(_.responsive[previousActive].images);
					_.responsive[0].currentSet = _.responsive[previousActive].currentSet;
					_.responsive[0].loadingPosition = _.responsive[previousActive].loadingPosition;
					_.responsive[0].loadSet = _.responsive[previousActive].loadSet;
					_.responsive[0].load.frames = Array.prototype.slice.call(_.responsive[previousActive].load.frames);
					_.responsive[0].events.interactStart = _.responsive[previousActive].events.interactStart;
					_.responsive[0].totalLoaded = _.responsive[previousActive].totalLoaded;
					_.responsive[0].loadingFramesGoal = _.responsive[previousActive].loadingFramesGoal;
					_.responsive[0].activated = true;
					_.responsive[0].totalframes = _.responsive[previousActive].totalframes;
					_.responsive[0].loadedSet = _.currentSet;

				}
			}

			_.images = [];
			//clear image set out


			_.frames = _.responsive[_.responsiveActive].frames;
			_.framesHighDPI = _.responsive[_.responsiveActive].framesHighDPI;
			//if the exist

			//check if there is a HighDPI image contained in the breakpoint, if not then set factoring to 1
			if (_.framesHighDPI.length == _.frames.length) {
				_.states.factoring = window.devicePixelRatio;
			} else {
				_.states.factoring = 1
			}

			_.width = _.responsive[_.responsiveActive].width;
			_.height = _.responsive[_.responsiveActive].height;
			_.backgroundOffsetY = _.responsive[_.responsiveActive].backgroundOffsetY;
			_.backgroundOffsetX = _.responsive[_.responsiveActive].backgroundOffsetX;
			_.totalLoaded = _.responsive[_.responsiveActive].totalLoaded;
			_.loadingFramesGoal = _.responsive[_.responsiveActive].loadingFramesGoal;
			_.frameDirection = _.responsive[_.responsiveActive].frameDirection;
			_.startAngle = _.responsive[_.responsiveActive].startAngle;
			_.totalframes = _.responsive[_.responsiveActive].totalframes;
			_.loadSet = _.responsive[_.responsiveActive].loadSet;
			_.currentSet = _.responsive[_.responsiveActive].currentSet;
			_.loadedSet = _.currentSet;

			// if there are images already contained in the set

			// if the current responsive set hasnt been loaded, is referencing the master set and the master set has been actived, then =
			if (!_.responsive[_.responsiveActive].activated && _.responsive[_.responsiveActive].framesReference && _.responsive[0].activated) {

				_.images = Array.prototype.slice.call(_.responsive[0].images);
				_.currentSet = _.responsive[0].currentSet;
				_.loadingPosition = _.responsive[0].loadingPosition;
				_.loadSet = _.responsive[0].loadSet;
				_.load.frames = Array.prototype.slice.call(_.responsive[0].load.frames);
				_.events.interactStart = _.responsive[0].events.interactStart;
				_.totalLoaded = _.responsive[0].totalLoaded;
				_.loadingFramesGoal = _.responsive[0].loadingFramesGoal;
				_.increment = _.responsive[0].increment;
				_.totalframes = _.responsive[0].totalframes;
				_.loadedSet = _.currentSet;

				var _width = _.el.width();
				//get our target width
				var _height = _.el.height();
				//and height

				_.el.find("canvas").width(_width);
				//set our canvas element to be the same
				_.el.find("canvas").height(_height);

				_.canvas.c.width = _.canvas.width = _width;
				_.canvas.c.height = _.canvas.height = _height;

				_.states.status = "init";

				//if revisited angle exists with an image then return
				//else reset our angle and physics to 0

				if (_.images[_.timeline.angle].file == undefined)
					_.timeline.angle = _.physics.position = 0;
				_.angleUpdateFunc();
				_.canvasSettings = _.canvasMath(_.images[_.timeline.angle]);
				_.canvasDraw(_.images[_.timeline.angle]);

				return;
			}

			if (_.responsive[_.responsiveActive].images.length > 0) {

				_.images = Array.prototype.slice.call(_.responsive[_.responsiveActive].images);
				_.currentSet = _.responsive[_.responsiveActive].currentSet;
				_.loadingPosition = _.responsive[_.responsiveActive].loadingPosition;
				_.loadSet = _.responsive[_.responsiveActive].loadSet;
				_.load.frames = Array.prototype.slice.call(_.responsive[_.responsiveActive].load.frames);
				_.events.interactStart = _.responsive[_.responsiveActive].events.interactStart;
				_.totalLoaded = _.responsive[_.responsiveActive].totalLoaded;
				_.loadingFramesGoal = _.responsive[_.responsiveActive].loadingFramesGoal;
				_.increment = _.responsive[_.responsiveActive].increment;
				_.totalframes = _.responsive[_.responsiveActive].totalframes;
				_.loadedSet = _.currentSet;

				var _width = _.el.width();
				//get our target width
				var _height = _.el.height();
				//and height

				_.el.find("canvas").width(_width);
				//set our canvas element to be the same
				_.el.find("canvas").height(_height);

				_.canvas.c.width = _.canvas.width = _width;
				_.canvas.c.height = _.canvas.height = _height;

				_.states.status = "init";

				//if revisited angle exists with an image then return
				//else reset our angle and physics to 0

				if (_.images[_.timeline.angle].file == undefined)
					_.timeline.angle = _.physics.position = 0;
				_.angleUpdateFunc();
				_.canvasSettings = _.canvasMath(_.images[_.timeline.angle]);
				_.canvasDraw(_.images[_.timeline.angle]);

				return;

			}

			//clear all intervals
			_.stopAllIntervals();

			//unbind events
			_.uninitializeEvents();

			//reset properties
			_.loadingPosition = 0;
			//_.timeline.angle = _.physics.position = 0;
			_.angleUpdateFunc();
			_.events.activatedGestureEvent = false;
			_.events.interactStart = false;
			_.states.status = "init";

			//callback
			_.responsiveUpdateFunc();

			_.el.unbind();
			//$( _.el.selector ).empty();
			_.el.find("canvas").remove();

			//_.preloadSmart = _.responsiveActive;
			_.createImagesSet();
			_.buildOut();

		};

		Ease360.prototype.preload = function(u) {

			var _ = this;

			//did we get called from changeFrames?
			//if so, we want to load the current angle first so we see the change without waiting for all the other frames to load
			if(u != undefined) {

				_.events.interactStart = false;
				
				for (var i = 0; i < 360; i++) {
					_.images[i].src = "";
				}

				const n = u/(360 / _.loadSet[1].totalframes);

				//load current frame 
				var filename = _.load.frames[n];

				_.images[u].width = _.width * _.states.factoring;
				_.images[u].height = _.height * _.states.factoring;

				_.images[u].id = u;
				_.images[u].file = filename;

				_.images[u].onload = function() {

					this.loaded = true;

					_.canvasDraw(_.images[_.timeline.angle]);

				}

				_.images[u].src = filename;

			}

			_.currentSet = _.loadSet[_.loadingPosition];

			_.newframesloaded = 0;

			//set objects properties based on our loadSets
			_.loadingFramesGoal = _.currentSet.totalframes;


			for (var i = _.currentSet.start; i < 360; i += _.currentSet.increment) {

				//cycle thru 360 -- only add images where we have the correct angle
 
				//var n =    Math.floor(i/_.currentSet.increment);
				var n = (i / 360) * _.totalframes;
				var filename = _.load.frames[n];

				_.images[i].width = _.width * _.states.factoring;
				_.images[i].height = _.height * _.states.factoring;

				_.images[i].id = i;
				_.images[i].file = filename;

				_.images[i].loaded = false;

				_.images[i].onload = function() {

					this.loaded = true;
					_.totalLoaded++;
					_.newframesloaded++;

					//_.progress = _.totalLoaded / _.loadingFramesGoal;
					_.progress = _.totalLoaded / _.frames.length;

			
					//_.progress =  _.newframesloaded/_.currentSet.newframes/;
					_.progressUpdateFunc();

					//if we have loaded all the new frames  -- before click
					if ((_.newframesloaded == _.currentSet.newframes) && _.events.changeFrames) {

						_.events.changeFrames = false;
						_.states.status = "active";

						//complete load of all target frames
						if (!_.events.interactStart) {

							_.loadedSet = _.currentSet;
							_.canvasSettings = _.canvasMath(_.images[_.timeline.angle]);

							_.canvasDraw(_.images[_.timeline.angle]);

							//draw the first frame
							_.loadedSet.totalframes = _.newframesloaded;
							_.preloadInitial = false;  
							//
							_.totalLoaded =  0;
							//reset
							return;

						} else {

							//complete load of all target frames
							_.canvasDraw(_.images[_.timeline.angle]);
							//draw the first frame

							if (_.totalLoaded >= _.loadingFramesGoal) {

								_.loadedSet = _.currentSet;
								_.loadcomplete = true;
								//we are now completely loaded, lets tween
								_.totalLoaded = _.newframesloaded = 0;
								//reset

								return;

							}
						}

					}


					if (_.newframesloaded == _.currentSet.newframes && !_.events.interactStart) {

						//if we are in the current 1st set, allow user to spin
						if (!_.loadingPosition) {

							_.initializeEvents();
							_.loadedSet = _.currentSet;
							_.canvasSettings = _.canvasMath(_.images[_.timeline.angle]);
							_.canvasDraw(_.images[_.timeline.angle]);
							//draw the first frame
							_.loadedSet.totalframes = _.newframesloaded;
							_.preloadInitial = false;
							//
							_.totalLoaded =  0;
						}

					}

					//if we have loaded all the new frames  -- before click
					if (_.newframesloaded == _.currentSet.newframes && _.events.interactStart) {

						//complete load of all target frames
						if (_.totalLoaded >= _.loadingFramesGoal) {

							_.loadedSet = _.currentSet;
							_.loadcomplete = true;
							//we are now completely loaded, lets tween
							_.totalLoaded = _.newframesloaded = 0;
							//reset
							return;

						}

					}
				}

				_.images[i].src = filename;

			}

			

			// update the loadSet totalframes and engine incremements if we did smartload
			if (_.loadedSet != undefined) {

				_.loadedSet.totalframes = _.currentSet.totalframes;
				_.loadedSet.engine = 360/_.loadedSet.totalframes;
				_.initialized = true; //
			}



		};

		Ease360.prototype.initializeEvents = function() {

			var _ = this;

			//bind mobile events for 360
			_.el.bind("touchstart", function(e) {
				_.startInteract(e)
			});
			_.el.bind("touchmove", function(e) {
				_.moveInteract(e)
			});
			_.el.bind("touchend", function(e) {
				_.endInteract(e)
			});

			_.el.bind("mousedown", function(e) {
				_.startInteract(e)
			});
			_.el.bind("mousemove", function(e) {
				_.moveInteract(e)
			});
			_.el.bind("mouseup mouseout", function(e) {
				_.endInteract(e)
			});

		};

		Ease360.prototype.uninitializeEvents = function() {

			var _ = this;

			//bind mobile events for 360
			_.el.unbind();

		};

		Ease360.prototype.destroy = function() {

			var _ = this;

			_.states.destroy = true;
			_.stopInterval();

			$(window).unbind('resize._');

			_.el.unbind();
			//$( _.el.selector ).empty();
			_.el.find("canvas").remove();
			_.load.frames = [];
			_.images = [];

			//empty
			for (var e in _.timeline) {
				_[e] = null;
			}

			for (var e in _.events) {
				_[e] = null;
			}

			_.timeline.angle = null;
			_.totalframes = null;
			_.totalloaded = null;
			_.loadedSet.totalframes = null;
			_.loadingPosition = 0;

			_.destroy();

		};

		Ease360.prototype.startInteract = function(e) {

			var _ = this;

			clearInterval(_.events.mouseEventInterval);
			_.events.startPos.x = (e.clientX) ? e.clientX : e.originalEvent.touches[0].pageX;
			_.events.startPos.y = (e.clientX) ? e.clientY : e.originalEvent.touches[0].pageY;

			_.events.activatedGestureEvent = true;
			_.events.touchdirection = null;

			_.states.status = "start";
		}

		Ease360.prototype.startMove = function(e) {

			var _ = this;
			
			if (!_.events.interactStart) {
				_.events.interactStart = true;
				_.loadingPosition = 1;
				_.currentSet = _.loadSet[_.loadingPosition];
				_.loadingFramesGoal = _.loadSet[1].totalframes;

				if (_.preloadSmart)
					_.preload();
				// only preload more if we have set it
			}
				
				
			if (_.states.activeTween) {
				_.timeline.directTweenActive = false;
				_.states.haltInterval();
			}

			_.events.mouseEventInterval = setInterval(function() {
					_.engine()
			}, 10);

		}

		Ease360.prototype.moveInteract = function(e) {

			var _ = this;			

			if (_.events.touchdirection == "none")
				return;

			//is our mouse down?
	     	if (_.events.startPos.x == null || _.events.startPos.y == null) return;

			_.events.currentPos.x = (e.clientX) ? e.clientX : e.originalEvent.touches[0].pageX;
			_.events.currentPos.y = (e.clientY) ? e.clientY : e.originalEvent.touches[0].pageY;

			//if its the first time on the move

			if (_.events.prevPos.x != null || _.events.prevPos.y != null) {

				_.events.differencePos.x = _.events.currentPos.x - _.events.prevPos.x;
				_.events.differencePos.y = _.events.currentPos.y - _.events.prevPos.y;

			} else {

				_.events.differencePos.x = _.events.currentPos.x - _.events.startPos.x;
				_.events.differencePos.y = _.events.currentPos.y - _.events.startPos.y;


				if (_.events.touchdirection ==  null) {
					//check the direction of the motion, exit out if we are going up/down to give natural browser behaviour

					_.events.touchdirection = (Math.abs(_.events.differencePos.x) >= Math.abs(_.events.differencePos.y)) ? "left-right" : "up-down";

					if (_.events.touchdirection == "left-right" && _.eventDirection == "left-right")
						_.startMove(e);
					if (_.events.touchdirection == "up-down" && _.eventDirection == "up-down")
						_.startMove(e);
					if ( _.eventDirection == "all" )
						_.startMove(e);
						
				}
			}
			
			
			if (_.events.touchdirection == "up-down" && _.eventDirection == "left-right")
				return;
			if (_.events.touchdirection == "left-right" && _.eventDirection == "up-down")
				return;

			_.events.prevPos.x = _.events.currentPos.x
			_.events.prevPos.y = _.events.currentPos.y
			

			//physics
			if (_.events.touchdirection == "left-right" && _.eventDirection == "left-right")
				_.physics.acceleration += _.events.differencePos.x * _.physics.delta_multiplier;
			if (_.events.touchdirection == "up-down" && _.eventDirection == "up-down")
				_.physics.acceleration += _.events.differencePos.y * _.physics.delta_multiplier;
			
			if (_.eventDirection  == "all" &&  _.events.differencePos.x >=  _.events.differencePos.y )
				_.physics.acceleration += _.events.differencePos.x * _.physics.delta_multiplier;

			if (_.eventDirection  == "all" &&  _.events.differencePos.x < _.events.differencePos.y )
				_.physics.acceleration += _.events.differencePos.x * _.physics.delta_multiplier;


			e.preventDefault();

		}




		Ease360.prototype.endInteract = function(e) {

			var _ = this;

			//reset
			_.events.startPos.x = _.events.startPos.y = null;
			_.events.prevPos.x = _.events.prevPos.y = null;
			_.events.touchdirection = null;
			_.events.activatedGestureEvent = false;
			
		}

		Ease360.prototype.progressUpdateFunc = function() {

			var _ = this;
			if (_.progressUpdate != undefined)
				_.progressUpdate(_);

		};

		Ease360.prototype.angleUpdateFunc = function() {

			var _ = this;
			if (_.angleUpdate != undefined)
				_.angleUpdate(_);

		};

		Ease360.prototype.stateUpdateFunc = function() {

			var _ = this;
			if (_.stateUpdate != undefined)
				_.stateUpdate(_);

		};

		Ease360.prototype.responsiveUpdateFunc = function() {

			var _ = this;
			if (_.responsiveUpdate != undefined)
				_.responsiveUpdate(_);

		};

		Ease360.prototype.loadSets = function(_) {

			_.totalframes = _.frames.length;
			// we know how many frames we have from the list provided

			var t = _.totalframes * _.preloadSmart;
			var load = (_.preloadSmart) ? 0.5 : 1;

			return [{
				"totalframes" : t,
				"newframes" : _.totalframes * load,
				"increment" : 360 / (_.totalframes * load), //20,
				"start" : 0,
				"engine" : 360 / (_.totalframes * load) //20
			}, {
				"totalframes" : _.totalframes,
				"newframes" : _.totalframes * load,
				"increment" : 360 / (_.totalframes - (_.totalframes * load)), //20,
				"start" : 360 / _.totalframes, //10
				"engine" : 360 / _.totalframes //10
			}];
		};

		//create the canvas object
		Ease360.prototype.buildOut = function() {

			var _ = this;
			var contentHolder,
			    docFrag,
			    _canvas;

			// Create a DocumentFragment to build with
			docFrag = document.createDocumentFragment();
			_canvas = document.createElement("canvas");

			// Append modal to DocumentFragment
			docFrag.appendChild(_canvas);

			// Append DocumentFragment to body
			_.el.append(docFrag);

			var _width = this.el.width();
			//get our target width
			var _height = this.el.height();
			//and height

			_.el.find("canvas").width(_width);
			//set our canvas element to be the same
			_.el.find("canvas").height(_height);

			_.canvas.c = _canvas;
			_.canvas.ctx = _canvas.getContext("2d");
			_.canvas.c.width = _.canvas.width = _width;
			_.canvas.c.height = _.canvas.height = _height;

			_.preload();

			_.el.addClass("ease360");

		}
		
		//provides all the calculations need for canvas on the 'canvasDraw' method
		Ease360.prototype.canvasMath = function(img) {

			var _ = this;
			var sx,
			    sy,
			    sWidth,
			    sHeight;
			var canvasM = { };

			sx = sy = 0;
			sWidth = img.width * _.states.factoring;
			sHeight = img.height * _.states.factoring;



			//add user defined offsets  -- based on retina image provided is 2x
			var devicepixelOffset = (_.states.factoring > 1) ? 2 : 1;

			if (_.backgroundSize == "default" || _.backgroundSize == "stretch") {

				canvasM = {
					"sx" : sx,
					"sy" : sy,
					"dWidth" : _.canvas.width,
					"dHeight" : _.canvas.height
				};

				//_.canvas.ctx.drawImage(img, sx, sy, _.canvas.width, _.canvas.height);
				return canvasM;

			}

			//set the background-cover - a bit more complicated

			var diffImageRatio,
			    diffRatio;
			var dWidth,
			    dHeight;

			_.canvas.c.height = (_.el.height() * _.states.factoring);
			// scale up when canvas
			_.canvas.c.width = (_.el.width() * _.states.factoring);

			_.canvas.c.style.height = _.el.height() + 'px';
			// scale down when canvas  syle to viewing size
			_.canvas.c.style.width = _.el.width() + 'px';

			_.canvas.ctx.scale(_.states.factoring, _.states.factoring);

			var m = _.states.factoring;
			var base;
			var basediff = (_.states.factoring > 1) ? 2 : 1;

			//if the canvas element is width is greater than its height
			if (_.el.width() < _.el.height()) {

				diffImageRatio = (_.canvas.c.width / _.canvas.c.height ) * img.height;

				var diffRatio = _.canvas.c.width / _.canvas.c.height;
				//use
				var imageRatio = _.width / _.height;

				if (diffRatio > imageRatio) {

					diffRatio = _.canvas.c.height / _.canvas.c.width;
					//flip

					dWidth = _.width * basediff;
					dHeight = (_.width * diffRatio) * basediff;

					sy = ((_.height * devicepixelOffset ) - dHeight) / 4;

				} else {

					dWidth = (_.height * diffRatio) * basediff;
					dHeight = (_.height  ) * basediff;

					sx = ((_.width * devicepixelOffset ) - dWidth) / 2;
					sy = 0;

				}

			} else {

				diffImageRatio = (_.canvas.c.height / _.canvas.c.width ) * img.width;

				var diffRatio = _.canvas.c.height / _.canvas.c.width;
				//use
				var imageRatio = _.height / _.width;

				if (diffRatio > imageRatio) {

					diffRatio = _.canvas.c.width / _.canvas.c.height;
					//flip

					dWidth = (_.height * diffRatio) * basediff;
					dHeight = (_.height  ) * basediff;

					sx = ((_.width * devicepixelOffset ) - dWidth) / 2;
					sy = 0;

				} else {

					dWidth = _.width * basediff;
					dHeight = (_.width * diffRatio) * basediff;

					sy = ((_.height * devicepixelOffset ) - dHeight) / 4;

				}
			}

			sx += (_.backgroundOffsetX * devicepixelOffset);
			sy += (_.backgroundOffsetY * devicepixelOffset);

			canvasM = {
				"sx" : sx,
				"sy" : sy,
				"sWidth" : dWidth,
				"sHeight" : dHeight,
				"dx" : 0,
				"dy" : 0,
				"dWidth" : _.canvas.c.width / _.states.factoring,
				"dHeight" : _.canvas.c.height / _.states.factoring
			};

			return canvasM;

		}

		Ease360.prototype.canvasDraw = function(img) {

			var _ = this;
			var sx,
			    sy,
			    sWidth,
			    sHeight;

			//if the image has not been loaded yet then return
			if(!img.loaded) {
				return;
			}

			//if the frame is not found, default to 0
			if (img.src == "") {
				_.timeline.angle = 0;
				_.angleUpdateFunc();
				img = _.images[_.timeline.angle];
			}

			if (_.states.destroy || _.states.status == "stop")
				return;

			_.states.status = "active";
			_.stateUpdateFunc();

			if (_.transparencySupport) {
				_.canvas.ctx.clearRect(0, 0, _.canvasSettings.dWidth, _.canvasSettings.dHeight);
			}

			if (_.backgroundSize == "cover") {
				_.canvas.ctx.drawImage(img, _.canvasSettings.sx, _.canvasSettings.sy, _.canvasSettings.sWidth, _.canvasSettings.sHeight, _.canvasSettings.dx, _.canvasSettings.dy, _.canvasSettings.dWidth, _.canvasSettings.dHeight);
				// dWidth and dHeight are 1/factor when using the retina factoring -- scaled should be norm

			} else if (_.backgroundSize == "cover-top") {

				//pin to top
				_.canvas.ctx.drawImage(img, _.canvasSettings.sx, 0, _.canvasSettings.sWidth, _.canvasSettings.sHeight, _.canvasSettings.dx, _.canvasSettings.dy, _.canvasSettings.dWidth, _.canvasSettings.dHeight);
		

			} else if (_.backgroundSize == "cover-center") {

				//is the width or height at full?
	
				const aspectRatioCover = _.canvasSettings.dWidth / _.width; // get the width aspect ratio between the destination canvas and image source
				const centerHeight = (( _.height * aspectRatioCover ) -  _.canvasSettings.dHeight )  / 2; // find where we need to come down on the crop

				//if we are at a full width then remap offset back to the original height else we set it to 0 because the height is maxed
				//inflate the size back to the source footage height if true 
				const centerHeightToSource = ( (_.width/_.height ) < (_.canvasSettings.dWidth / _.canvasSettings.dHeight ) ) ?  Math.abs(centerHeight * (  _.width / _.canvasSettings.dWidth)) : 0; 

				_.canvas.ctx.drawImage(img, _.canvasSettings.sx, centerHeightToSource, _.canvasSettings.sWidth, _.canvasSettings.sHeight, _.canvasSettings.dx, _.canvasSettings.dy, _.canvasSettings.dWidth, _.canvasSettings.dHeight);
				// dWidth and dHeight are 1/factor when using the retina factoring -- scaled should be norm

				const drawImageCover = {"img" : img, "sx" : _.canvasSettings.sx, "sy" :  centerHeightToSource, "sWidth":  _.canvasSettings.sWidth, "sHeight" : _.canvasSettings.sHeight, "dx" :  _.canvasSettings.dx, "dy" : _.canvasSettings.dy, "dWidth" : _.canvasSettings.dWidth, "dHeight" :  _.canvasSettings.dHeight  };

			} else {

				//'default' setting
				_.canvas.ctx.drawImage(img, _.canvasSettings.sx, _.canvasSettings.sy, _.canvasSettings.dWidth, _.canvasSettings.dHeight);

			}

		}

		Ease360.prototype.engine = function() {

			var _ = this;
			_.states.engine = true;

			//add acceleration to the speed
			_.physics.speed += _.physics.acceleration;

			// position
			_.physics.position += _.physics.speed;

			//_damping is a constant 0.9
			_.physics.speed *= _.physics.damping;

			//reset accel
			_.physics.acceleration = 0;

			//turn off engine if we are not using it
			if (Math.abs(_.physics.speed) < 0.15 && !_.events.activatedGestureEvent ) {
				clearInterval(_.events.mouseEventInterval);
				_.states.status = "stop";
				_.states.engine = false;
				_.stateUpdateFunc();
				return;
			}

			var o = _.physics.position % _.physics.positionCap;
			if (o < 0)
				o = _.physics.positionCap + o;



			//test - what we get when there is 36 frames
			var scaledresult = ((o - 0) / (_.physics.positionCap - 0)) * (_.loadedSet.totalframes - 0) + 0;

			scaledresult--;

		    //_.loadedSet.totalframes = _.currentSet.totalframes;
		    //_.loadedSet.engine = _.currentSet.totalframes;


			//offset for array  - will give us the frame
			scaledresult = Math.ceil(scaledresult) * _.loadedSet.engine;

			_.timeline.angle = scaledresult;

			_.angleUpdateFunc();

			//redraw canvas
			_.canvasDraw(_.images[scaledresult]);

		}

		Ease360.prototype.changeFrames = function(m, n) {

			var _ = this;

			function changeFrames() {
				_.events.changeFrames = true;

				_.frames = [];
				_.frames = m;

				if (n != undefined) {
					_.framesHighDPI = [];
					_.framesHighDPI = n;
				}

				_.loadingPosition = 0;

				//order of init operations
				_.loadSet = _.loadSets(_);
				_.createImagesSet();
				_.preload(_.timeline.angle);

			}


			if (  _.states.engine ) {  
				function recheckEngineState() {

		    		if( _.states.engine ) {
		      			setTimeout(recheckEngineState, 50); //wait 50 millisecnds then recheck
		        		return;
		    		} else {
			    		changeFrames(); // the engine is no longer on
			    	}
			    }

			    recheckEngineState();
			} else {
				changeFrames(); // the engine is off, then we can change
			}


		}


		Ease360.prototype.angleTo = function(angle, time) {

			var _ = this;

			if (_.timeline.activeTween)
				return;
			// if we are currently in a tween, then exit

			clearInterval(_.timeline.easeInterval);
			clearInterval(_.events.mouseEventInterval);

			_.timeline.duration = time || _.timeline.durationDefault;

			_.timeline.startValue = _.timeline.angle;
			_.timeline.endValue = angle;
			_.timeline.timer = 0;

			_.timeline.difference = (_.timeline.endValue - _.timeline.startValue)

			_.timeline.activeTween = _.timeline.directTweenActive = true;
			_.states.status = "start";
			_.stateUpdateFunc();
			_.timeline.easeInterval = setInterval(function() {
				_.easeOutCubic()
			}, 33.33);

		}

		Ease360.prototype.angleStep = function(angle) {

			var _ = this;
			clearInterval(_.timeline.easeInterval);
			clearInterval(_.events.mouseEventInterval);

			angle = angle | 0;
			_.timeline.angle += angle;

			//if we break the 359 degrees, then we reset back to 0 with offset
			if (_.timeline.angle >= 360)
				_.timeline.angle -= 360;
			if (_.timeline.angle < 0)
				_.timeline.angle += 360;

			//set physics engine to synch with new changes
			_.physics.position = _.timeline.angle * 10;
			// give us range yo 3600

			_.states.status = "start";
			_.stateUpdateFunc();
			_.canvasDraw(_.images[_.timeline.angle]);
			_.angleUpdateFunc();

		}

		Ease360.prototype.angleSet = function(angle) {

			var _ = this;
			clearInterval(_.timeline.easeInterval);
			clearInterval(_.events.mouseEventInterval);

			angle = angle | 0;
			_.timeline.angle += angle;

			//if we break the 359 degrees, then we reset back to 0 with offset
			_.timeline.angle = angle;

			//set physics engine to synch with new changes
			_.physics.position = _.timeline.angle * 10;
			// give us range yo 3600

			_.states.status = "start";
			_.stateUpdateFunc();
			_.canvasDraw(_.images[_.timeline.angle]);
			_.angleUpdateFunc();

		}

		Ease360.prototype.angle = function(angle) {

			var _ = this;

			var type = (angle == undefined) ? "get" : "set";

			if (type == "set") {

				clearInterval(_.timeline.easeInterval);
				clearInterval(_.events.mouseEventInterval);

				_.timeline.angle += angle;

				//if we break the 359 degrees, then we reset back to 0 with offset
				_.timeline.angle = angle;

				//set physics engine to synch with new changes
				_.physics.position = _.timeline.angle * 10;
				// give us range yo 3600

				_.states.status = "start";
				_.stateUpdateFunc();
				_.canvasDraw(_.images[_.timeline.angle]);
				_.angleUpdateFunc();

			} else {

				return _.timeline.angle

			}

		}

		Ease360.prototype.spinOver = function(speed) {

			var _ = this;

			clearInterval(_.events.mouseEventInterval);
			_.stopInterval();

			_.states.status = "start";
			_.stateUpdateFunc();

			_.timeline.easeInterval = setInterval(function() {
				setAcceleration()
			}, 10);
			_.events.mouseEventInterval = setInterval(function() {
				_.engine()
			}, 10);

			function setAcceleration() {

				_.physics.acceleration += speed * _.physics.delta_multiplier;

			}

		}

		Ease360.prototype.spinOut = function() {

			var _ = this;

			clearInterval(_.timeline.easeInterval);

			//reset frame
			_.timeline.timer = 0;
			//_.states.status = "stop";
			_.stateUpdateFunc();
			// notify the user the tween has stopped
			_.timeline.activeTween = false;

		}

		Ease360.prototype.easeOutQuad = function() {//function easeOutQuad (t, b, c, d)

			var _ = this;

			var t = (_.timeline.timer / 30) / _.timeline.duration;
			var result = -_.timeline.difference * t * (t - 2) + _.timeline.startValue;
			// return c*t*t + b;
			var f = Math.floor(result) / _.loadedSet.engine;
			// scale the 0-360 value of result into the provided frame range
			var scaledresult = Math.ceil(f) * _.loadedSet.engine;
			// then scale back up after applying the Math.Ceil call

			//redraw canvas
			_.timeline.angle = scaledresult;
			_.canvasDraw(_.images[_.timeline.angle]);
			_.angleUpdateFunc();

			//set physics engine to synch with new changes
			_.physics.position = _.timeline.angle * 10;
			// give us range yo 3600

			//if we met our goal then break
			if (_.timeline.timer / 30 >= _.timeline.duration) {
				_.stopInterval();
				_.timeline.directTweenActive = false;
				return;
			}

			_.timeline.timer++;
		}

		Ease360.prototype.easeOutCubic = function() {

			var _ = this;

			var t = (_.timeline.timer / 30) / _.timeline.duration;
			t--;

			var result = _.timeline.difference * (t * t * t + 1) + _.timeline.startValue;
			//return c*(t*t*t + 1) + b;
			
			var f = Math.floor(result) / _.loadedSet.engine;
			// scale the 0-360 value of result into the provided frame range

			var scaledresult = Math.ceil(f) * _.loadedSet.engine;
			// then scale back up after applying the Math.Ceil call

			//redraw canvas
			_.timeline.angle = scaledresult;

			//if we break the 359 degrees, then we reset back to 0 with offset
			if (_.timeline.angle >= 360)
				_.timeline.angle -= 360;
			if (_.timeline.angle < 0)
				_.timeline.angle += 360;

			_.canvasDraw(_.images[_.timeline.angle]);
			_.angleUpdateFunc();

			//set physics engine to synch with new changes
			_.physics.position = _.timeline.angle * 10;
			// give us range yo 3600

			//if we met our goal then break
			if (_.timeline.timer / 30 >= _.timeline.duration) {

				_.stopInterval();
				_.timeline.directTweenActive = false;
				return;

			}

			_.timeline.timer++;

		}

		Ease360.prototype.stopInterval = function() {

			var _ = this;

			clearInterval(_.timeline.easeInterval);

			//reset frame
			_.timeline.timer = 0;
			_.states.status = "stop";
			_.stateUpdateFunc();
			// notify the user the tween has stopped
			_.timeline.activeTween = false;

		}

		Ease360.prototype.stopAllIntervals = function() {

			var _ = this;

			clearInterval(_.timeline.easeInterval);
			clearInterval(_.events.mouseEventInterval);
			//reset frame

			_.timeline.timer = 0;
			_.states.status = "stop";
			_.stateUpdateFunc();
			// notify the user the tween has stopped
			_.timeline.activeTween = false;

		}
		// Utility to mimic jquery extend -without jquery
		function extend() {
			for (var i = 1; i < arguments.length; i++)
				for (var key in arguments[i])
				if (arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
			return arguments[0];
		}

		function numberRound(v) {

			var r = (v % 2 == 0) ? v : r = v - 1;
			return r

		}

		//make it a plugin

		$.fn.ease360 = function() {

			var _ = this,
			    opt = arguments[0],
			    args = Array.prototype.slice.call(arguments, 1),
			    l = _.length,
			    i,
			    ret;
			for ( i = 0; i < l; i++) {
				if ( typeof opt == 'object' || typeof opt == 'undefined') {
					_ = new Ease360(_[i], opt, $(this));
				} else
					ret = _.ease360[opt].apply(_[i].ease360, args);
				if ( typeof ret != 'undefined')
					return ret;
			}
			return _;

		};

	}));

