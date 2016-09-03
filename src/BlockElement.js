/**
 * Created by aillieo on 16/9/3.
 */


var BlockElement = cc.Sprite.extend({
    itemWidth:90,
    _pos_col:0,
    _pos_row:0,
    type_index:0,
    ctor:function (row,col) {

        this._super();

        var self = this;
        self.setTexture(res.block_default);
        //种类 0 - 5
        self.type_index = cc.random0To1() * 6;
        self.type_index = Math.round(self.type_index);
        self._pos_col = col;
        self._pos_row = row;

        var indexLabel = new cc.LabelTTF(self.type_index.toString(), "Arial", 38);


        indexLabel.x = 45;//self.getContentSize().width/2;
        indexLabel.y = 45;//self.getContentSize().height/2;

        self.addChild(indexLabel, 5);


        return true;
    }
});
