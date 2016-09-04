/**
 * Created by aillieo on 16/9/3.
 */



var LayerBlocks = cc.Layer.extend({
    _basePoint:null,
    _blocks:[],
    _isAnimationing:false,
    _blocksToRemove:null,
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


        self.scheduleUpdate();

        return true;
    },


    initMatrix:function(){


        var self = this;

        var size = cc.winSize;
        var itemWidth = GlobalPara.blockWidth;
        //var itemWidth = 90;



        var px = 0.5* (size.width - GlobalPara.columns * itemWidth - (GlobalPara.columns - 1)* GlobalPara.blockGap) + 0.5*itemWidth;
        var py = 0.5* (size.height - GlobalPara.rows * itemWidth - (GlobalPara.rows - 1)* GlobalPara.blockGap) + 0.5*itemWidth;
        self._basePoint = new cc.Point(px,py);

        self._blocks = new Array(GlobalPara.columns * GlobalPara.rows);
        self._blocksToRemove = [];

        for(var r = 0; r<GlobalPara.rows; r++) {

            for(var c = 0; c<GlobalPara.columns; c++){

                self.createAndDropBlock(r,c);

            }

        }



    },


    createAndDropBlock:function(row,col) {

        var self = this;
        var size = cc.winSize;

        var block = new BlockElement(row,col);

        var pDest = self.getPositionByDim(row,col);
        var pFrom = new cc.Point(pDest.x , pDest.y + 500);
        block.setPosition(pFrom);
        self.addChild(block);
        self._blocks[row * GlobalPara.columns + col] = block;
        //cc.log(row * GlobalPara.columns + col);

        block.stopAllActions();
        var mv = new cc.moveTo(0.5,pDest);
        block.runAction(mv);



    },

    getPositionByDim:function(row,col) {

        //var width = BlockElement.width;
        var width = 90;
        var self = this;
        var x = self._basePoint.x + col*(width + GlobalPara.blockGap);
        var y = self._basePoint.y + row*(width + GlobalPara.blockGap);
        return new cc.Point(x,y);

    },

    
    update : function (delta) {

        //cc.log(delta);

        var self = this;

        if (self._isAnimationing) {
            self._isAnimationing = false;
            for (var i = 0; i < GlobalPara.columns * GlobalPara.rows; i++) {
                var blk = self._blocks[i];
                if (blk!=undefined && blk.getNumberOfRunningActions() > 0) {
                    self._isAnimationing  = true;
                    break;
                }
            }
        }
        if (!self._isAnimationing) {
            self.checkAndRemoveChain();
            self.unscheduleUpdate();
        }
    },
    
    
    checkAndRemoveChain : function () {

        var self = this;
        self._blocksToRemove.splice(0,self._blocksToRemove.length);

        var blocksSize = GlobalPara.columns * GlobalPara.rows;
        for (var i =0 ; i<blocksSize ;i++){

            var chainInRow = self.getChainInRow(self._blocks[i]);
            var chainInCol = self.getChainInCol(self._blocks[i]);

            var arrayPush = function (ary,itm) {
                if(ary.indexOf(itm)==-1){
                    ary.push(itm);
                }
                return ary;
            };
            
            if (chainInRow.length >=3){
                self._blocksToRemove = chainInRow.reduce(arrayPush,self._blocksToRemove);
            }
            if (chainInCol.length >=3) {
                self._blocksToRemove = chainInCol.reduce(arrayPush,self._blocksToRemove);
            }


        }

        self.removeBlocks();
        
        
    },
    
    
    getChainInCol : function (block) {


        var self = this;

        var blocks = new Array(block);

        var neighborRow = block.getRow() - 1;
        while (neighborRow >= 0) {
            var previousBlock = self._blocks[neighborRow * GlobalPara.columns + block.getCol()];
            if (previousBlock && (previousBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(previousBlock);
                neighborRow--;
            } else {
                break;
            }
        }
        neighborRow = block.getRow() + 1;
        while (neighborRow < GlobalPara.rows) {
            var nextBlock =  self._blocks[neighborRow * GlobalPara.columns + block.getCol()];
            if (nextBlock && (nextBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(nextBlock);
                neighborRow++;
            } else {
                break;
            }
        }

        return blocks;
        
    },
    
    getChainInRow : function (block) {

        var self = this;

        var blocks = new Array(block);


        var neighborCol = block.getCol() - 1;
        while (neighborCol >= 0) {
            var previousBlock = self._blocks[block.getRow() * GlobalPara.columns + neighborCol];
            if (previousBlock && (previousBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(previousBlock);
                neighborCol--;
            } else {
                break;
            }
        }
        neighborCol = block.getCol() + 1;
        while (neighborCol < GlobalPara.columns) {
            var nextBlock =  self._blocks[block.getRow() * GlobalPara.columns + neighborCol];
            if (nextBlock && (nextBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(nextBlock);
                neighborCol++;
            } else {
                break;
            }
        }

        return blocks;


    },
    
    
    removeBlocks : function () {



        var self = this;
        var length = self._blocksToRemove.length;
        cc.log(length);
        for( var i = 0 ; i<length;i++) {

            self._blocksToRemove[i].setScale(0.5);

        }

    }
    
    
});



