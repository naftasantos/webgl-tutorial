ShadersHelper = {
    baseShaderPath: "/js/shaders/",
    gl: null,

    /**
     * Loads a shader file with the specified name and returns a compiled
     * shader to the callback method
     *
     * @name The name of the shader file (without the .gsls extension)
     * @type The type of the shader. Eg.: FRAGMENT_SHADER, VERTEX_SHADER, etc.
     * @callback The function to be called when everything is done
     */
    getShader: function(name, type, callback) {
        var gl = ShadersHelper.gl;

        if(!gl) {
            console.error(
                "Gl context not set. Please set it with setGlContext");

            return;
        }

        ShadersHelper.load(name, function(shaderScript) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, shaderScript);
            gl.compileShader(shader);

            if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Error compiling shader " + name);
                console.error(gl.getShaderInfoLog(shader));
            }
            else {
                callback(shader);
            }
        });
    },

    load: function(name, callback) {
        $.ajax({
            url: ShadersHelper.baseShaderPath + name + ".glsl",
            dataType: "text",
            success: function(data) {
                if(callback) {
                    callback(data);
                }
            }
        });
    },

    setGlContext: function(context) {
        ShadersHelper.gl = context;
    }
}