/**
 * Created by aillieo on 16/9/3.
 */



var LayerBlocks = cc.Layer.extend({
    _basePoint:null,
    _blocks:[],
    _hasBlockAnimation:true,
    _blocksToRemove:[],
    _needFillWithNewBlocks:false,
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

        if (self._hasBlockAnimation) {
            self._hasBlockAnimation = false;
            var len = GlobalPara.columns * GlobalPara.rows;
            for (var i = 0; i < len; i++) {
                var blk = self._blocks[i];
                if (blk!=undefined && blk.getNumberOfRunningActions() > 0) {
                    self._hasBlockAnimation  = true;
                    break;
                }
            }
        }
        if (!self._hasBlockAnimation) {

            if(self._needFillWithNewBlocks){

                self.fillWithNewBlocks();
            }
            else
            {
                if(self.checkChains())
                {
                    self.removeBlocks();

                }
            }


        }


        //适当的时候
        cc.eventManager.dispatchCustomEvent("ENABLE_TOUCH");

    },


    checkChains : function () {

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


        //cc.log(self._blocksToRemove.length);







        return (self._blocksToRemove.length>0);

        
    },
    
    
    getChainInCol : function (block) {

        if(block == null){
            return [];
        }

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


        if(block == null){
            return [];
        }


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

        //cc.log(length);

        var setNull = function(target,data){

            var c = this._blocksToRemove[data].getCol();
            var r = this._blocksToRemove[data].getRow();
            this._blocks[r * GlobalPara.columns + c] = null;

        };

        var setNeedFill = function(target){

            if(!self._needFillWithNewBlocks){
                self._needFillWithNewBlocks = true;

            }
        };


        for( var i = 0 ; i<length;i++) {

            var fo =  cc.fadeOut(0.5);
            var cb_1 =  cc.callFunc(setNull,self,i);
            var cb_2 =  cc.removeSelf();
            var cb_3 =  cc.callFunc(setNeedFill,self);
            var seq =  cc.sequence(fo,cb_1,cb_2,cb_3);
            self._blocksToRemove[i].runAction(seq);


        }

        self._hasBlockAnimation = true;




    },
    
    
    fillWithNewBlocks : function () {

        var self = this;

        self._hasBlockAnimation = true;


        var blanksInCol = new Array(GlobalPara.columns);
        for (var col = 0; col < GlobalPara.columns; col++) {

            var blanks = 0;
            for (var row = 0; row < GlobalPara.rows; row++) {

                var blk = self._blocks[row * GlobalPara.columns + col];
                if ( blk == null){

                    blanks++;

                }
                else{

                    if(blanks>0){

                        //var newRow = row - blanks;
                        self._blocks[(row - blanks) * GlobalPara.columns + col] = blk;
                        self._blocks[row * GlobalPara.columns + col] = null;
                        blk.setRow(row - blanks);
                        blk.stopAllActions();
                        var mt = cc.moveTo(0.5,self.getPositionByDim(row - blanks,col));
                        blk.runAction(mt);

                    }

                }



            }


            blanksInCol[col] = blanks;


        }



        for(var col_1 = 0; col_1<GlobalPara.columns; col_1++){

            for (var row_1 = GlobalPara.rows - blanksInCol[col_1]; row_1 < GlobalPara.rows; row_1++) {
                self.createAndDropBlock(row_1, col_1);
            }

        }


            /*



                    // 2. 创建新的寿司精灵并让它落到上方空缺的位置
                    for (int col = 0; col < m_width; col++) {
                        for (int row = m_height - colEmptyInfo[col]; row < m_height; row++) {
                            createAndDropSushi(row, col);
                        }
                    }
            */

        self._needFillWithNewBlocks = false;
        //self._hasBlockAnimation = true;

    }
    

});



