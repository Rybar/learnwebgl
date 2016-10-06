/**
 * Created by ryan on 9/21/16.
 */
"use strict";

function main() {
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
    var vertexShaderSource = callAjax('shaders/rectanglesV.glsl', function(result) { processShaders(result, gl.VERTEX_SHADER) });
    var fragmentShaderSource = callAjax('shaders/rectanglesF.glsl', function(result) { processShaders(result, gl.FRAGMENT_SHADER) });


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


        // look up where the vertex data needs to go.
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

        var colorLocation = gl.getUniformLocation(program, "u_color");

        // Create a buffer and put three 2d clip space points in it
        var positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset)

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);



        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        //set the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);



        var ii = 50;
        while(ii--){

            //make a random rectangle
            setRectangle(
                gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300)
            );
            //set a random color
            gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

            //draw the rectangle.
            gl.drawArrays(gl.TRIANGLES, 0, 6);

        }
        //returns a random int
        function randomInt(range) {
            return Math.floor(Math.random() * range);
        }

        //rectangle buffer filler
        function setRectangle(gl, x, y, width, height) {
            var x1 = x;
            var x2 = x + width;
            var y1 = y;
            var y2 = y + width;

            //gl.bufferData(...) will affect whatever buffer is bound to the 'ARRAY_BUFFER' bind point.
            //only 1 buffer in examples so far, but if we had more than one we'd want to bind the buffer
            //before pushing data to it

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1, //first triangle
                x2, y1,
                x1, y2,
                x1, y2, //second triangle
                x2, y1,
                x2, y2
                ]), gl.STATIC_DRAW);
        }


        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);

    };

}

main();
