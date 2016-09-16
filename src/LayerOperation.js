/**
 * Created by aillieo on 16/9/5.
 */


var LayerOperation = cc.Layer.extend({
    _isTouchEnabled:false,
    _moveEnded:true,

    ctor:function () {

        this._super();

        var self = this;

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            target : self,
            onTouchBegan: self.onTouchBegan,
            onTouchMoved: self.onTouchMoved
        });
        cc.eventManager.addListener(touchListener,self);



        var enableTouchListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target : self,
            eventName: "ENABLE_TOUCH",
            callback: function (event) {
                var self = event.getCurrentTarget();
                self._isTouchEnabled = true;
            }
        });
        cc.eventManager.addListener(enableTouchListener,self);


        var disableTouchListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target : self,
            eventName: "DISABLE_TOUCH",
            callback: function (event) {
                var self = event.getCurrentTarget();
                self._isTouchEnabled = false;
            }
        });
        cc.eventManager.addListener(disableTouchListener,self);





        return true;
    },

    onTouchBegan:function(touch , event){


        var self = event.getCurrentTarget();
        if(!self._isTouchEnabled) {
            return false;
        }

        //cc.log("touch began");

        self._moveEnded = false;


        event.getCurrentTarget().touchStartX = touch.getLocation().x;
        event.getCurrentTarget().touchStartY = touch.getLocation().y;




        return true;

    },


    onTouchMoved:function(touch, event){


        var self = event.getCurrentTarget();
        if(self._moveEnded){
            return;
        }

        var touchX = touch.getLocation().x;
        var touchY = touch.getLocation().y;
        var touchStartX = event.getCurrentTarget().touchStartX;
        var touchStartY = event.getCurrentTarget().touchStartY;

        var deltaX = touchX - touchStartX;
        var deltaY = touchY - touchStartY;



        var tmpDir = "";
        if(deltaX >10){

            tmpDir = "right";

        }
        else if (deltaX < -10) {

            tmpDir = "left";

        }
        else if (deltaY >10){

            tmpDir = "up";
        }
        else if (deltaY < -10) {

            tmpDir = "down";

        }


        if(tmpDir == ""){

            return;

        }


        self._moveEnded = true;


        //var eve = new cc.EventCustom("OPERATION");
        var dat = {
            pt : cc.p(touchStartX,touchStartY),
            dir : tmpDir
        };
        //eve.setUserData(data);

        cc.eventManager.dispatchCustomEvent("OPERATION",dat);


        //cc.log("touch moved");

    }

});
