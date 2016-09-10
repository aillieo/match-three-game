/**
 * Created by aillieo on 16/9/6.
 */


var ChainFinder = cc.Node.extend({

    ctor:function () {

        this._super();

        return true;
    },
  
    
    
    checkChains : function (allBlocks) {

        var self = this;
        var blocksToRemove = [];

        var length = allBlocks.length;
        for (var i =0 ; i<length ;i++){


            var chainInRow = self.getChainInRow(allBlocks[i],allBlocks);
            var chainInCol = self.getChainInCol(allBlocks[i],allBlocks);

            var arrayPush = function (ary,itm) {
                if(ary.indexOf(itm)==-1){
                    ary.push(itm);
                }
                return ary;
            };

            if (chainInRow.length >=3){
                blocksToRemove = chainInRow.reduce(arrayPush,blocksToRemove);
            }
            if (chainInCol.length >=3) {
                blocksToRemove = chainInCol.reduce(arrayPush,blocksToRemove);
            }


        }


        //cc.log(self._blocksToRemove.length);
        
        length = blocksToRemove.length;
        for(var j = 0; j<length;j++){

            blocksToRemove[j].markToRemove();

/*            if(blocksToRemove.indexOf(allBlocks[j]) != -1){
                allBlocks[i].markToRemove();
                cc.log("mark rmv");

            }*/

        }
        
        return (length>0);







       // return blocksToRemove;

        
    },
    
    
    getChainInCol : function (block,allBlocks) {

        if(block == null){
            return [];
        }

        var self = this;

        var blocks = [];
        blocks.push(block);

        var neighborRow = block.getRow() - 1;
        while (neighborRow >= 0) {
            var previousBlock = allBlocks[neighborRow * GlobalPara.columns + block.getCol()];
            if (previousBlock && (previousBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(previousBlock);
                neighborRow--;
            } else {
                break;
            }
        }
        neighborRow = block.getRow() + 1;
        while (neighborRow < GlobalPara.rows) {
            var nextBlock =  allBlocks[neighborRow * GlobalPara.columns + block.getCol()];
            if (nextBlock && (nextBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(nextBlock);
                neighborRow++;
            } else {
                break;
            }
        }

        return blocks;
        
    },
    
    getChainInRow : function (block,allBlocks) {


        if(block == null){
            return [];
        }


        var self = this;

        var blocks = [];
        blocks.push(block);



        var neighborCol = block.getCol() - 1;
        while (neighborCol >= 0) {
            var previousBlock = allBlocks[block.getRow() * GlobalPara.columns + neighborCol];
            if (previousBlock && (previousBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(previousBlock);
                neighborCol--;
            } else {
                break;
            }
        }
        neighborCol = block.getCol() + 1;
        while (neighborCol < GlobalPara.columns) {
            var nextBlock =  allBlocks[block.getRow() * GlobalPara.columns + neighborCol];
            if (nextBlock && (nextBlock.getTypeIndex() == block.getTypeIndex())) {
                blocks.push(nextBlock);
                neighborCol++;
            } else {
                break;
            }
        }

        return blocks;


    },


    checkDeath : function(allBlocks){

        return this.checkDeathInCol(allBlocks) && this.checkDeathInRow(allBlocks);
    },

    checkDeathInRow : function(allBlocks){

        //8种情况
        //两个相邻 找第三个 6种
        //两个不相邻 找第三个 2种






        return false;

    },

    checkDeathInCol : function(allBlocks){






        return false;

    },






});
