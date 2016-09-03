
var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LayerBlocks();
        this.addChild(layer);
    }
});

