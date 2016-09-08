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
                self._isTouchEnabled = true;
            }
        });
        cc.eventManager.addListener(enableTouchListener,self);


        var disableTouchListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target : self,
            eventName: "DISABLE_TOUCH",
            callback: function (event) {
                self._isTouchEnabled = false;
            }
        });
        cc.eventManager.addListener(disableTouchListener,self);





        return true;
    },

    onTouchBegan:function(touch , event){

        cc.log("touch began");

        if(!this._isTouchEnabled) {
            //return false;
        }

        this._moveEnded = false;


        event.getCurrentTarget().touchStartX = touch.getLocation().x;
        event.getCurrentTarget().touchStartY = touch.getLocation().y;

        return true;

    },


    onTouchMoved:function(touch, event){


        if(this._moveEnded){
            return;
        }

        var touchX = touch.getLocation().x;
        var touchY = touch.getLocation().y;
        var touchStartX = event.getCurrentTarget().touchStartX;
        var touchStartY = event.getCurrentTarget().touchStartY;

        var deltaX = touchX - touchStartX;
        var deltaY = touchY - touchStartY;


        var eve = new cc.EventCustom("OPERATION");
        var data = {
            pt : new cc.Point(touchStartX,touchStartY),
            dir : "down"
        };
        eve.setUserData(data);

        cc.eventManager.dispatchCustomEvent(eve);

        cc.log("touch moved",deltaX,deltaY);
        this._moveEnded = true;

    }

});
