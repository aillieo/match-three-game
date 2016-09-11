/**
 * Created by aillieo on 16/9/3.
 */


var BlockElement = cc.Sprite.extend({
    _pos_col:0,
    _pos_row:0,
    _typeIndex:0,
    _willBeRemoved:false,
    _isFrozen:false,
    _withSuperPower:0,
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
      
              
        this._typeIndex = typeIndex;
        var self = this;

        var indexLabel = new cc.LabelTTF(self._typeIndex.toString(), "Arial", 38);


        indexLabel.x = self.getContentSize().width/2;
        indexLabel.y = self.getContentSize().height/2;

        self.addChild(indexLabel, 5);
      
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

    }


});
