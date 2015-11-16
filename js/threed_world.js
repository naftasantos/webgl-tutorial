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
    this.mvMatrixStack = [];
    this.pMatrix = mat4.create();

    this.rPyramid = 0;
    this.rCube = 0;

    this.pyramidVertexPositionBuffer = null;
    this.pyramidVertexColorBuffer = null;
    this.cubeVertexPositionBuffer = null;
    this.cubeVertexColorBuffer = null;

    this.initBuffers();
    this.loadNextShader();
    this.reset();
};

ThreeDWorld.prototype.initBuffers = function() {
    var gl = this.context;

    // Pyramid positioning
    this.pyramidVertexPositionBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexPositionBuffer);

    var vertices = [
        // Front face
         0.0,  1.0,  0.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
        // Right face
         0.0,  1.0,  0.0,
         1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
        // Back face
         0.0,  1.0,  0.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        // Left face
         0.0,  1.0,  0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.pyramidVertexPositionBuffer.itemSize = 3;
    this.pyramidVertexPositionBuffer.numItems = 12;

    // Triangle coloring
    this.pyramidVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexColorBuffer);

    var colors = [
        // Front face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        // Right face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        // Back face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        // Left face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.pyramidVertexColorBuffer.itemSize = 4;
    this.pyramidVertexColorBuffer.numItems = 12;

    // Square positioning
    this.cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

    vertices = [
      // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3;
    this.cubeVertexPositionBuffer.numItems = 24;

    this.cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
    
    colors = [
        [1.0, 0.0, 0.0, 1.0],     // Front face
        [1.0, 1.0, 0.0, 1.0],     // Back face
        [0.0, 1.0, 0.0, 1.0],     // Top face
        [1.0, 0.5, 0.5, 1.0],     // Bottom face
        [1.0, 0.0, 1.0, 1.0],     // Right face
        [0.0, 0.0, 1.0, 1.0],     // Left face
    ];
    
    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), 
        gl.STATIC_DRAW);
    this.cubeVertexColorBuffer.itemSize = 4;
    this.cubeVertexColorBuffer.numItems = 24;

    this.cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), 
        gl.STATIC_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = 36;
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

    this.shaderProgram.vertexColorAttribute = 
        gl.getAttribLocation(this.shaderProgram, "aVertexColor");

    gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.pMatrixUniform = 
        gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = 
        gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
}

ThreeDWorld.prototype.update = function(gameTime) {
    this.fps = gameTime.fps;

    this.rPyramid += 90 * gameTime.time;
    this.rCube += 74 * gameTime.time;
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

    this.mvPushMatrix();
    
    mat4.rotate(this.mvMatrix, Utils.degToRad(this.rPyramid), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 
        this.pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexColorBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, 
        this.pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    this.setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, this.pyramidVertexPositionBuffer.numItems);

    this.mvPopMatrix();
};

ThreeDWorld.prototype.drawSquare = function(gl) {
    mat4.translate(this.mvMatrix, [3.0, 0.0, 0.0]);
    
    this.mvPushMatrix();
    
    mat4.rotate(this.mvMatrix, Utils.degToRad(this.rCube), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 
        this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, 
        this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

    this.setMatrixUniforms();
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.cubeVertexPositionBuffer.numItems);
    gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, 
        gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();
};

ThreeDWorld.prototype.drawFps = function(context) {
    /*context.font = this.textFont;
    context.fillStyle = this.textColor;
    context.fillText("fps: " + this.fps, 10, 15);*/
};

ThreeDWorld.prototype.reset = function() {

};

ThreeDWorld.prototype.mvPushMatrix = function() {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
};

ThreeDWorld.prototype.mvPopMatrix = function() {
    if (this.mvMatrixStack.length === 0) {
        throw("Invalid Pop Matrix!");
    }

    this.mvMatrix = this.mvMatrixStack.pop();
}