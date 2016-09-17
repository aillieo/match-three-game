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
        var blocksToRemoveRow = [];
        var blocksToRemoveCol = [];

        var length = allBlocks.length;
        for (var i =0 ; i<length ;i++){

            self.checkChainsForCertainBlock(allBlocks[i],allBlocks,blocksToRemoveRow,blocksToRemoveCol);

        }

        for (var k =0 ; k<length ; k++){

            allBlocks[k].ignoreCheckInRow = false;
            allBlocks[k].ignoreCheckInCol = false;

        }


        if(blocksToRemoveRow.length ==0 && blocksToRemoveCol.length == 0){

            return false;

        }


        len = blocksToRemoveRow.length;
        for(var j = 0 ; j< len ;j++){

            if(blocksToRemoveCol.indexOf(blocksToRemoveRow[j]) != -1){

                blocksToRemoveRow[j].setSuperPower(2);
            }


        }


        return true;




        
    },


    checkChainsForCertainBlock : function(certainBlock,allBlocks,blocksToRemoveRow,blocksToRemoveCol){


        var self = this;

        var chainInRow = self.getChainInRow(certainBlock,allBlocks);
        var chainInCol = self.getChainInCol(certainBlock,allBlocks);

        var arrayPush = function (ary,itm) {
            if(ary.indexOf(itm)==-1){
                ary.push(itm);
                itm.markToRemove();
            }
            return ary;
        };


        var lenRow = chainInRow.length;
        var lenCol = chainInCol.length;



        blocksToRemoveRow = chainInRow.reduce(arrayPush,blocksToRemoveRow);
        if(lenRow >=5)
        {
            for(var k = 0; k< lenRow ; k++){
                if(chainInRow[k].getSuperPower() == 0){
                    chainInRow[k].setSuperPower(3);
                    break;
                }
            }

        }
        else if(lenRow == 4){

            for(var k = 0; k< lenRow ; k++){
                if(chainInRow[k].getSuperPower() == 0){
                    chainInRow[k].setSuperPower(1);
                    break;
                }
            }

        }



        blocksToRemoveCol = chainInCol.reduce(arrayPush,blocksToRemoveCol);
        if(lenCol >=5)
        {
            for(var j = 0; j< lenCol ; j++){
                if(chainInCol[j].getSuperPower() == 0){
                    chainInCol[j].setSuperPower(3);
                    break;
                }
            }
        }
        else if(lenCol == 4){
            for(var j = 0; j< lenCol ; j++){
                if(chainInCol[j].getSuperPower() == 0){
                    chainInCol[j].setSuperPower(1);
                    break;
                }
            }
        }


    },


    getChainInCol : function (block,allBlocks) {

        if(block == null || block.ignoreCheckInCol){
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

        var len = blocks.length;
        if(len >= 3){

            for(var j = 0; j < len ; j++)
            {
                blocks[j].ignoreCheckInCol = true;
            }

            return blocks;
        }

        return [];
        
    },
    
    getChainInRow : function (block,allBlocks) {


        if(block == null || block.ignoreCheckInRow){
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

        var len = blocks.length;
        if(len>=3) {

            for (var j = 0; j < len; j++) {
                blocks[j].ignoreCheckInRow = true;
            }
            return blocks;

        }

        return [];


    },


    checkDeath : function(allBlocks){

        return this.checkDeathInRow(allBlocks) && this.checkDeathInCol(allBlocks) ;
    },

    checkDeathInRow : function(allBlocks){

        //total 8 cases
        //
        //when have 2 blocks adjacent to each other and find the third one
        //there are 6 cases a-f shown below
        //
        ///////|C|///|E|///////////
        /////|A|/|O|o|/|B|/////////
        ///////|D|///|F|///////////
        //
        //when have 2 blocks not adjacent and find the third one
        //there are 2 cases g-h shown below
        //
        ///////////|G|/////////////
        /////////|O|/|o|///////////
        ///////////|H|/////////////




        var cols = GlobalPara.columns;
        var rows = GlobalPara.rows;


        //first 6 cases
        var getBlockInPosA = function (currentRow,currentCol) {
            //currentRow;
            currentCol -= 2;
            if(currentCol>=0){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosB = function (currentRow,currentCol) {
            //currentRow;
            currentCol += 3;
            if(currentCol<cols) {
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosC = function (currentRow,currentCol) {
            currentRow += 1;
            currentCol -= 1;
            if(currentCol>=0 && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosD = function (currentRow,currentCol) {
            currentRow -= 1;
            currentCol -= 1;
            if(currentCol>=0 && currentRow>=0){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosE = function (currentRow,currentCol) {
            currentRow += 1;
            currentCol += 2;
            if(currentCol<cols && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosF = function (currentRow,currentCol) {
            currentRow -= 1;
            currentCol += 2;
            if(currentCol>=0 && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };

        //last 2 cases
        var getBlockInPosG = function (currentRow,currentCol) {
            currentRow += 1;
            currentCol += 1;
            if(currentCol<cols && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosH = function (currentRow,currentCol) {
            currentRow -= 1;
            currentCol += 1;
            if(currentCol>=0 && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };


        for(var r = 0 ; r < rows ; r++)
        {
            for(var c = 0 ; c +1  < cols ;c++) {

                var idx = allBlocks[r * cols + c].getTypeIndex();

                //first 6 cases
                if ( idx == allBlocks[r * cols + c + 1].getTypeIndex()){

                    if(getBlockInPosA(r,c) &&  getBlockInPosA(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posA");
                        return false;
                    }
                    if(getBlockInPosB(r,c) &&  getBlockInPosB(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posB");
                        return false;
                    }
                    if(getBlockInPosC(r,c) &&  getBlockInPosC(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posC");
                        return false;
                    }
                    if(getBlockInPosD(r,c) &&  getBlockInPosD(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posD");
                        return false;
                    }
                    if(getBlockInPosE(r,c) &&  getBlockInPosE(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posE");
                        return false;
                    }
                    if(getBlockInPosF(r,c) &&  getBlockInPosF(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posF");
                        return false;
                    }

                }

                //last 2 cases
                if(c + 2< cols && idx == allBlocks[r * cols + c + 2].getTypeIndex()){
                    if(getBlockInPosG(r,c) &&  getBlockInPosG(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posG");
                        return false;
                    }
                    if(getBlockInPosH(r,c) &&  getBlockInPosH(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"row find posH");
                        return false;
                    }
                }

            }
        }


        return true;

    },

    checkDeathInCol : function(allBlocks){



        //total 8 cases
        //
        //when have 2 blocks adjacent to each other and find the third one
        //there are 6 cases a-f shown below
        //
        ////////////////////////////
        ///////////|A|//////////////
        /////////|B|/|C|////////////
        ///////////|o|//////////////
        ///////////|O|//////////////
        /////////|D|/|E|////////////
        ///////////|F|//////////////
        ////////////////////////////
        //
        //when have 2 blocks not adjacent and find the third one
        //there are 2 cases g-h shown below
        //
        ////////////////////////////
        ///////////|o|/////////////
        /////////|G|/|H|///////////
        ///////////|O|/////////////
        ////////////////////////////





        var cols = GlobalPara.columns;
        var rows = GlobalPara.rows;


        //first 6 cases
        var getBlockInPosA = function (currentRow,currentCol) {
            currentRow += 3;
            if(currentRow < rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosB = function (currentRow,currentCol) {
            currentRow += 2;
            currentCol -= 1;
            if(currentCol>=0 && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosC = function (currentRow,currentCol) {
            currentRow += 2;
            currentCol += 1;
            if(currentCol<cols && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosD = function (currentRow,currentCol) {
            currentRow -= 1;
            currentCol -= 1;
            if(currentCol>=0 && currentRow>=0){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosE = function (currentRow,currentCol) {
            currentRow -= 1;
            currentCol += 1;
            if(currentCol<cols && currentRow>=0){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosF = function (currentRow,currentCol) {
            currentRow -= 2;
            if(currentRow>=0 ){
                return allBlocks[currentRow * cols + currentCol];
            }
        };

        //last 2 cases
        var getBlockInPosG = function (currentRow,currentCol) {
            currentRow += 1;
            currentCol -= 1;
            if(currentCol>=0 && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };
        var getBlockInPosH = function (currentRow,currentCol) {
            currentRow += 1;
            currentCol += 1;
            if(currentCol<cols && currentRow<rows){
                return allBlocks[currentRow * cols + currentCol];
            }
        };


        for(var r = 0 ; r + 1< rows ; r++)
        {
            for(var c = 0 ; c< cols ;c++) {

                var idx = allBlocks[r * cols + c].getTypeIndex();

                //first 6 cases
                if ( idx == allBlocks[(r+1) * cols + c].getTypeIndex()){

                    if(getBlockInPosA(r,c) &&  getBlockInPosA(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posA");
                        return false;
                    }
                    if(getBlockInPosB(r,c) &&  getBlockInPosB(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posB");
                        return false;
                    }
                    if(getBlockInPosC(r,c) &&  getBlockInPosC(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posC");
                        return false;
                    }
                    if(getBlockInPosD(r,c) &&  getBlockInPosD(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posD");
                        return false;
                    }
                    if(getBlockInPosE(r,c) &&  getBlockInPosE(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posE");
                        return false;
                    }
                    if(getBlockInPosF(r,c) &&  getBlockInPosF(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posF");
                        return false;
                    }

                }

                //last 2 cases
                if(r + 2 < rows && idx == allBlocks[(r + 2) * cols + c ].getTypeIndex()){
                    if(getBlockInPosG(r,c) &&  getBlockInPosG(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posG");
                        return false;
                    }
                    if(getBlockInPosH(r,c) &&  getBlockInPosH(r,c).getTypeIndex() == idx) {
                        //cc.log(idx,"col find posH");
                        return false;
                    }
                }

            }
        }


        return true;


    },

    checkChainsAfterOperation : function (blockSource, blockTarget, allBlocks) {

        if(blockSource.getTypeIndex() == 0 || blockTarget.getTypeIndex() == 0){

            blockSource.markToRemove();
            blockTarget.markToRemove();
            return true;

        }

        var self = this;
        var blocksToRemoveRow = [];
        var blocksToRemoveCol = [];

        self.checkChainsForCertainBlock(blockSource,allBlocks,blocksToRemoveRow,blocksToRemoveCol);
        self.checkChainsForCertainBlock(blockTarget,allBlocks,blocksToRemoveRow,blocksToRemoveCol);

        var length = allBlocks.length;
        for (var k =0 ; k<length ; k++){

            allBlocks[k].ignoreCheckInRow = false;
            allBlocks[k].ignoreCheckInCol = false;

        }


        if(blocksToRemoveRow.length ==0 && blocksToRemoveCol.length == 0){

            return false;

        }


        len = blocksToRemoveRow.length;
        for(var j = 0 ; j< len ;j++){

            if(blocksToRemoveCol.indexOf(blocksToRemoveRow[j]) != -1){

                blocksToRemoveRow[j].setSuperPower(2);
            }


        }


        return true;





    },






});
