function ThreeDWorld(canvas){
    this.canvas = canvas;
    this.backgroundColor = "#000";
    this.context = canvas.getContext("webgl");
    
    this.clearColor = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 1.0
    };

    this.textColor = "#fff";
    this.textFont = "12px Courier";
    this.fps = 0;
    this.gl = null;
    
    this.vertex_shader = {
        name: "vertex_shader",
        type: this.context.VERTEX_SHADER,
        obj: null
    };

    this.fragment_shader = {
        name: "fragment_shader",
        type: this.context.FRAGMENT_SHADER,
        obj: null
    };

    this.ready = false;
    this.shaderProgram = null;

    this.shadersToLoad = [
        this.vertex_shader,
        this.fragment_shader
    ];

    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();

    this.triangleVertexPositionBuffer = null;
    this.squareVertexPositionBuffer = null;

    this.initBuffers();
    this.loadNextShader();
    this.reset();
};

ThreeDWorld.prototype.initBuffers = function() {
    var gl = this.context;

    this.triangleVertexPositionBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);

    var vertices = [
        0.0,  1.0, 0.0,
       -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = 3;

    this.squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);

    vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.squareVertexPositionBuffer.itemSize = 3;
    this.squareVertexPositionBuffer.numItems = 4;
};

ThreeDWorld.prototype.setMatrixUniforms = function() {
    var gl = this.context;

    gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
};

ThreeDWorld.prototype.loadNextShader = function() {
    if(this.shadersToLoad.length > 0) {
        var shaderToLoad = this.shadersToLoad.splice(0, 1)[0];
        var that = this;

        ShadersHelper.getShader(shaderToLoad.name, shaderToLoad.type, 
            function(shader){
                shaderToLoad.obj = shader;
                that.loadNextShader();
            }
        );
    }
    else {
        this.setupShaders();
        this.ready = true;
    }
};

ThreeDWorld.prototype.setupShaders = function() {
    var gl = this.context;

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, this.vertex_shader.obj);
    gl.attachShader(this.shaderProgram, this.fragment_shader.obj);
    gl.linkProgram(this.shaderProgram);

    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        console.error("Could not initialize shaders");
    }

    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = 
        gl.getAttribLocation(this.shaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.pMatrixUniform = 
        gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = 
        gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
}

ThreeDWorld.prototype.update = function(gameTime) {
    this.fps = gameTime.fps;
};

ThreeDWorld.prototype.draw = function(context) {
    if(this.ready) {
        var gl = this.context;
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 
            0.1, 100.0, this.pMatrix);
        mat4.identity(this.mvMatrix);

        this.drawTriangle(gl);
        this.drawSquare(gl);
    }
};

ThreeDWorld.prototype.drawTriangle = function(gl) {
    mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 
        this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    this.setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
};

ThreeDWorld.prototype.drawSquare = function(gl) {
    mat4.translate(this.mvMatrix, [3.0, 0.0, 0.0]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 
        this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    this.setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
};

ThreeDWorld.prototype.drawFps = function(context) {
    /*context.font = this.textFont;
    context.fillStyle = this.textColor;
    context.fillText("fps: " + this.fps, 10, 15);*/
};

ThreeDWorld.prototype.reset = function() {

};