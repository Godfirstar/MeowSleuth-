// build_project.jsx - Auto build AE project for 反诈雷达
(function () {
    app.beginUndoGroup("Build AntiFraud Radar Project");

    var root = "C:/Users/FIRST/Desktop/projects";
    var assetsDir = new Folder(root + "/assets");
    var deliverDir = new Folder(root + "/deliverables");
    var outDir = new Folder(root + "/ae/out");
    if (!outDir.exists) outDir.create();

    if (!app.project) app.newProject();
    var proj = app.project;

    var width = 1920, height = 1080, fps = 30.0, pixelAspect = 1.0;

    function readCSV(path) {
        var f = new File(path);
        if (!f.exists) throw new Error("CSV not found: " + path);
        f.open("r");
        var txt = f.read();
        f.close();
        var lines = txt.split(/\r?\n/);
        var rows = [];
        for (var i = 1; i < lines.length; i++) {
            if (!lines[i] || lines[i].replace(/\s/g, "") === "") continue;
            var m = lines[i].match(/^([^,]+),([^,]+),([^,]+),([^,]+),"?(.*)"?$/);
            if (!m) continue;
            rows.push({ Shot: m[1], Start: parseFloat(m[2]), End: parseFloat(m[3]), Duration: parseFloat(m[4]), Notes: m[5] });
        }
        return rows;
    }

    function importPNG(path) {
        var f = new File(path);
        if (!f.exists) throw new Error("Missing PNG: " + path);
        return proj.importFile(new ImportOptions(f));
    }

    function addAdjustment(comp) {
        var adj = comp.layers.addSolid([0, 0, 0], "ADJ_Global", width, height, pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        try {
            var glow = adj.property("Effects").addProperty("ADBE Glo2");
            glow.property("Glow Threshold").setValue(75);
            glow.property("Glow Radius").setValue(28);
            glow.property("Glow Intensity").setValue(0.55);
        } catch (e) {}
        try {
            var noise = adj.property("Effects").addProperty("ADBE Noise");
            noise.property("Amount of Noise").setValue(4);
            noise.property("Use Color Noise").setValue(false);
        } catch (e2) {}
        try { adj.property("Effects").addProperty("ADBE CurvesCustom"); } catch (e3) { try { adj.property("Effects").addProperty("ADBE Easy Levels2"); } catch (e4) {} }
        return adj;
    }

    function setMB(layer) { try { layer.motionBlur = true; } catch (e) {} }

    function makeRadar(comp) {
        var radar = comp.layers.addShape();
        radar.name = "RADAR_Wedge";
        var g = radar.property("Contents").addProperty("ADBE Vector Group");
        g.name = "Wedge";
        var path = g.property("Contents").addProperty("ADBE Vector Shape - Group");
        var shp = new Shape();
        shp.vertices = [[0,0],[420,-40],[420,40],[0,0]];
        shp.inTangents = [[0,0],[0,0],[0,0],[0,0]];
        shp.outTangents = [[0,0],[0,0],[0,0],[0,0]];
        shp.closed = true;
        path.property("Path").setValue(shp);
        var fill = g.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue([0.22,0.9,1.0]);
        fill.property("Opacity").setValue(28);
        radar.transform.position.setValue([960,540]);
        radar.transform.rotation.expression = "speed = 90; time * speed";
        setMB(radar);

        var scan = comp.layers.addShape();
        scan.name = "SCAN_Line";
        var sg = scan.property("Contents").addProperty("ADBE Vector Group");
        var rect = sg.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rect.property("Size").setValue([1200,3]);
        var sf = sg.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        sf.property("Color").setValue([0.22,0.9,1.0]);
        scan.transform.position.expression = "x = value[0]; yMin = 120; yMax = 960; dur = 1.6; t = (time % dur) / dur; y = linear(t, 0, 1, yMin, yMax); [x, y]";
        setMB(scan);

        for (var i = 1; i <= 3; i++) {
            var ring = comp.layers.addShape();
            ring.name = "RIPPLE_" + i;
            var rg = ring.property("Contents").addProperty("ADBE Vector Group");
            var ellipse = rg.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
            ellipse.property("Size").setValue([220,220]);
            var stroke = rg.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
            stroke.property("Color").setValue([0.22,0.9,1.0]);
            stroke.property("Stroke Width").setValue(2);
            ring.transform.position.setValue([960,540]);
            ring.transform.scale.expression = "minS = 60; maxS = 180; dur = 2.0; phase = (index * 0.25) % 1; t = ((time / dur) + phase) % 1; s = ease(t, 0, 1, minS, maxS); [s, s]";
            ring.transform.opacity.expression = "dur = 2.0; phase = (index * 0.25) % 1; t = ((time / dur) + phase) % 1; ease(t, 0, 1, 80, 0)";
            setMB(ring);
        }
    }

    var rows = readCSV(deliverDir.fsName + "/ae_timecodes.csv");
    var shotComps = {};

    for (var r = 0; r < rows.length; r++) {
        var shot = rows[r].Shot;
        var dur = rows[r].Duration;
        var comp = proj.items.addComp(shot, width, height, pixelAspect, dur, fps);
        comp.motionBlur = true;
        comp.shutterAngle = 180;
        shotComps[shot] = comp;

        var l_bg = comp.layers.add(importPNG(assetsDir.fsName + "/" + shot + "_bg.png")); l_bg.name = shot + "_bg.png";
        var l_ui = comp.layers.add(importPNG(assetsDir.fsName + "/" + shot + "_ui.png")); l_ui.name = shot + "_ui.png";
        var l_hud = comp.layers.add(importPNG(assetsDir.fsName + "/" + shot + "_hud.png")); l_hud.name = shot + "_hud.png";
        var l_txt = comp.layers.add(importPNG(assetsDir.fsName + "/" + shot + "_text.png")); l_txt.name = shot + "_text.png";

        setMB(l_bg); setMB(l_ui); setMB(l_hud); setMB(l_txt);
        l_bg.transform.scale.setValueAtTime(0, [100,100]);
        l_bg.transform.scale.setValueAtTime(dur, [108,108]);

        addAdjustment(comp);

        if (shot === "S01" || shot === "S03") makeRadar(comp);

        if (shot === "S04") {
            var ctrl = comp.layers.addNull();
            ctrl.name = "CTRL_Score";
            var slider = ctrl.property("Effects").addProperty("ADBE Slider Control");
            slider.name = "Score";
            slider.property("Slider").setValueAtTime(0.2, 22);
            slider.property("Slider").setValueAtTime(Math.max(0.2, dur - 1.8), 87);

            var numText = comp.layers.addText("22");
            numText.name = "Score_Text";
            numText.transform.position.setValue([960,470]);
            numText.property("Source Text").expression = 'Math.round(thisComp.layer("CTRL_Score").effect("Score")("Slider")).toString()';

            var popup = comp.layer("S04_ui.png");
            if (popup) {
                popup.transform.scale.expression = "amp = 0.18; freq = 3.5; decay = 6.0; n = 0; if (numKeys > 0){ n = nearestKey(time).index; if (key(n).time > time) n--; } if (n > 0){ t = time - key(n).time; v = velocityAtTime(key(n).time - thisComp.frameDuration/10); value + v * amp * Math.sin(freq * t * 2*Math.PI) / Math.exp(decay * t);} else {value}";
                popup.transform.position.expression = "posterizeTime(12); base = value; w = wiggle(3, 6); [base[0] + (w[0]-base[0])*0.35, base[1] + (w[1]-base[1])*0.35]";
            }
        }
    }

    var main = proj.items.addComp("MAIN", width, height, pixelAspect, 40.0, fps);
    main.motionBlur = true;
    main.shutterAngle = 180;

    for (var j = 0; j < rows.length; j++) {
        var row = rows[j];
        var layer = main.layers.add(shotComps[row.Shot]);
        layer.startTime = row.Start;
        setMB(layer);
    }

    proj.save(new File(root + "/ae/AntiFraud_Radar.aep"));
    app.endUndoGroup();
})();
