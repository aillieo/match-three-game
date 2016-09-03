/**
 * Created by aillieo on 16/9/3.
 */



var LayerBlocks = cc.Layer.extend({
    _X_dim:7,
    _Y_dim:9,
    _blocksGap:5,
    _basePoint:null,
    _blocks:[],
    ctor:function () {


        this._super();

        var self= this;
        var size = cc.winSize;

        var bg = new cc.Sprite(res.HelloWorld_png);
        bg.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        self.addChild(bg, -1);


        self.initMatrix();


        return true;
    },


    initMatrix:function(){


        var self = this;

        var size = cc.winSize;
        //var width = BlockElement.width;
        var itemWidth = 90;



        var px = 0.5* (size.width - self._X_dim * itemWidth - (self._X_dim - 1)* self._blocksGap) + 0.5*itemWidth;
        var py = 0.5* (size.height - self._Y_dim * itemWidth - (self._Y_dim - 1)* self._blocksGap) + 0.5*itemWidth;
        self._basePoint = new cc.Point(px,py);



        for(var r = 0; r<self._Y_dim; r++) {

            for(var c = 0; c<self._X_dim; c++){

                self.createAndDropBlock(r,c);

            }

        }



    },


    createAndDropBlock:function(row,col) {

        var self = this;
        var size = cc.winSize;

        var block = new BlockElement(row,col);
        //var block = new BlockElement();

        block.setPosition(self.getPositionByDim(row,col));
        self.addChild(block);
        self._blocks.push(block);


    },

    getPositionByDim:function(row,col) {

        //var width = BlockElement.width;
        var width = 90;
        var self = this;
        var x = self._basePoint.x + col*(width + self._blocksGap);
        var y = self._basePoint.y + row*(width + self._blocksGap);
        return new cc.Point(x,y);

    }

});



