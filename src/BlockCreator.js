/**
 * Created by aillieo on 16/9/6.
 */



var BlockCreator = cc.Node.extend({

    ctor:function () {

        this._super();

        return true;

    },

    createRandomBlock:function(){
      
        var blk = new BlockElement();
              
        var typeIndex = cc.random0To1() * (GlobalPara.blockTypes - 1);
        typeIndex = Math.ceil(typeIndex);

        blk.setTypeIndex(typeIndex);
        return blk;
      
    }
 



});
