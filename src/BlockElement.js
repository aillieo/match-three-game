/**
 * Created by aillieo on 16/9/3.
 */


var BlockElement = cc.Sprite.extend({
    _pos_col:0,
    _pos_row:0,
    _type_index:0,
    ctor:function (row,col) {

        this._super();

        var self = this;
        self.setTexture(res.blank);
        self.setColor(cc.color(98,98,98));
        var wid = GlobalPara.blockWidth;
        self.setTextureRect(cc.rect(0,0,wid,wid));
        
        self._type_index = cc.random0To1() * GlobalPara.blockTypes;
        self._type_index = Math.floor(self._type_index);
        self._pos_col = col;
        self._pos_row = row;

        var indexLabel = new cc.LabelTTF(self._type_index.toString(), "Arial", 38);


        indexLabel.x = self.getContentSize().width/2;
        indexLabel.y = self.getContentSize().height/2;

        self.addChild(indexLabel, 5);


        return true;
    },

    getCol : function () {

        return this._pos_col;
    },

    getRow : function () {

        return this._pos_row;

    },

    getTypeIndex:function () {

        return this._type_index;
    },

    setRow : function (row) {

        this._pos_row = row;
    },

    setCol : function (col) {

        this._pos_col = col;
    }


});
