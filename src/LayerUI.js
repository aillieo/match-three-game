/**
 * Created by aillieo on 16/9/6.
 */



var LayerUI = cc.Layer.extend({
    _score:0,
    _labelScore:null,

    ctor:function () {

        this._super();

        var self = this;

        var size = cc.winSize;

        self._labelScore = new cc.LabelTTF("SCORE:"+self._score.toString(), "Arial", 38);

        self._labelScore.x = size.width/2;
        self._labelScore.y = size.height * 0.8;

        self.addChild(self._labelScore);





        var scoreListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target : self,
            eventName: "ADD_SCORE",
            callback: self.addScore
        });
        cc.eventManager.addListener(scoreListener,self);




        return true;
    },

    addScore : function(event){

        var self = event.getCurrentTarget();
        var dat = event.getUserData();
        var score = dat.score;
        self._score += score;
        self._labelScore.setString("SCORE:"+self._score.toString());

    }



});
