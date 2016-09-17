/**
 * Created by aillieo on 16/9/3.
 */


var BlockElement = cc.Sprite.extend({
    _pos_col:0,
    _pos_row:0,
    _typeIndex:0,
    _willBeRemoved:false,
    _isFrozen:false,
    _withSuperPower:0,   // 0:normal, 1: 4 inRow or 4 inCol, 2: T or L type, 3: 5 or more in Row or Col
    _typeIndexInitialized:false,
    _superPowerSprite:null,
    _indexLabel:null,
    ignoreCheckInRow: false,
    ignoreCheckInCol: false,
    ctor:function () {

        this._super();

        var self = this;
        self.setCascadeOpacityEnabled(true);
        self.setTexture(res.blank);
        self.setColor(cc.color(98,98,98));
        var wid = GlobalPara.blockWidth;
        self.setTextureRect(cc.rect(0,0,wid,wid));
        
        return true;
    },
    
    setTypeIndex:function(typeIndex){
      
        if (this._typeIndexInitialized) {
        
            return;
        }
        this._typeIndexInitialized = true;
        this._typeIndex = typeIndex;
        var self = this;

        self._indexLabel = new cc.LabelTTF(self._typeIndex.toString(), "Arial", 38);


        self._indexLabel.x = self.getContentSize().width/2;
        self._indexLabel.y = self.getContentSize().height/2;

        self.addChild(self._indexLabel, 5);

        var rgbR = (GlobalPara.blockTypes - this._typeIndex) * 255/ GlobalPara.blockTypes;
        var rgbB = this._typeIndex * 255/ GlobalPara.blockTypes;
        var rgbG = 255- Math.abs(rgbR - rgbB);
        self.setColor(cc.color(rgbR, rgbG, rgbB));


    },

    getCol : function () {

        return this._pos_col;
    },

    getRow : function () {

        return this._pos_row;

    },

    getTypeIndex:function () {

        return this._typeIndex;
    },

    setRow : function (row) {

        this._pos_row = row;
    },

    setCol : function (col) {

        this._pos_col = col;
    },
    
    isToBeRemoved : function(){
        return this._willBeRemoved;
    },
    
    markToRemove : function(){
       this._willBeRemoved = true;
    },
    
    getShuffleTag : function () {

        return cc.random0To1();

    },

    getSuperPower: function (){

        return this._withSuperPower;

    },

    setSuperPower: function (superPower) {

        var self = this;
        self._withSuperPower = superPower;

        if(!self._superPowerSprite) {
            self._superPowerSprite = new cc.Sprite();
        }

        switch (superPower){

            case 1:
                self._superPowerSprite.setTexture(res.thunder);
                break;
            case 2:
                self._superPowerSprite.setTexture(res.cross);
                break;
            case 3:
                self._superPowerSprite.setTexture(res.dot);
                self._typeIndex = 0;
                if(self._indexLabel){
                
                    self._indexLabel.removeFromParent();
                }
                
                self.setColor(cc.color(98,98,98));
                break;

        }


        self.addChild(self._superPowerSprite,0);
        self._superPowerSprite.setOpacity(127);
        self._superPowerSprite.setPosition(self.getContentSize().width/2, self.getContentSize().height/2);


        this._willBeRemoved = false;


    },

    onRemove : function(){

        if(this._superPowerSprite){
            var st =  cc.scaleTo(0.2,3);
            this._superPowerSprite.runAction(st);
        }


    }



});
