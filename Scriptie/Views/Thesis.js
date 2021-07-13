
I.Scriptie_New = function () {
    I.Scriptie_New.current = this;
};

I.Scriptie_New.prototype = (function () {
    var animationSpeed = 40, runningTest = false, testNum = 0, currentSizesWindow, currentTestWindow, testBody, _displayingInterMoves = false;

    var scoreAccept = 0.995;

    var c_gradeDisplacement, c_gradeOverlap, c_gradeOverall;
    var c_Time;

    var con = {};

    var _items;

    var _minWidth = 80, _maxWidth = 180, _minHeight = 65, _maxHeight = 110;
    var _numSizes = 200, sizes, activeSizes, sizeNum;
    var _isMovingWindows = false;

    var iterateExperimentRuns = false;

    var displacementWeight, overlapWeight;

    var randomLoc = function () {
        var w = Math.floor((Math.random() * _maxWidth) + _minWidth);
        var h = Math.floor((Math.random() * _maxHeight) + _minHeight);

        return { width: w, height: h };
    };

    var createSizesWindow = function () {
        if (currentSizesWindow)
            currentSizesWindow.close();

        var html = "<div style='height:405px;overflow-y:scroll;'><table class='viewTable niceTable'><thead><tr style='font-weight:600'><td>#</td><td>width</td><td>height</td></tr></thead><tbody>";

        var x = 1;

        for (var i = _numSizes - 1; i >= 0; i--) {
            var item = sizes[i];
            html += "<tr><td>" + x++ + "</td><td>" + item.width + "</td><td>" + item.height + "</td></tr>";
        }

        var winContent = I(html + "</tbody></table></div>");

        var frameWin = I.Window.create({
            board: I.board,
            width: 280,
            height: 400,
            size: 1,
            title: "Box sizes",
            pos: "topRightOpen",
            scroll: "none",
            content: winContent
        });

        currentSizesWindow = frameWin;
    };

    var generateSizes = function (hideWindow) {
        sizes = [
            { "width": 215, "height": 86 }, { "width": 95, "height": 128 }, { "width": 188, "height": 132 },
            { "width": 212, "height": 100 }, { "width": 241, "height": 86 }, { "width": 160, "height": 106 },
            { "width": 95, "height": 149 }, { "width": 186, "height": 169 }, { "width": 186, "height": 91 },
            { "width": 136, "height": 172 }, { "width": 91, "height": 99 }, { "width": 184, "height": 67 },
            { "width": 256, "height": 160 }, { "width": 217, "height": 88 }, { "width": 81, "height": 93 },
            { "width": 206, "height": 73 }, { "width": 106, "height": 93 }, { "width": 179, "height": 112 },
            { "width": 232, "height": 145 }, { "width": 175, "height": 86 }, { "width": 252, "height": 78 },
            { "width": 80, "height": 174 }, { "width": 171, "height": 161 }, { "width": 209, "height": 110 },
            { "width": 254, "height": 145 }, { "width": 127, "height": 162 }, { "width": 104, "height": 119 },
            { "width": 146, "height": 88 }, { "width": 177, "height": 103 }, { "width": 155, "height": 158 },
            { "width": 182, "height": 134 }, { "width": 242, "height": 115 }, { "width": 228, "height": 135 },
            { "width": 223, "height": 90 }, { "width": 165, "height": 146 }, { "width": 217, "height": 93 },
            { "width": 94, "height": 74 }, { "width": 118, "height": 91 }, { "width": 181, "height": 100 },
            { "width": 253, "height": 124 }, { "width": 255, "height": 112 }, { "width": 222, "height": 72 },
            { "width": 255, "height": 80 }, { "width": 143, "height": 67 }, { "width": 122, "height": 95 },
            { "width": 207, "height": 152 }, { "width": 193, "height": 91 }, { "width": 133, "height": 162 },
            { "width": 243, "height": 166 }, { "width": 228, "height": 98 }, { "width": 190, "height": 162 },
            { "width": 214, "height": 89 }, { "width": 230, "height": 71 }, { "width": 99, "height": 146 },
            { "width": 152, "height": 109 }, { "width": 183, "height": 147 }, { "width": 98, "height": 78 },
            { "width": 130, "height": 147 }, { "width": 85, "height": 98 }, { "width": 248, "height": 97 },
            { "width": 107, "height": 108 }, { "width": 117, "height": 171 }, { "width": 176, "height": 89 },
            { "width": 248, "height": 159 }, { "width": 163, "height": 134 }, { "width": 173, "height": 112 },
            { "width": 157, "height": 165 }, { "width": 177, "height": 87 }, { "width": 238, "height": 124 },
            { "width": 150, "height": 147 }, { "width": 153, "height": 142 }, { "width": 235, "height": 135 },
            { "width": 124, "height": 141 }, { "width": 215, "height": 150 }, { "width": 163, "height": 157 },
            { "width": 178, "height": 82 }, { "width": 89, "height": 121 }, { "width": 119, "height": 98 },
            { "width": 137, "height": 163 }, { "width": 102, "height": 143 }, { "width": 237, "height": 72 },
            { "width": 88, "height": 147 }, { "width": 80, "height": 156 }, { "width": 88, "height": 105 },
            { "width": 117, "height": 97 }, { "width": 238, "height": 169 }, { "width": 250, "height": 110 },
            { "width": 95, "height": 66 }, { "width": 82, "height": 107 }, { "width": 173, "height": 148 },
            { "width": 88, "height": 167 }, { "width": 181, "height": 66 }, { "width": 157, "height": 159 },
            { "width": 138, "height": 140 }, { "width": 168, "height": 143 }, { "width": 203, "height": 102 },
            { "width": 257, "height": 166 }, { "width": 111, "height": 149 }, { "width": 175, "height": 137 },
            { "width": 214, "height": 141 }, { "width": 115, "height": 72 }, { "width": 238, "height": 141 },
            { "width": 149, "height": 138 }, { "width": 150, "height": 114 }, { "width": 179, "height": 173 },
            { "width": 123, "height": 146 }, { "width": 231, "height": 166 }, { "width": 197, "height": 76 },
            { "width": 102, "height": 110 }, { "width": 92, "height": 105 }, { "width": 89, "height": 129 },
            { "width": 185, "height": 174 }, { "width": 218, "height": 111 }, { "width": 209, "height": 168 },
            { "width": 138, "height": 89 }, { "width": 91, "height": 160 }, { "width": 194, "height": 160 },
            { "width": 120, "height": 151 }, { "width": 118, "height": 147 }, { "width": 90, "height": 72 },
            { "width": 138, "height": 172 }, { "width": 99, "height": 130 }, { "width": 106, "height": 167 },
            { "width": 147, "height": 150 }, { "width": 243, "height": 161 }, { "width": 126, "height": 81 },
            { "width": 205, "height": 104 }, { "width": 184, "height": 96 }, { "width": 255, "height": 90 },
            { "width": 100, "height": 93 }, { "width": 211, "height": 93 }, { "width": 253, "height": 166 },
            { "width": 142, "height": 65 }, { "width": 253, "height": 130 }, { "width": 163, "height": 173 },
            { "width": 173, "height": 96 }, { "width": 160, "height": 122 }, { "width": 190, "height": 117 },
            { "width": 254, "height": 99 }, { "width": 89, "height": 155 }, { "width": 96, "height": 80 },
            { "width": 212, "height": 68 }, { "width": 110, "height": 107 }, { "width": 183, "height": 93 },
            { "width": 117, "height": 83 }, { "width": 232, "height": 121 }, { "width": 245, "height": 98 },
            { "width": 165, "height": 154 }, { "width": 244, "height": 76 }, { "width": 139, "height": 167 },
            { "width": 141, "height": 124 }, { "width": 176, "height": 113 }, { "width": 92, "height": 145 },
            { "width": 149, "height": 92 }, { "width": 112, "height": 94 }, { "width": 123, "height": 131 },
            { "width": 112, "height": 171 }, { "width": 121, "height": 90 }, { "width": 101, "height": 73 },
            { "width": 127, "height": 115 }, { "width": 116, "height": 93 }, { "width": 127, "height": 70 },
            { "width": 259, "height": 74 }, { "width": 176, "height": 112 }, { "width": 95, "height": 109 },
            { "width": 143, "height": 118 }, { "width": 128, "height": 83 }, { "width": 138, "height": 96 },
            { "width": 153, "height": 97 }, { "width": 118, "height": 174 }, { "width": 232, "height": 137 },
            { "width": 187, "height": 145 }, { "width": 166, "height": 160 }, { "width": 206, "height": 164 },
            { "width": 230, "height": 162 }, { "width": 238, "height": 156 }, { "width": 182, "height": 96 },
            { "width": 198, "height": 158 }, { "width": 153, "height": 137 }, { "width": 99, "height": 96 },
            { "width": 175, "height": 75 }, { "width": 206, "height": 83 }, { "width": 124, "height": 146 },
            { "width": 152, "height": 123 }, { "width": 196, "height": 157 }, { "width": 181, "height": 168 },
            { "width": 88, "height": 132 }, { "width": 200, "height": 110 }, { "width": 246, "height": 93 },
            { "width": 213, "height": 123 }, { "width": 86, "height": 87 }, { "width": 120, "height": 96 },
            { "width": 127, "height": 127 }, { "width": 248, "height": 161 }, { "width": 251, "height": 81 },
            { "width": 139, "height": 80 }, { "width": 144, "height": 142 }, { "width": 156, "height": 174 },
            { "width": 97, "height": 116 }, { "width": 237, "height": 143 }
        ]; 

        /*
        sizes = [];

        for (var i = 0; i < _numSizes; i++) {
            sizes.push(randomLoc());
        }*/

        //I.cookies.setItem("boxsizes", JSON.stringify(sizes), 999, false, true);

        resetSizes();

        if (hideWindow === true)
            return;

        createSizesWindow();Find 
    };

    var resetSizes = function () {
        activeSizes = [];
        sizeNum = _numSizes;

        for (var i = 0; i < _numSizes; i++) {
            activeSizes.push(sizes[i]);
        }
    };

    var getSize = function () {
        if (sizeNum === 0) {
            alert('Out of sizes.');
            return;
        }

        var s = activeSizes[--sizeNum];
        return s;
    };

    var moveFn = function (sqr, left, top, speed, endFn, endScope) {
        left = Math.round(left);
        top = Math.round(top);

        if (speed === 0 || speed == null) {
            sqr.css("pos", left, top);
            if (endFn)
                endFn.call(endScope);
        } else {
            sqr.animate({ pos: { left: left, top: top } }, speed, null, endFn, endScope);
        }

        sqr.square.update(
            left,
            left + sqr.w,
            top,
            top + sqr.h);
    };

    var targetDiv;

    var setTarget = function () {
        var l = con.txtTargetLeft.value();
        var t = con.txtTargetTop.value();

        if (!targetDiv) {
            targetDiv = I("<div id='TargetDiv'></div>");
            I.items.append(targetDiv);
        }

        targetDiv.left(l - 7);
        targetDiv.top(t - 7);
    };

    var fnReset = function () {
        for (var i = 0; i < _items.length; i++) {
            var item = _items[i];
            item.square.destroy();
            item.remove();
        }

        resetSizes();
    };

    return {
        init: function () {
            _items = [];

            I.NB("#GenerateSizes").execute(generateSizes);
            I.NB("#BtnResetSetup").execute(fnReset);

            I.A("#ShowSizes").click(createSizesWindow);

            I.Scriptie_New.config = con;

            con.txtConfigs = I.TB("#TxtConfigurations").numOnly().value(40000);
            con.txtOverlapWeight = I.TB("#TxtOverlapWeight").value(10);
            con.txtDisplacementWeight = I.TB("#TxtDisplacementWeight").value(1);

            con.txtIterations = I.TB("#TxtIterations").numOnly().value(1);

            var w = I.mainBoard.container.width();
            var h = I.mainBoard.container.height();

            con.txtTargetLeft = I.TB("#TxtTargetLeft").numOnly().value(Math.round(w / 2));
            con.txtTargetTop = I.TB("#TxtTargetTop").numOnly().value(Math.round(h / 2));

            var stratContainer = I("#RBLStrats");

            var rb1 = I.RadioButton.create({ label: "(1 + 1)", classes: "stratRb" });
            var rb2 = I.RadioButton.create({ label: "Simulated Annealing", classes: "stratRb" });
            var rb3 = I.RadioButton.create({ label: "Particle Swarm Optimization", classes: "stratRb" });
            var rb4 = I.RadioButton.create({ label: "Adaptive Structure Optimization", classes: "stratRb" });

            stratContainer.append(rb1);
            stratContainer.append(rb2);
            stratContainer.append(rb3);
            stratContainer.append(rb4);

            con.rbs1 = rb1;
            con.rbs2 = rb2;
            con.rbs3 = rb3;

            con.rbl = I.RBL("#RBLStrats", null, 0);

            con.rbl.value(0);

            var rb12 = I.RadioButton.create({ label: "Linear Weighting", classes: "stratRb" });
            I("#RBLSchemes").append(rb12);
            rb12.check();

            I.NB("#AddMultiple").execute(this.addMultiple, this);
            con.txtAddMultiple = I.TB("#TxtAddMultiple").numOnly().value(50);

            con.lblDisplacement = I("#LblDisplacement");
            con.lblOverlap = I("#LblOverlap");
            con.lblOverall = I("#LblOverall");

            con.lblConfig = I("#LblConfigurations");
            con.lblTime = I("#LblTime");

            I.items.click(function (e) {
                console.log(e);
                con.txtTargetLeft.value(e.offsetX);
                con.txtTargetTop.value(e.offsetY);
                setTarget();
            });

            con.btnAddOne = I.NB("#AddOne").click(this.addOne, this);

            if (iterateExperimentRuns) {
                I.NB("#BtnAddNextBox").show().click(function () { this.executeAdd(true); }, this);
            }

            setTarget();

            generateSizes(true);
        },
        addMultiple: function (runConfig) {
            if (runningTest)
                return;

            this.results = [];
            this.runConfig = runConfig;

            fnReset.call(this);

            var n = con.txtAddMultiple.value();

            var fnName, schemeName;

            var val = con.rbl.value();
            if (val === 0)
                fnName = "(1 + 1)";
            else if (val === 1)
                fnName = "Simulated Annealing";
            else if (val === 2)
                fnName = "Particle Swarm Optimization";
            else if (val === 3)
                fnName = "Adaptive Structure Optimization";

            schemeName = "Linear Weighting";

            var header = "<table><thead><tr><td>Algorithm: </td><td><b>" + fnName + "</b></td>";
            header += "<tr><td>Weighting scheme: </td><td>" + schemeName + "</td>";
            header += "<tr><td>Number of shapes: </td><td>" + n + "</td>";

            var html = header + "</thead></table><div style='margin-top:20px;height:405px;overflow-y:scroll;'><table  class='viewTable niceTable'><thead><tr><td>#</td><td>Score</td><td>Time</td></tr></thead><tbody class='testTableBody'>";

            var winContent = I(html + "</tbody></table></div>");

            var frameWin = I.Window.create({
                board: I.board,
                width: 360,
                height: 500,
                size: 1,
                title: "Run: " + testNum,
                pos: "rightFromMiddleOpen",
                scroll: "none",
                content: winContent
            });

            if (runConfig)
                runConfig.win = frameWin;

            currentTestWindow = frameWin;

            testBody = frameWin.find('.testTableBody');

            frameWin._dataRows = [];

            testNum++;

            con.n = 0;
            con.maxN = n;

            runningTest = true;

            this.executeAdd();
        },
        appendTestResult: function () {
            if (testBody && runningTest) {
                var table = testBody.html;

                // Create an empty <tr> element and add it to the 1st position of the table:
                var row = table.insertRow(0);

                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);

                cell1.innerHTML = con.n + 1;
                cell2.innerHTML = c_gradeOverall;
                cell3.innerHTML = c_Time;

                if (currentTestWindow && currentTestWindow._dataRows) {
                    currentTestWindow._dataRows.push({
                        N: con.n + 1,
                        Score: c_gradeOverall,
                        Time: c_Time
                    });
                }

                this.results.push({
                    N: con.n + 1,
                    DisplacementGrade: c_gradeDisplacement,
                    OverlapGrade: c_gradeOverlap,
                    OverallGrade: c_gradeOverall,
                    Time: c_Time
                });
            }
        },
        executeAdd: function (buttonPressed) {
            if (con.n < con.maxN) {
                if (!iterateExperimentRuns || buttonPressed === true) {
                    this.addOne();
                    con.n++;
                }
            } else {
                runningTest = false;

                if (this.runConfig)
                    this.runConfig.callback.call(this.runConfig.scope, this.runConfig, this.results);
            }
        },
        addOne: function () {
            animationSpeed = 50;

            displacementWeight = parseFloat(con.txtDisplacementWeight.value());
            overlapWeight = parseFloat(con.txtOverlapWeight.value());

            var size = getSize();

            var w = size.width, h = size.height,
                l = con.txtTargetLeft.number(), t = con.txtTargetTop.number();

            l = Math.round(l - w / 2);
            t = Math.round(t - h / 2);

            var result = this.find(I.mainBoard, l, t, w, h);

            this.appendTestResult();

            var sqr = I("<div class='scriptieSqr' style='display:none'></div>");

            I.items.append(sqr);

            _items.push(sqr);

            sqr.moveFn = moveFn;

            sqr.css("pos", result.left, result.top);
            sqr.width(w);
            sqr.height(h);
            sqr.w = w;
            sqr.h = h;

            var color = I.Color.random();
            sqr.css("background", color.toRGB());

            sqr.show();

            sqr.square = new I.Square(I.mainBoard);
            sqr.square.win = sqr;
            sqr.square.update(
                result.left,
                result.left + w,
                result.top,
                result.top + h);
        },
        initialMaxConfigs: 30000,
        overlap: function (boxes, maxOverlap) {
            var totalOverlap = 0, currentTotal, box1, box2;

            for (var a = 0; a < boxes.length; a++) {
                boxes[a].overlap = 0;
            }

            for (var a = 0; a < boxes.length; a++) {
                box1 = boxes[a];

                currentTotal = 0;

                for (var b = a + 1; b < boxes.length; b++) {
                    box2 = boxes[b];

                    if (box1.x2 >= box2.x1 && box1.x1 <= box2.x2 && box1.y2 >= box2.y1 && box1.y1 <= box2.y2) {
                        xOverlap = Math.max(0, Math.min(box1.x2, box2.x2) - Math.max(box1.x1, box2.x1));
                        yOverlap = Math.max(0, Math.min(box1.y2, box2.y2) - Math.max(box1.y1, box2.y1));
                        var overlap = xOverlap * yOverlap;
                        box1.overlap += overlap;
                        box2.overlap += overlap;
                        currentTotal += overlap;
                    }
                }

                totalOverlap += currentTotal;
            }

            return 1 - (totalOverlap / maxOverlap);
        },
        displacement: function (currentBoxes, newBoxes, maxDisplacement) {
            var totalDisplacement = 0;

            for (var i = 0; i < currentBoxes.length; i++) {
                var currentBox = currentBoxes[i],
                    newBox = newBoxes[i],
                    displX = currentBox.x1 - newBox.x1,
                    displY = currentBox.y1 - newBox.y1;

                newBox.displacement = displX * displX + displY * displY;
                totalDisplacement += Math.sqrt(newBox.displacement);
            }

            if (totalDisplacement > maxDisplacement)
                return 0.01;

            return 1 - (totalDisplacement / (maxDisplacement / 2));
        },
        getRandom: function (mutationStrength) {
            return Math.round((Math.random() * mutationStrength) - (mutationStrength / 2));
        },
        randomizeRealOne: function (board, boxes, previousboxes, mutationStrength) {
            var rng = I.util.random, w = board.w, h = board.h;

            for (var i = 0; i < boxes.length; i++) {
                var box = boxes[i], newbox = previousboxes[i];
                newbox.x1 = box.x1;
                newbox.x2 = box.x2;
                newbox.y1 = box.y1;
                newbox.y2 = box.y2;
                newbox.size = box.size;
                newbox.win = box.win;
            }

            var l = boxes.length;
            var index = Math.round((Math.random() * (l - 1)));

            var box = boxes[index], newbox = previousboxes[index];

            var displX, displY;

            var r = Math.random(), r2 = Math.random();
            if (r < 0.75) {
                if (r2 < 0.5) {
                    displX = this.getRandom(mutationStrength);
                    displY = this.getRandom(mutationStrength);
                } else if (r2 < 0.75) {
                    displX = this.getRandom(mutationStrength);
                    displY = 0;
                } else {
                    displX = 0;
                    displY = this.getRandom(mutationStrength);
                }

                var x1 = box.x1 + displX, y1 = box.y1 + displY;

                if (x1 < 0) {
                    newbox.x1 = 0;
                    newbox.x2 = Math.round(box.x2 + displX - x1);
                } else {
                    var x2 = box.x2 + displX;

                    if (x2 > w) {
                        newbox.x2 = w;
                        newbox.x1 = Math.round(box.x1 + (displX - (x2 - w)));
                    } else {
                        newbox.x1 = Math.round(x1);
                        newbox.x2 = Math.round(x2);
                    }
                }

                if (y1 < 0) {
                    newbox.y1 = 0;
                    newbox.y2 = Math.round(box.y2 + displY - y1);
                } else {
                    var y2 = box.y2 + displY;

                    if (y2 > h) {
                        newbox.y2 = h;
                        newbox.y1 = Math.round(box.y1 + (displY - (y2 - h)));
                    } else {
                        newbox.y1 = Math.round(y1);
                        newbox.y2 = Math.round(y2);
                    }
                }
            }

            return previousboxes;
        },
        postMove: function () {
            if (_isMovingWindows && !_displayingInterMoves) {
                _isMovingWindows = false;
                I.timeout(33, this.executeAdd, this);
            }
        },
        move: function (boxes) {
            _isMovingWindows = true;

            var movedOne = false;

            for (var i = 0; i < boxes.length; i++) {
                var box = boxes[i];

                if (box.win && box.win.move && box.win !== true) {
                    movedOne = true;
                    box.win.move(box.x1 + box.win.p, box.y1 + box.win.p, animationSpeed, this.postMove, this);
                }

                if (box.win && box.win.moveFn) {
                    movedOne = true;
                    box.win.moveFn(box.win, box.x1, box.y1, animationSpeed, this.postMove, this);
                }
            }

            if (!movedOne)
                this.postMove.call(this);
        },
        move2: function (boxes) {
            for (var i = 0; i < boxes.length; i++) {
                var box = boxes[i];

                if (box.win.moveFn) {
                    box.win.moveFn(box.win, box.x1, box.y1, 0);
                }
            }
        },
        initNew: function (boxes, width, height, left, top) {
            var newboxes = this.copy(boxes);

            newboxes.push({
                x1: left,
                x2: left + width,
                y1: top,
                y2: top + height,
                win: true
            });

            return newboxes;
        },
        copy: function (boxes) {
            var newboxes = [];

            for (var i = 0; i < boxes.length; i++) {
                var box = boxes[i];

                newboxes.push({
                    x1: box.x1,
                    x2: box.x2,
                    y1: box.y1,
                    y2: box.y2,
                    win: box.win
                });
            }

            return newboxes;
        },
        calculateGrade: function (dGrade, oGrade) {
            return ((displacementWeight * dGrade) + (overlapWeight * oGrade)) / (displacementWeight + overlapWeight);
        },
        calculateMaxOverlap: function (boxes) {
            var totalSize = 0;

            for (var i = 0; i < boxes.length; i++) {
                var box = boxes[i];
                box.size = (box.x2 - box.x1) * (box.y2 - box.y1);
                totalSize += box.size;
            }

            return totalSize;
        },
        calculateMaxDisplacement: function (boxes, w, h) {
            return (Math.sqrt(w * h) / 2) * boxes.length;
        },
        pso: function (board, left, top, width, height) {
            var pso = new I.PSO();
            pso.init(this.runConfig);
            var bestParticle = pso.execute(board, left, top, width, height);

            var newboxes = bestParticle.boxes;

            this.move(newboxes);

            var last = newboxes[newboxes.length - 1];

            c_gradeDisplacement = Math.round(bestParticle.displacementGrade * 10000) / 10000;
            c_gradeOverlap = Math.round(bestParticle.overlapGrade * 10000) / 10000;
            c_gradeOverall = Math.round(bestParticle.grade * 10000) / 10000;
            c_Time = Math.round((bestParticle.time) * 10000) / 10000;

            con.lblDisplacement.text(c_gradeDisplacement);
            con.lblOverlap.text(c_gradeOverlap);
            con.lblOverall.text(c_gradeOverall);

            con.lblConfig.text(bestParticle.totalTries);
            con.lblTime.text(c_Time);

            c_gradeOverall = Math.round(bestParticle.grade * 10000) / 10000;

            return { left: last.x1, top: last.y1 };
        },
        aso: function (board, left, top, width, height) {
            if (!this.runConfig)
                this.runConfig = {};

            var aso = new I.ASO();
            aso.init(this.runConfig);
            var bestParticle = aso.execute(board, left, top, width, height);

            var newboxes = bestParticle.boxes;

            this.move(newboxes);

            var last = newboxes[newboxes.length - 1];

            c_gradeDisplacement = Math.round(bestParticle.displacementGrade * 10000) / 10000;
            c_gradeOverlap = Math.round(bestParticle.overlapGrade * 10000) / 10000;
            c_gradeOverall = Math.round(bestParticle.grade * 10000) / 10000;
            c_Time = Math.round((bestParticle.time) * 10000) / 10000;

            con.lblDisplacement.text(c_gradeDisplacement);
            con.lblOverlap.text(c_gradeOverlap);
            con.lblOverall.text(c_gradeOverall);

            con.lblConfig.text(bestParticle.totalTries);
            con.lblTime.text(c_Time);

            c_gradeOverall = Math.round(bestParticle.grade * 10000) / 10000;

            return { left: last.x1, top: last.y1 };
        },
        simulatedAnnealing: function (board, left, top, width, height) {
            var settings;

            if (this.runConfig == null) {
                settings = {
                    T: 50,
                    T_min: 1,
                    alpha: 0.25,
                    mutationStrength: 16
                }
            } else {
                settings = this.runConfig.settings;
            }

            var boardboxes = board.getSquares();
            this.maxConfigs = con.txtConfigs.number();

            var newboxes = this.initNew(boardboxes, width, height, left, top);
            var oldboxes = [], testboxes = [];

            var dGrade, oGrade, overall, tries = 0, totalTries = 0, previousboxes;

            for (var i = 0; i < newboxes.length; i++) {
                var box = newboxes[i];
                oldboxes[i] = { x1: box.x1, x2: box.x2, y1: box.y1, y2: box.y2, win: box.win };
                testboxes[i] = {};
            }

            var maxOverlap = this.calculateMaxOverlap(newboxes),
                maxDisplacement = this.calculateMaxDisplacement(newboxes, board.w, board.h);

            dGrade = 1;
            oGrade = this.overlap(oldboxes, maxOverlap);

            overall = this.calculateGrade(dGrade, oGrade);

            var best = { overall: overall, boxes: newboxes, oGrade: oGrade, dGrade: dGrade };

            var t0 = performance.now();

            previousboxes = testboxes;

            /* START */

            var done = false;

            if (best.overall !== 1) {
                var T = settings.T, T_min = settings.T_min, alpha = settings.alpha;

                console.log(alpha);

                while (T > T_min && totalTries < this.maxConfigs && !done) {
                    var i = 1;

                    while (i++ <= 100 && totalTries < this.maxConfigs && !done) {
                        totalTries++;

                        testboxes = this.randomizeRealOne(board, best.boxes, previousboxes, settings.mutationStrength);
                        dGrade = this.displacement(oldboxes, testboxes, maxDisplacement);
                        oGrade = this.overlap(testboxes, maxOverlap);

                        overall = this.calculateGrade(dGrade, oGrade);

                        var difference = (overall - best.overall) * 1000000;

                        var acceptance_probability = Math.pow(2.71828, (difference / T));

                        if (overall > scoreAccept || acceptance_probability > Math.random()) {
                            tries = 0;

                            previousboxes = best.boxes;

                            best.overall = overall;
                            best.dGrade = dGrade;
                            best.oGrade = oGrade;
                            best.boxes = testboxes;

                            if (overall > scoreAccept) {
                                done = true;
                            }
                        } else {
                            previousboxes = testboxes;
                        }
                    }

                    T = T * alpha;
                }
            }

            /* END */

            var t1 = performance.now(), timeTaken = t1 - t0;

            c_gradeDisplacement = Math.round(best.dGrade * 10000) / 10000;
            c_gradeOverlap = Math.round(best.oGrade * 10000) / 10000;
            c_gradeOverall = Math.round(best.overall * 10000) / 10000;
            c_Time = Math.round((t1 - t0) * 10000) / 10000;

            con.lblDisplacement.text(c_gradeDisplacement);
            con.lblOverlap.text(c_gradeOverlap);
            con.lblOverall.text(c_gradeOverall);

            con.lblConfig.text(totalTries);
            con.lblTime.text(c_Time);

            this.move(best.boxes);

            var last = best.boxes[best.boxes.length - 1];

            return { left: last.x1, top: last.y1 };
        },
        onePlusOneStrategy: function (board, left, top, width, height) {
            var settings;

            if (this.runConfig == null) {
                settings = {
                    mutationStrength: 16
                }
            } else {
                settings = this.runConfig.settings;
            }

            var boardboxes = board.getSquares();

            this.maxConfigs = con.txtConfigs.number();

            var newboxes = this.initNew(boardboxes, width, height, left, top);
            var oldboxes = [], testboxes = [];

            var dGrade, oGrade, overall, tries = 0, totalTries = 0, previousboxes;

            for (var i = 0; i < newboxes.length; i++) {
                var box = newboxes[i];
                oldboxes[i] = { x1: box.x1, x2: box.x2, y1: box.y1, y2: box.y2, win: box.win };
                testboxes[i] = {};
            }

            var maxOverlap = this.calculateMaxOverlap(newboxes),
                maxDisplacement = this.calculateMaxDisplacement(newboxes, board.w, board.h);

            dGrade = 1;
            oGrade = this.overlap(oldboxes, maxOverlap);

            overall = this.calculateGrade(dGrade, oGrade);

            var best = { overall: overall, boxes: newboxes, oGrade: oGrade, dGrade: dGrade };

            var t0 = performance.now();

            previousboxes = testboxes;

            if (best.overall !== 1) {
                for (; totalTries < this.maxConfigs; totalTries++) {
                    tries++;

                    testboxes = this.randomizeRealOne(board, best.boxes, previousboxes, settings.mutationStrength);
                    dGrade = this.displacement(oldboxes, testboxes, maxDisplacement);
                    oGrade = this.overlap(testboxes, maxOverlap);

                    overall = this.calculateGrade(dGrade, oGrade);

                    if (overall > best.overall || best.oGrade === 0.01) {
                        tries = 0;

                        previousboxes = best.boxes;

                        best.overall = overall;
                        best.dGrade = dGrade;
                        best.oGrade = oGrade;
                        best.boxes = testboxes;

                        if (overall > scoreAccept) {
                            break;
                        }
                    } else {
                        previousboxes = testboxes;
                    }
                }
            }

            var t1 = performance.now(), timeTaken = t1 - t0;

            c_gradeDisplacement = Math.round(best.dGrade * 10000) / 10000;
            c_gradeOverlap = Math.round(best.oGrade * 10000) / 10000;
            c_gradeOverall = Math.round(best.overall * 10000) / 10000;
            c_Time = Math.round((t1 - t0) * 10000) / 10000;

            con.lblDisplacement.text(c_gradeDisplacement);
            con.lblOverlap.text(c_gradeOverlap);
            con.lblOverall.text(c_gradeOverall);

            con.lblConfig.text(totalTries);
            con.lblTime.text(c_Time);

            this.move(best.boxes);

            var last = best.boxes[best.boxes.length - 1];

            return { left: last.x1, top: last.y1 };
        },
        find: function (board, left, top, width, height) {
            var val = con.rbl.value();
            if (val === 0)
                return this.onePlusOneStrategy.apply(this, arguments);
            else if (val === 1)
                return this.simulatedAnnealing.apply(this, arguments);
            else if (val === 2)
                return this.pso.apply(this, arguments);
            else if (val === 3)
                return this.aso.apply(this, arguments);
        }
    };
})();



window.activeViewLoader.events = {
    pagePreLoad: function (thisView) {
    },
    pageLoad: function (thisView) {
        App.pageLoaded("Experiment Dashboard");

        I("#Board").show();

        I.theme.changeBackgroundImage(244, 244, 244);

        var scrip = new I.Scriptie_New();
        scrip.init();

        var runner = new I.ExperimentRunner();
    }
};