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
                        cc.log(idx,"row find posA");
                        return false;
                    }
                    if(getBlockInPosB(r,c) &&  getBlockInPosB(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posB");
                        return false;
                    }
                    if(getBlockInPosC(r,c) &&  getBlockInPosC(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posC");
                        return false;
                    }
                    if(getBlockInPosD(r,c) &&  getBlockInPosD(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posD");
                        return false;
                    }
                    if(getBlockInPosE(r,c) &&  getBlockInPosE(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posE");
                        return false;
                    }
                    if(getBlockInPosF(r,c) &&  getBlockInPosF(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posF");
                        return false;
                    }

                }

                //last 2 cases
                if(c + 2< cols && idx == allBlocks[r * cols + c + 2].getTypeIndex()){
                    if(getBlockInPosG(r,c) &&  getBlockInPosG(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posG");
                        return false;
                    }
                    if(getBlockInPosH(r,c) &&  getBlockInPosH(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"row find posH");
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
                        cc.log(idx,"col find posA");
                        return false;
                    }
                    if(getBlockInPosB(r,c) &&  getBlockInPosB(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posB");
                        return false;
                    }
                    if(getBlockInPosC(r,c) &&  getBlockInPosC(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posC");
                        return false;
                    }
                    if(getBlockInPosD(r,c) &&  getBlockInPosD(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posD");
                        return false;
                    }
                    if(getBlockInPosE(r,c) &&  getBlockInPosE(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posE");
                        return false;
                    }
                    if(getBlockInPosF(r,c) &&  getBlockInPosF(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posF");
                        return false;
                    }

                }

                //last 2 cases
                if(r + 2 < rows && idx == allBlocks[(r + 2) * cols + c ].getTypeIndex()){
                    if(getBlockInPosG(r,c) &&  getBlockInPosG(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posG");
                        return false;
                    }
                    if(getBlockInPosH(r,c) &&  getBlockInPosH(r,c).getTypeIndex() == idx) {
                        cc.log(idx,"col find posH");
                        return false;
                    }
                }

            }
        }


        return true;


    },






});
