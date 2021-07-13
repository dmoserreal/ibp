
I.ASO = function () {
};

I.ASO.prototype = (function () {
    var scriptie, config, maxConfigs;

    var w, h;

    var maxDistance;

    var enableInfections = false,
        infectionRate = 0.75,
        acceptCriteria = 0.995,
        mutationStrength = 16;

    var displacementWeight, overlapWeight;

    return {
        init: function (runConfig) {
            var settings;

            if (runConfig == null || runConfig.settings == null) {
                settings = {
                    enableInfections: false,
                    infectionRate: 0.75,
                    acceptCriteria: 0.995,
                    mutationStrength: 16
                };
            } else {
                settings = runConfig.settings;
            }

            enableInfections = settings.enableInfections;
            infectionRate = settings.infectionRate;
            acceptCriteria = settings.acceptCriteria;
            mutationStrength = settings.mutationStrength;
        },
        displaceXY: function (box, displaceX, displaceY) {
            var x1 = box.x1 + displaceX, y1 = box.y1 + displaceY;

            if (x1 < 0) {
                box.x1 = 0;
                box.x2 = Math.round(box.x2 + displaceX - x1);
            } else {
                var x2 = box.x2 + displaceX;

                if (x2 > w) {
                    box.x2 = w;
                    box.x1 = Math.round(box.x1 + (displaceX - (x2 - w)));
                } else {
                    box.x1 = Math.round(x1);
                    box.x2 = Math.round(x2);
                }
            }

            if (y1 < 0) {
                box.y1 = 0;
                box.y2 = Math.round(box.y2 + displaceY - y1);
            } else {
                var y2 = box.y2 + displaceY;

                if (y2 > h) {
                    box.y2 = h;
                    box.y1 = Math.round(box.y1 + (displaceY - (y2 - h)));
                } else {
                    box.y1 = Math.round(y1);
                    box.y2 = Math.round(y2);
                }
            }
        },
        setXY: function (box, x1, y1) {
            var width = box.x2 - box.x1,
                height = box.y2 - box.y1;

            if (x1 < 0) {
                box.x1 = 0;
                box.x2 = width;
            } else {
                var x2 = x1 + width;

                if (x2 > w) {
                    box.x1 = w - width;
                    box.x2 = w;
                } else {
                    box.x1 = x1;
                    box.x2 = x2;
                }
            }

            if (y1 < 0) {
                box.y1 = 0;
                box.y2 = height;
            } else {
                var y2 = y1 + height;

                if (y2 > h) {
                    box.y1 = h - height;
                    box.y2 = h;
                } else {
                    box.y1 = y1;
                    box.y2 = y2;
                }
            }
        },
        luckGreaterThan: function (percent) {
            return Math.random() < percent;
        },
        getRandomInt: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getRandomVelocity: function (power) {
            return ((Math.random() - 0.5) * 2) * power; // -1 to 1 * power
        },
        calculateGrade: function (dGrade, oGrade) {
            return ((displacementWeight * dGrade) + (overlapWeight * oGrade)) / (displacementWeight + overlapWeight);
        },
        grade: function (config) {
            config.displacementGrade = scriptie.displacement(this.initialConfiguration, config.boxes, this.maxDisplacement);
            config.overlapGrade = scriptie.overlap(config.boxes, this.maxOverlap);
            config.grade = this.calculateGrade(config.displacementGrade, config.overlapGrade);
        },
        gradeBoxes: function (boxes) {
            var box, maxOverlap;

            boxes.totalGrade = 0;
            boxes.highestGrade = 0;

            for (var a = 0; a < boxes.length; a++) {
                box = boxes[a];
                maxOverlap = (box.x2 - box.x1) * (box.y2 - box.y1);

                if (box.overlap > maxOverlap)
                    box.overlapGrade = 0;
                else {
                    box.overlapGrade = 1 - (box.overlap / maxOverlap);
                }

                if (box.displacement > maxDistance)
                    box.displacementGrade = 0;
                else {
                    box.displacementGrade = 1 - (box.displacement / maxDistance);
                }

                box.grade = 1 - ((displacementWeight * box.displacementGrade) + (overlapWeight * box.overlapGrade)) / (displacementWeight + overlapWeight);
                boxes.totalGrade += box.grade;

                if (box.grade > boxes.highestGrade)
                    boxes.highestGrade = box.grade;
            }
        },
        randomNumber: function (min, max) {
            return Math.random() * (max - min) + min;
        },
        chooseRandomBox: function (boxes) {
            var totalScore = boxes.totalGrade + boxes.highestGrade;
            var partialHighestGrade = boxes.highestGrade / boxes.length;

            var randomNumber = this.randomNumber(0, totalScore);

            var box, currentTotal = 0;

            for (var a = 0; a < boxes.length; a++) {
                box = boxes[a];

                currentTotal += box.grade + partialHighestGrade;

                if (randomNumber <= currentTotal) {
                    return a;
                }
            }
        },
        getRandom: function () {
            return Math.round((Math.random() * mutationStrength) - (mutationStrength / 2));
        },
        randomizeBox: function (box) {
            var displX, displY;

            var r = Math.random(), r2 = Math.random();
            if (r < 0.75) {
                if (r2 < 0.5) {
                    displX = this.getRandom();
                    displY = this.getRandom();
                } else if (r2 < 0.75) {
                    displX = this.getRandom();
                    displY = 0;
                } else {
                    displX = 0;
                    displY = this.getRandom();
                }
            }

            this.displaceXY(box, displX, displY);
        },
        infectBoxes: function (boxIndex, boxes, skips) {
            var box1 = boxes[boxIndex];

            for (var b = 0; b < boxes.length; b++) {
                if (skips.includes(b))
                    continue;

                box2 = boxes[b];

                if (box1.x2 >= box2.x1 && box1.x1 <= box2.x2 && box1.y2 >= box2.y1 && box1.y1 <= box2.y2) {
                    if (Math.random() > (1 - infectionRate)) {
                        this.randomizeBox(box2);
                        skips.push(b);
                        this.infectBoxes(b, boxes, skips);
                    }
                }
            }
        },
        execute: function (board, left, top, width, height) {
            w = board.w;
            h = board.h;

            maxDistance = Math.sqrt(w * w + h * h);

            scriptie = new I.Scriptie_New();
            config = I.Scriptie_New.config;
            maxConfigs = config.txtConfigs.number();

            displacementWeight = parseFloat(config.txtDisplacementWeight.value());
            overlapWeight = parseFloat(config.txtOverlapWeight.value());

            this.initialConfiguration = scriptie.copy(board.getSquares());
            this.initialConfiguration.push({
                x1: left,
                x2: left + width,
                y1: top,
                y2: top + height,
                win: true
            });

            var newboxes = scriptie.copy(this.initialConfiguration);

            this.maxOverlap = scriptie.calculateMaxOverlap(this.initialConfiguration);
            this.maxDisplacement = scriptie.calculateMaxDisplacement(this.initialConfiguration, w, h);

            var currentConfig = {
                boxes: newboxes
            };

            this.grade(currentConfig);

            var best_displacementGrade = currentConfig.displacementGrade,
                best_overlapGrade = currentConfig.overlapGrade,
                best_grade = currentConfig.grade;

            this.gradeBoxes(newboxes);

            var totalTries = 0, scoreAccept = acceptCriteria;

            var t0 = performance.now();

            for (; totalTries < maxConfigs && best_grade < scoreAccept; totalTries++) {
                var boxIndex = this.chooseRandomBox(newboxes);

                var newConfig = {
                    boxes: scriptie.copy(currentConfig.boxes)
                }

                var box = newConfig.boxes[boxIndex];

                this.randomizeBox(box);

                if (enableInfections) {
                    this.infectBoxes(boxIndex, newConfig.boxes, [boxIndex]);
                }

                this.grade(newConfig);

                if (newConfig.grade > best_grade) {
                    best_displacementGrade = currentConfig.displacementGrade;
                    best_overlapGrade = currentConfig.overlapGrade;
                    best_grade = currentConfig.grade;

                    currentConfig = newConfig;

                    this.gradeBoxes(currentConfig.boxes);
                }
            }

            var t1 = performance.now(), timeTaken = t1 - t0;

            return {
                overlapGrade: best_overlapGrade,
                displacementGrade: best_displacementGrade,
                grade: best_grade,
                totalTries: totalTries,
                time: timeTaken,
                boxes: currentConfig.boxes
            };
        }
    };
})();