(function (root, factory) {
    if (typeof define === 'function' && define.amd){
        define(['jquery'], factory);
    } else if (typeof exports === 'object'){
        module.exports = factory(require('jquery-with-dom'));
    } else {
        root.FlowEvents = factory(root.$ || root.jQuery);
    }
}(this, function ($) {
    
    $.ready(function(jQuery){
        $ = jQuery;
    });
    
    function fireEvent(element, name, ext){
        var event; // The custom event that will be created

        if(window.document.createEvent){
            event = window.document.createEvent("HTMLEvents");
            event.initEvent(name, true, true);
        }else{
            event = window.document.createEventObject();
            event.eventType = name;
        }

        event.eventName = name;
        Object.keys(ext).forEach(function(field){
            event[field] = ext[field];
        });
        if(window.document.createEvent){
            element.dispatchEvent(event);
        }else{
            element.fireEvent("on" + event.eventType, event);
        }
        return event;
    }
    
    return {
        ready : $.ready,
        enableOn : function(container, items, handlers){
            handlers = handlers || {};
            //todo: buffer and optimize to short circuit
            if(!container.previous) container.previous = {
                inside : [],
                outside : [],
                intersecting : []
            };
            var beginning = false;
            var end = false;
            var $container = $(container);
            $container.on('scroll', function(){
                var $children = $(items, $container);
                var groups = {
                    inside : [],
                    outside : [],
                    intersecting : []
                };
                var offsets = $container.offset();
                var containerTop = offsets.top;
                var containerBottom = containerTop + $container.height();
                var containerLeft = offsets.left;
                var containerRight = containerLeft + $container.width();
                var cHeight = $container.height();
                var cWidth = $container.width();
                $children.map(function(index, el){
                    var $el = $(el);
                    var $elOffsets = $el.offset();
                    var elTop = $elOffsets.top - containerTop;
                    var elBottom = elTop + $el.height();
                    var elLeft = $elOffsets.left - containerLeft;
                    var elRight = elLeft + $el.width();
                    if(
                        (elBottom >= 0) && // bottom is under top edge
                        (elTop <= cHeight) && // top is above bottom edge
                        (elRight >= 0) && // right is past left edge
                        (elLeft <= cWidth) //left is past right edge
                    ){ //at least partially onscreen
                        if(
                            (elTop >= 0) && // top is under top edge
                            (elBottom <= cHeight) && // bottom is above bottom edge
                            (elLeft >= 0) && // left is past left edge
                            (elRight <= cWidth) //right is past right edge
                        ){ //fully inside
                            groups.inside.push(el);
                        }else{ //partially inside
                            groups.intersecting.push(el);
                        }
                    }else groups.outside.push(el);
                });
                var diff = {
                    inside : groups.inside.filter(function(item){ 
                        return container.previous.inside.indexOf(item) < 0 
                    }),
                    outside : groups.outside.filter(function(item){ 
                        return container.previous.outside.indexOf(item) < 0
                    }),
                    intersecting : groups.intersecting.filter(function(item){ 
                        return container.previous.intersecting.indexOf(item) < 0 
                    })
                };
                diff.inside.forEach(function(el){
                    fireEvent(el, 'flow-in', {});
                    if(handlers['onFlowOut']) handlers['onFlowOut'].apply(el, [{}]);
                });
                diff.outside.forEach(function(el){
                    fireEvent(el, 'flow-out', {});
                    if(handlers['onFlowIn']) handlers['onFlowIn'].apply(el, [{}]);
                });
                diff.intersecting.forEach(function(el){
                    fireEvent(el, 'flowing', {});
                    if(handlers['onFlowing']) handlers['onFlowing'].apply(el, [{}]);
                });
                
                //flow-begin events
                if((!beginning) && groups.inside.indexOf($children[0]) !== -1){
                    fireEvent($container[0], 'flow-begin', {});
                    if(handlers['onFlowBegin']) handlers['onFlowBegin'].apply($container[0], [{}]);
                    beginning = true;
                }else{
                    if(beginning){
                        fireEvent($container[0], 'flow-begin-away', {});
                        if(handlers['onFlowBeginAway']) handlers['onFlowBeginAway'].apply($container[0], [{}]);
                    }
                    beginning = false;
                }
                
                //flow-end events
                if((!end) && groups.inside.indexOf($children[$children.length-1]) !== -1){
                    fireEvent($container[0], 'flow-end', {});
                    if(handlers['onFlowEnd']) handlers['onFlowEnd'].apply($container[0], [{}]);
                    end = true;
                }else{
                    if(end){
                        fireEvent($container[0], 'flow-end-away', {});
                        if(handlers['onFlowEndAway']) handlers['onFlowEndAway'].apply($container[0], [{}]);
                    }
                    end = false;
                }
                //todo: handle buffer zones
                //todo: short circuit chrome's stupid gesture implementation
                // http://stackoverflow.com/questions/15829172/stop-chrome-back-forward-two-finger-swipe/17031086#17031086
                container.previous = groups;
            });
            $container.trigger('scroll');
        }
    }
}));