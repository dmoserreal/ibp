
I.PSO = function () {
};

I.PSO.prototype = (function () {
    var scriptie, config, maxConfigs;

    var w, h;

    var cycle;

    var populationSize = 100,
        populationInitializationCycles = 4,
        populationInitializationVelocity = 120,
        populationInitializationLuck = 0.25,
        initialVelocity = 8,
        initialLuck = 1,
        skipInitial = true,
        basicPSO = false,
        sr1 = 4,
        sr2 = 4,
        sr3 = 4;

    var displacementWeight, overlapWeight;

    return {
        init: function (runConfig) {
            var settings;

            if (runConfig == null) {
                settings = {
                    populationSize: 100,
                    initialVelocity: 8,
                    r1: 4,
                    r2: 4,
                    r3: 4
                };
            } else {
                settings = runConfig.settings;
            }

            populationSize = settings.populationSize;
            initialVelocity = settings.initialVelocity;
            sr1 = settings.r1;
            sr2 = settings.r2;
            sr3 = settings.r3;
        },
        displaceXY: function (box, displaceX, displaceY) {
            var x1 = box.x1 + displaceX, y1 = box.y1 + displaceY;

            if (x1 < 0) {
                box.x2 = Math.round(box.x2 - box.x1);
                box.x1 = 0;
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
                box.y2 = Math.round(box.y2 - box.y1);
                box.y1 = 0;
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
        getRandomVelocity: function (mutationStrength) {
            return Math.round((Math.random() * mutationStrength) - (mutationStrength / 2));
        },
        calculateGrade: function (dGrade, oGrade) {
            return ((displacementWeight * dGrade) + (overlapWeight * oGrade)) / (displacementWeight + overlapWeight);
        },
        gradeParticle: function (particle) {
            particle.displacementGrade = scriptie.displacement(this.initialConfiguration, particle.boxes, this.maxDisplacement);
            particle.overlapGrade = scriptie.overlap(particle.boxes, this.maxOverlap);
            particle.grade = this.calculateGrade(particle.displacementGrade, particle.overlapGrade);
            return particle.grade;
        },
        findBestParticle: function () {
            var bestParticle, bestGrade = -1000000000;

            for (var i = 0; i < populationSize; i++) {
                var particle = this.particles[i];
                var grade = this.gradeParticle(particle);

                if (grade > bestGrade) {
                    bestParticle = particle;
                    bestGrade = grade;
                }

                if (particle.best == null || grade > particle.best.grade) {
                    particle.best = {
                        overlapGrade: particle.overlapGrade,
                        displacementGrade: particle.displacementGrade,
                        grade: particle.grade,
                        boxes: scriptie.copy(particle.boxes)
                    };
                }
            }

            return bestParticle;
        },
        createPopulation: function () {
            this.particles = [];

            for (var i = 0; i < populationSize; i++) {
                var particle = {
                    boxes: scriptie.copy(this.initialConfiguration)
                };

                this.particles.push(particle);
            }
        },
        initializePopulation: function () {
            this.createPopulation();

            if (!basicPSO) {
                for (var i = 0; i < populationInitializationCycles; i++) {
                    this.assignRandomVelocities(populationInitializationVelocity, populationInitializationLuck);
                    this.executeVelocities();
                }
            }
        },
        randomizePopulation: function () {
            if (!basicPSO) {
                for (var i = skipInitial ? 1 : 0; i < populationSize; i++) {
                    var particle = this.particles[i];

                    for (var n = 0; n < particle.boxes.length; n++) {
                        var box = particle.boxes[n];

                        var x = this.getRandomInt(0, w), y = this.getRandomInt(0, h);

                        this.setXY(box, x, y);
                    }
                }
            }
        },
        assignRandomVelocities: function (power, luckRequired) {
            for (var i = skipInitial ? 1 : 0; i < populationSize; i++) {
                var particle = this.particles[i];

                for (var x = 0; x < particle.boxes.length; x++) {
                    var box = particle.boxes[x];

                    if (this.luckGreaterThan(luckRequired)) {
                        box.xv = this.getRandomVelocity(power);
                        box.yv = this.getRandomVelocity(power);
                    } else {
                        box.xv = 0;
                        box.yv = 0;
                    }
                }
            }
        },
        executeVelocities: function () {
            for (var i = skipInitial ? 1 : 0; i < populationSize; i++) {
                var particle = this.particles[i];

                for (var x = 0; x < particle.boxes.length; x++) {
                    var box = particle.boxes[x];

                    this.displaceXY(box, box.xv, box.yv);
                }
            }
        },
        updateVelocities: function () {
            for (var i = skipInitial ? 1 : 0; i < populationSize; i++) {
                var particle = this.particles[i];

                for (var x = 0; x < particle.boxes.length; x++) {
                    var box = particle.boxes[x];
                    var popBestbox = this.bestParticle.boxes[x];
                    var particleBestbox = particle.best.boxes[x];

                    var r1 = Math.random() / sr1;
                    var r2 = Math.random() / sr2;
                    var r3 = Math.random() / sr3;

                    var distanceFromPersonalBest = particleBestbox.x1 - box.x1;
                    var distanceFromGlobalBest = popBestbox.x1 - box.x1;

                    box.xv = 2 * r1 * box.xv + 2 * r2 * distanceFromPersonalBest + 2 * r3 * distanceFromGlobalBest;

                    var distanceFromPersonalBest = particleBestbox.y1 - box.y1;
                    var distanceFromGlobalBest = popBestbox.y1 - box.y1;

                    box.yv = 2 * r1 * box.yv + 2 * r2 * distanceFromPersonalBest + 2 * r3 * distanceFromGlobalBest;
                }
            }
        },
        execute: function (board, left, top, width, height) {
            w = board.w;
            h = board.h;
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

            this.maxOverlap = scriptie.calculateMaxOverlap(this.initialConfiguration);
            this.maxDisplacement = scriptie.calculateMaxDisplacement(this.initialConfiguration, w, h);

            this.initializePopulation();
            this.randomizePopulation();

            this.assignRandomVelocities(initialVelocity, initialLuck);

            var t0 = performance.now();

            for (cycle = 0; cycle < maxConfigs / populationSize; cycle++) {
                this.bestParticle = this.findBestParticle();

                this.updateVelocities();
                this.executeVelocities();
            }

            var t1 = performance.now(), timeTaken = t1 - t0;

            this.bestParticle.totalTries = cycle;
            this.bestParticle.time = timeTaken;

            return this.bestParticle;
        }
    };
})();