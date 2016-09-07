/**
 * Created by aillieo on 16/9/5.
 */


var LayerOperation = cc.Layer.extend({
    _isTouchEnabled:false,

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
                //cc.log(event);
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

        if(!this._isTouchEnabled) {
            return false;
        }

        cc.log("touch began");
        
        //event.getCurrentTarget().touchStartX = touch.getLocation().x;
        event.getCurrentTarget().touchStartY = touch.getLocation().y;

        return true;

    },


    onTouchMoved:function(touch, event){

      
        
        //var touchX = touch.getLocation().x;
        var touchY = touch.getLocation().y;
        var touchStartX = event.getCurrentTarget().touchStartX;
        var touchStartY = event.getCurrentTarget().touchStartY;
        
        var deltaX = touchX - touchStartX;
        var deltaY = touchY - touchStartY;

        
        
        cc.log("touch moved",deltaX,deltaY);

    }


});
