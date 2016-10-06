/**
 * Created by ryan on 9/21/16.
 */
"use strict";

function loader(vertexShaderPath, fragmentShaderPath, callback) {
    // Get A WebGL context
    var canvas = document.getElementById("c");
    var vertexShader, fragmentShader, program
    var shaderCount = 2;  //we will decrement this as the ajax requests complete.
    var shaders = {};

    // setupLesson(canvas);  // this is just to change the style if we're in an iframe
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Get the strings for our GLSL shaders
    var vertexShaderSource = callAjax(vertexShaderPath, function (result) {
        processShaders(result, gl.VERTEX_SHADER)
    });
    var fragmentShaderSource = callAjax(fragmentShaderPath, function (result) {
        processShaders(result, gl.FRAGMENT_SHADER)
    });


    function processShaders(shaderSource, type) {
        shaderCount--
        // create GLSL shaders, upload the GLSL source, compile the shaders
        //var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        //var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        shaders[type] = createShader(gl, type, shaderSource);
        if (!shaderCount) {
            onShadersLoaded();
            console.log(shaders);
        }
    }

    function onShadersLoaded() {

        // Link the two shaders into a program
        var program = createProgram(gl, shaders[gl.VERTEX_SHADER], shaders[gl.FRAGMENT_SHADER]);


        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        callback(gl, program);
    }

}
