// 反诈雷达 AE 项目自动搭建脚本
// 使用方法：File -> Scripts -> Run Script File... 选择本文件

(function () {
    app.beginUndoGroup("Build AntiFraud Radar Project");

    var W = 1920, H = 1080, FPS = 30;
    var SHOT_DUR = 6; // 每镜头6秒
    var MAIN_DUR = 45;

    function addComp(name, dur) {
        return app.project.items.addComp(name, W, H, 1, dur, FPS);
    }

    function addAdjustment(comp) {
        var solid = comp.layers.addSolid([0,0,0], "ADJ_Grade", W, H, 1);
        solid.adjustmentLayer = true;

        try {
            var glow = solid.property("Effects").addProperty("ADBE Glo2");
            glow.property("Glow Threshold").setValue(70);
            glow.property("Glow Radius").setValue(20);
            glow.property("Glow Intensity").setValue(0.45);
        } catch(e) {}

        try {
            var noise = solid.property("Effects").addProperty("ADBE Noise");
            noise.property("Amount of Noise").setValue(3);
            noise.property("Use Color Noise").setValue(false);
        } catch(e) {}

        try {
            var curves = solid.property("Effects").addProperty("ADBE CurvesCustom");
        } catch(e) {}

        solid.moveToBeginning();
        return solid;
    }

    function addPlaceholder(comp, name, color) {
        var l = comp.layers.addSolid(color, name, W, H, 1);
        l.property("Opacity").setValue(35);
        return l;
    }

    function addPushIn(comp, inT, outT, s0, s1) {
        for (var i = 1; i <= comp.layers.length; i++) {
            var ly = comp.layer(i);
            if (ly.adjustmentLayer) continue;
            ly.motionBlur = true;
            var sc = ly.property("Scale");
            sc.setValueAtTime(inT, [s0, s0]);
            sc.setValueAtTime(outT, [s1, s1]);
            sc.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
            sc.setTemporalEaseAtKey(2, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
        }
    }

    var main = addComp("MAIN", MAIN_DUR);

    var shots = [];
    for (var s = 1; s <= 6; s++) {
        var id = ("0" + s).slice(-2);
        var c = addComp("S" + id, SHOT_DUR);

        addPlaceholder(c, "S" + id + "_bg", [0.06, 0.06, 0.08]);
        addPlaceholder(c, "S" + id + "_ui", [0.12, 0.12, 0.16]);
        addPlaceholder(c, "S" + id + "_hud", [0.2, 0.35, 0.45]);
        addPlaceholder(c, "S" + id + "_text", [0.75, 0.75, 0.8]);

        addAdjustment(c);
        addPushIn(c, 0, SHOT_DUR, 100, 108);
        shots.push(c);
    }

    // S04 风险分数表达式（必做）
    var s04 = shots[3];
    var nullLayer = s04.layers.addNull();
    nullLayer.name = "Null 1";
    var slider = nullLayer.property("Effects").addProperty("ADBE Slider Control");
    slider.name = "Score";
    slider.property("Slider").setValueAtTime(0.5, 22);
    slider.property("Slider").setValueAtTime(4.5, 87);

    var txt = s04.layers.addText("22");
    txt.name = "RiskScore_Text";
    txt.property("Source Text").expression = 'Math.round(thisComp.layer("Null 1").effect("Score")("Slider"))';
    txt.property("Position").setValue([960, 540]);
    txt.property("Scale").setValue([220, 220]);

    // MAIN 串联6镜头
    var t = 0;
    for (var i = 0; i < shots.length; i++) {
        var pre = main.layers.add(shots[i]);
        pre.startTime = t;
        pre.motionBlur = true;
        t += SHOT_DUR;
    }

    // 在切点加 Light Sweep 占位（便于后续精修）
    for (var j = 1; j <= 5; j++) {
        var cutT = j * SHOT_DUR;
        var sweep = main.layers.addSolid([1,1,1], "TR_Sweep_" + j, W, H, 1, 0.4);
        sweep.startTime = cutT - 0.2;
        sweep.blendingMode = BlendingMode.SCREEN;
        sweep.property("Opacity").setValue(0);
        sweep.property("Opacity").setValueAtTime(cutT - 0.2, 0);
        sweep.property("Opacity").setValueAtTime(cutT, 45);
        sweep.property("Opacity").setValueAtTime(cutT + 0.2, 0);
    }

    main.openInViewer();
    app.endUndoGroup();

    alert("项目骨架已生成：MAIN + S01~S06。\n请替换占位层为 Figma 分层 PNG，并补充雷达/弹窗细节与音效。");
})();
