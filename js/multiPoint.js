/**
 * Created by ryan on 9/30/16.
 */
/**
 * Created by ryan on 9/30/16.
 */


//in this exercise, I create a vertex buffer and begin drawing triangles.

"use strict";

function main() {

//------context creation and shader loading boilerplate---------------

    //paths to external shader sources
    var vertexShaderPath = 'shaders/pointV.glsl';
    var fragmentShaderPath = 'shaders/pointF.glsl';

    // Get A WebGL context
    var canvas = document.getElementById("c");
    var vertexShader, fragmentShader, program
    var shaderCount = 2;  //we will decrement this as the ajax requests complete.
    var shaders = {};

    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }
    //resize canvas to fit browser window
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;

    //make sure resolution matches
    gl.viewport(0,0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Get the strings for our GLSL shaders.
    var vertexShaderSource = callAjax(vertexShaderPath, function(result) { processShaders(result, gl.VERTEX_SHADER) });
    var fragmentShaderSource = callAjax(fragmentShaderPath, function(result) { processShaders(result, gl.FRAGMENT_SHADER) });


    function processShaders(shaderSource, type){
        shaderCount--
        shaders[type] = createShader(gl, type, shaderSource);
        if(!shaderCount){
            onShadersLoaded();
            console.log(shaders);
        }
    }


//-----------------------------------------------------------

    //the business happens here

    function onShadersLoaded(){

    // Link the two shaders into a program
        var program = createProgram(gl, shaders[gl.VERTEX_SHADER], shaders[gl.FRAGMENT_SHADER]);

    //set the res
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // hook up js variables to gl program attributes
        var a_Position = gl.getAttribLocation(program, 'a_Position');
        gl.bindAttribLocation(program, 0, 'a_Position');

        var u_FragColor = gl.getUniformLocation(program, 'u_FragColor')


    // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

    //set the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    //set vertex positions;
        var n = initVertexBuffers(gl);

        var counter = 0;


        function loop(){

            //var time = new Date.currentTime;

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform4f(u_FragColor, 1.0, Math.abs(Math.sin(counter)), 0.0, 1.0);

            gl.drawArrays(gl.TRIANGLES, 0, n); //n is 3;

            counter+=.01;


            requestAnimationFrame(loop);
        }

        loop();

        function initVertexBuffers(gl) {
            var vertices = new Float32Array([
                0.0, 0.5,
                -0.5, -0.5,
                0.5, -0.5
            ]);

            var n = 3; //number of vertices

            //create the buffer object
            var vertexBuffer = gl.createBuffer();

            //bind buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            //write data into the buffer object
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            var a_Position = gl.getAttribLocation(program, 'a_Position');

            //Assign teh buffer object to a_Position variable
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0,0);

            //Enable variable assignment
            gl.enableVertexAttribArray(a_Position);

            return n;
        }

    }
}

main();
