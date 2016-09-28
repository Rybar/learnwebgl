/**
 * Created by ryan on 9/27/16.
 */

function callAjax(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        console.log(type + ' shader creation successful')
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        console.log('program creation successful')
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}


"use strict";

function main() {
    //paths to external shader sources
    var vertexShaderPath = 'shaders/pointV.glsl';
    var fragmentShaderPath = 'shaders/pointF.glsl';

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
    var vertexShaderSource = callAjax(vertexShaderPath, function(result) { processShaders(result, gl.VERTEX_SHADER) });
    var fragmentShaderSource = callAjax(fragmentShaderPath, function(result) { processShaders(result, gl.FRAGMENT_SHADER) });


    function processShaders(shaderSource, type){
        shaderCount--
        // create GLSL shaders, upload the GLSL source, compile the shaders
        //var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        //var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        shaders[type] = createShader(gl, type, shaderSource);
        if(!shaderCount){
            onShadersLoaded();
            console.log(shaders);
        }
    }

    function onShadersLoaded(){

        // Link the two shaders into a program
        var program = createProgram(gl, shaders[gl.VERTEX_SHADER], shaders[gl.FRAGMENT_SHADER]);

        //set the res
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");


        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        //set the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        //clear screen
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        // draw
        var primitiveType = gl.POINTS;
        var offset = 0;
        var count = 1;
        gl.drawArrays(primitiveType, offset, count);

    };

}

main();
