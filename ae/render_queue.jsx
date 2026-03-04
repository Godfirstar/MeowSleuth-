// render_queue.jsx - queue MAIN render
(function () {
    app.beginUndoGroup("Queue MAIN Render");
    var root = "C:/Users/FIRST/Desktop/projects";
    var outFolder = new Folder(root + "/ae/out");
    if (!outFolder.exists) outFolder.create();

    if (!app.project) throw new Error("No project open.");

    var mainComp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "MAIN") {
            mainComp = app.project.item(i);
            break;
        }
    }
    if (!mainComp) throw new Error("MAIN comp not found.");

    var rqItem = app.project.renderQueue.items.add(mainComp);
    try { rqItem.applyTemplate("Best Settings"); } catch (e1) {}
    var om = rqItem.outputModule(1);
    try { om.applyTemplate("Lossless"); } catch (e2) {}

    var outFile = new File(root + "/ae/out/main.mov");
    om.file = outFile;

    app.endUndoGroup();
})();
