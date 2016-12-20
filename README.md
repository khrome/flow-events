flow-events.js
==============

[![NPM version](https://img.shields.io/npm/v/flow-events.svg)]()
[![npm](https://img.shields.io/npm/dt/flow-events.svg)]()
[![Travis](https://img.shields.io/travis/khrome/flow-events.svg)]()

If you have a container that uses overflow scrolling on a page, it's helpful to have elements generate events as they come into visibility(currently requires jQuery via UMD, but can be shimmed with any compatible lib).

Usage
-----

To detect scroll geometry events for all elements inside `container` who are of type `img.preview` and we want a notification each time one of these scrolls into view.

    FlowEvents.enableOn(container, 'img.preview', {
        onScrollIn : function(el){
            //do stuff here
        }
    }
    
alternatively you can just enable the event and detect them bubbling through the DOM.

    FlowEvents.enableOn(container, 'img.preview');

Then later

    myEl.on('flow-in', function(){
        //do stuff here
    })

    
Available Events
----------------
There are a few events that can be generated:

1. `flowing` : an unseen element scrolls partially into view
2. `flow-in` : an unseen element scrolls fully into view
3. `flow-out` : a visible element scrolls fully out of view
4. `flow-begin` : generated when scrolled to the left extent of the container
4. `flow-begin-away` : generated when scrolled away from the left extent of the container
5. `flow-end` : generated when scrolled to the right extent of the container
4. `flow-end-away` : generated when scrolled away from the right extent of the container

and a couple more planned (but unimplemented) ones:

1. `buffer-in` : generated when an unseen element scrolls into the buffer zone
2. `buffer-out` : generated when an unseen element scrolls out of the buffer zone

####Future Features
- optional debouncing for heavy load
- buffer zones
- short circuit chrome's weird gesture/back behavior on OSX

Testing
-------
for the local tests, just run
    
    mocha

Enjoy,

-Abbey Hawk Sparrow