
var SceneMain = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer1 = new LayerBlocks();
        this.addChild(layer1);
        var layer2 = new LayerOperation();
        this.addChild(layer2);
        var layer3 = new LayerUI();
        this.addChild(layer3);
    }
});

