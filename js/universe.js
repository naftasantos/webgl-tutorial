function Universe(canvas){
    this.canvas = canvas;
    this.context = null;
    this.initWebGL();

    this.timing = {
        lastTimer: 0,
        currentTimer: 0,
        time: 0,
        fps: 60,
        frameCounter: 0,
        timeCounter: 0
    };

    this.timing.lastTimer = new Date().getTime();
    this.timing.currentTimer = this.timing.lastTimer;

    this.worlds = []
};

Universe.prototype.update = function() {
    var gameTime = { time: 0, fps: 0 };
    this.calculateTime();

    gameTime.fps = this.timing.fps;
    gameTime.time = this.timing.time;

    for (var idx in this.worlds) {
        world = this.worlds[idx];
        world.update(gameTime);
    }
};

Universe.prototype.erase = function() {
    if(this.context) {
        this.context.clear(this.context.COLOR_BUFFER_BIT | 
            this.context.DEPTH_BUFFER_BIT);
    }
};

Universe.prototype.draw = function() {
    if(this.context) {
        this.updateCanvasSize();

        for (var idx in this.worlds) {
            world = this.worlds[idx];
            world.draw(this.context);
        }
    }
};

Universe.prototype.calculateTime = function() {
    this.timing.currentTimer = new Date().getTime();
    this.timing.time = this.timing.currentTimer - this.timing.lastTimer;
    this.timing.lastTimer = this.timing.currentTimer;
    this.timing.timeCounter += this.timing.time;
    this.timing.frameCounter++;

    if(this.timing.timeCounter >= 1000){ // one second
        this.timing.timeCounter = 0;
        this.timing.fps = this.timing.frameCounter;
        this.timing.frameCounter = 0;
    }

    // this parameter should be passed along as second
    this.timing.time /= 1000;
};

Universe.prototype.updateCanvasSize = function() {
    // Make the canvas occupy the whole screen
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context.viewportWidth = this.canvas.width;
    this.context.viewportHeight = this.canvas.height;
    this.context.viewport(0, 0, this.context.viewportWidth, 
        this.context.viewportHeight);
};

Universe.prototype.initWebGL = function() {
    this.context = null;

    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        this.context = this.canvas.getContext("webgl") || 
                       this.canvas.getContext("experimental-webgl");
    }
    catch(e) {
        console.error(e);
        this.context = null;
    }

    // If we don't have a GL context, give up now
    if (!this.context) {
        console.error("Unable to initialize WebGL. Your browser may not support it.");
    }
    else {
        this.context.enable(this.context.DEPTH_TEST);
        this.context.depthFunc(this.context.LEQUAL);
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);

        ShadersHelper.setGlContext(this.context);
    }
};