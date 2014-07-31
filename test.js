var should = require("chai").should();
var FlowEvents = require('./flow');
var $ = {};
//global.window = {}; //an expected leak

describe('flow events', function(){
    
    before(function(done){
        FlowEvents.ready(function(jQuery){
            $ = jQuery;
            done();
        });
    });
    
    it('a div containing img children generates events as those children scroll into view', function(done){
        $(global.window.document.body).append($('<div id="container" style="width:50px;height:10px"></div>'));
        for(var lcv=0; lcv < 10; lcv++){
            $('#container').append($('<img style="width:10px;height:10px">'))
        }
        var count = 0;
        FlowEvents.enableOn($('#container'), 'img', { onFlowIn : function(){
            should.exist(this);
            count++;
        }});
        //jsdom does not update geometry, so we do it by hand:
        $('#container')[0].scrollLeft = 50;
        $('#container').trigger('scroll');
        count.should.be.above(1);
        done();
    });
    
    //it('a div containing img children generates events as those children scroll out of view', function(done){
        
    //});
});