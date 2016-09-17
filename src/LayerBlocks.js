/**
 * Created by aillieo on 16/9/3.
 */



var LayerBlocks = cc.Layer.extend({
    _blockCreator:null,
    _chainFinder:null,
    _basePoint:null,
    _blockSource:null,
    _blockTarget:null,
    _blocks:[],
    _hasBlockAnimation:true,
    _needSwapAgain:false,
    _needFillWithNewBlocks:false,
    _layerOperationEnabled:false,
    _needCheckDeath:true,
    upperDisplayBound:0,
    _offsetY:-120,
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

        self._blockCreator = new BlockCreator();
        self.addChild(self._blockCreator);

        self._chainFinder = new ChainFinder();
        self.addChild(self._chainFinder);

        self.initMatrix();


        var operationListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target : self,
            eventName: "OPERATION",
            callback: self.handleOperation
        });
        cc.eventManager.addListener(operationListener,self);




        self.scheduleUpdate();








        return true;
    },


    initMatrix:function(){


        var self = this;

        var size = cc.winSize;
        var itemWidth = GlobalPara.blockWidth;



        var px = 0.5* (size.width - GlobalPara.columns * itemWidth - (GlobalPara.columns - 1)* GlobalPara.blockGap) + 0.5*itemWidth;
        var py = 0.5* (size.height - GlobalPara.rows * itemWidth - (GlobalPara.rows - 1)* GlobalPara.blockGap) + 0.5*itemWidth + self._offsetY;
        self._basePoint = cc.p(px,py);


        var matrixHeight = (itemWidth+GlobalPara.blockGap)*GlobalPara.rows;
        self._upperDisplayBound = py + matrixHeight + 0*itemWidth;

        self._blocks = new Array(GlobalPara.columns * GlobalPara.rows);
        self._blocksToRemove = [];

        for(var r = 0; r<GlobalPara.rows; r++) {

            for(var c = 0; c<GlobalPara.columns; c++){

                self.createAndDropBlock(r,c,matrixHeight);

            }

        }



    },

    createAndDropBlock:function(row,col,dropHeight) {

        var self = this;

        var block = self._blockCreator.createRandomBlock();
        block.setRow(row);
        block.setCol(col);
        
        block.setVisible(false);

        //var dropHeight = blanks * (GlobalPara.blockGap+GlobalPara.blockWidth);
        var pDest = self.getPositionByDim(row,col);
        var pFrom = cc.p(pDest.x , pDest.y + dropHeight);
        block.setPosition(pFrom);
        self.addChild(block);
        self._blocks[row * GlobalPara.columns + col] = block;

        block.stopAllActions();
        var t = Math.sqrt(dropHeight )/ GlobalPara.dropSpeedFactor;
        var mv = new cc.jumpTo(t,pDest,0,1);
        block.runAction(mv);



    },

    getPositionByDim:function(row,col) {

        var width = GlobalPara.blockWidth;
        var self = this;
        var x = self._basePoint.x + col*(width + GlobalPara.blockGap);
        var y = self._basePoint.y + row*(width + GlobalPara.blockGap);
        return cc.p(x,y);

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
                    
                    if (!self._hasBlockAnimation) {
                        self._hasBlockAnimation  = true;
                    }
                    if (blk.y >self._upperDisplayBound) {
                        
                        blk.setVisible(false);
                    }
                    else {
                        
                        blk.setVisible(true);
                    }
                    
                }
            }
        }

        if (!self._hasBlockAnimation) {

            if(self._needFillWithNewBlocks){

                self.fillWithNewBlocks();
            }
            else
            {
                if(self._needSwapAgain && self._chainFinder.checkChainsAfterOperation(self._blockSource, self._blockTarget, self._blocks)) {
                    self._needSwapAgain = false;
                    self.removeBlocks();
                }
                else if(!self._needSwapAgain && self._chainFinder.checkChains(self._blocks)){

                    self.removeBlocks();

                }
                else{


                    if(self._needSwapAgain){


                        self.swapBlockPos(self._blockTarget, self._blockSource);
                        self._needSwapAgain = false;
                        return;
                    }


                    if(self._needCheckDeath){

                        if(!self._chainFinder.checkDeath(self._blocks)){
                            self._needCheckDeath = false;
                        }
                        else{
                            self.shuffleBlocks();
                        }

                    }

                    else{
                        if(!self._layerOperationEnabled) {

                            self._layerOperationEnabled = true;
                            cc.eventManager.dispatchCustomEvent("ENABLE_TOUCH");
                        }
                    }
                }
            }


        }
        else{

            if(self._layerOperationEnabled) {

                self._layerOperationEnabled = false;
                cc.eventManager.dispatchCustomEvent("DISABLE_TOUCH");
            }

        }



    },

    removeBlocks : function () {



        var self = this;
        var length = self._blocks.length;

        //cc.log(length);


        var setNull = function(target,data){

            //var c = this._blocks[data].getCol();
            //var r = this._blocks[data].getRow();
            //this._blocks[r * GlobalPara.columns + c] = null;
            this._blocks[data] = null;

        };

        var setNeedFill = function(target){

            if(!self._needFillWithNewBlocks){
                self._needFillWithNewBlocks = true;

            }
        };


        for( var i = 0 ; i<length;i++) {

            if(self._blocks[i].isToBeRemoved()){

                self._blocks[i].onRemove();
                var fo =  cc.fadeOut(0.2);
                var cb_1 =  cc.callFunc(setNull,self,i);
                var cb_2 =  cc.removeSelf();
                var cb_3 =  cc.callFunc(setNeedFill,self);
                var seq =  cc.sequence(fo,cb_1,cb_2,cb_3);
                self._blocks[i].runAction(seq);

                self.addScore(10);

            }


        }

        self._hasBlockAnimation = true;
        self._needCheckDeath = true;




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
                        var t = Math.sqrt((GlobalPara.blockWidth+GlobalPara.blockGap)* blanks)/ GlobalPara.dropSpeedFactor;
                        var mt = cc.jumpTo(t,self.getPositionByDim(row - blanks,col),0,1);
                        blk.runAction(mt);

                    }

                }



            }


            blanksInCol[col] = blanks;


        }



        for(var col_1 = 0; col_1<GlobalPara.columns; col_1++){

            for (var row_1 = GlobalPara.rows - blanksInCol[col_1]; row_1 < GlobalPara.rows; row_1++) {
                self.createAndDropBlock(row_1, col_1, (GlobalPara.blockGap+GlobalPara.blockWidth)*blanksInCol[col_1]);
            }

        }


        self._needFillWithNewBlocks = false;
        //self._hasBlockAnimation = true;

    },


    getBlockContainingPoint : function (p) {



        var self = this;

        var length = self._blocks.length;
        for (var i =0 ; i<length ;i++){
            if(cc.rectContainsPoint(this._blocks[i].getBoundingBox(),p)){


                return this._blocks[i];
            }
        }





    },

    handleOperation:function(event){


        var self = event.getCurrentTarget();

        var dat = event.getUserData();

        var p = dat.pt;
        var dir = dat.dir;

        self._blockSource = self.getBlockContainingPoint(p);




        var dtRow = 0;
        var dtCol = 0;


        if(dir == "up"){
            dtRow = 1;
        }
        else if(dir == "down"){
            dtRow = -1;
        }
        else if(dir == "left"){
            dtCol = -1;
        }
        else if(dir == "right"){
            dtCol = 1;
        }


        self._blockTarget = self.getNeighborBlock(self._blockSource,dtRow,dtCol);

        //cc.log(dir);

        //self._blockSource.setScale(0.5);
        //self._blockTarget.setScale(0.5);
        self.swapBlockPos(self._blockTarget, self._blockSource);
        self._needSwapAgain = true;

    },

    getNeighborBlock :function(blockRef,deltaRow,deltaCol){

        var self = this;

        var r = blockRef.getRow();
        var c = blockRef.getCol();
        r = r + deltaRow;
        c = c + deltaCol;
        if(c>= 0 && c< GlobalPara.columns && r>=0 && r < GlobalPara.rows){
            return self._blocks[r * GlobalPara.columns + c];

        }


    },

    swapBlockPos : function(block1,block2){


        if (!block1 || !block2) {
            return;
        }



        var self = this;

        var row1 = block1.getRow();
        var col1 = block1.getCol();
        var row2 = block2.getRow();
        var col2 = block2.getCol();
        //cc.log("row1:",row1,"row2:",row2);
        //cc.log("col1:",col1,"col2:",col2);

        var index1 = self._blocks.indexOf(block1);
        var index2 = self._blocks.indexOf(block2);

        var pos1 = self.getPositionByDim(row1,col1);
        var pos2 = self.getPositionByDim(row2,col2);

        //cc.log("pos1",pos1,block1.getPosition());



        var t = 0.12*( GlobalPara.blockGap + GlobalPara.blockWidth) / GlobalPara.dropSpeedFactor;

        var mt1 = cc.moveTo(t,pos2);
        var mt2 = cc.moveTo(t,pos1);

        //cc.log(mt1);
        //cc.log(mt2);



        block1.runAction(mt1);
        block2.runAction(mt2);



        self._hasBlockAnimation = true;



        block1.setCol(col2);
        block1.setRow(row2);
        block2.setCol(col1);
        block2.setRow(row1);


        self._blocks[index1] = block2;
        self._blocks[index2] = block1;



        //cc.log("finish",col1,row1,index1,col2,row2,index2);

    },

    shuffleBlocks : function () {

        cc.log("shuffle");

        var self = this;

        self._blocks.sort(function(blk1,blk2){
            return blk1.getShuffleTag() - blk2.getShuffleTag();
        });


        var cols = GlobalPara.columns;
        var rows = GlobalPara.rows;
        for(var r = 0;r<rows ; r++){

            for(var c =0; c<cols;c++){

                var block = self._blocks[r*cols + c];
                block.setCol(c);
                block.setRow(r);
                var pos = self.getPositionByDim(r,c);

                var fo = cc.fadeOut(0.2);
                var cb = cc.callFunc(function (target,pos) {
                    target.setPosition(pos);
                },block,pos);
                var fi = cc.fadeIn(0.2);
                var seq = cc.sequence(fo,cb,fi);

                block.runAction(seq);

            }

        }

        self._hasBlockAnimation = true;


    },

    addScore : function (score) {

        var dat = {
            score : score
        };
        cc.eventManager.dispatchCustomEvent("ADD_SCORE",dat);

    }



});



