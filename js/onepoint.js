/**
 * Created by ryan on 9/27/16.
 */

//in this setup, one point is drawn in the center of the screen, it's position set explicitly in the shader.
//no data is passed to the shader from JS.

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


//-----------------------------------------------------------

    //the business happens here

    function onShadersLoaded(){

        // Link the two shaders into a program
        var program = createProgram(gl, shaders[gl.VERTEX_SHADER], shaders[gl.FRAGMENT_SHADER]);

        gl.bindAttribLocation(program, 0, 'a_Position');



        //set the res
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

        // hook up js variables to gl program attributes
        var a_Position = gl.getAttribLocation(program, 'a_Position');

        var a_PointSize = gl.getAttribLocation(program, 'a_PointSize')

        //array to store our point positions
        var positions = [];

        //counter
        var counter = 0;



        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        //set the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);



        var i = 1000;
        while(i--) {
            positions.push(Math.random() * 2 -1);  //x
            positions.push(Math.random() * 2 -1); //y
            positions.push(Math.random() * 20); //size

        }

    function loop(){

        //set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //clear the screen
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = positions.length;
        for(var i = 0; i < len; i+=3){

            //pass vertex position to attribute variable
            gl.vertexAttrib3f(a_Position, positions[i] * Math.sin(counter), positions[i+1] * Math.cos(counter), 0.0);
            //pass point draw size to attribute variable
            gl.vertexAttrib1f(a_PointSize, positions[i+2]);

            // draw
            var primitiveType = gl.POINTS;
            var offset = 0;
            var count = 1;
            gl.drawArrays(primitiveType, offset, count);

            counter+= .00001;

            //positions[i] = positions[i] * Math.sin(counter);
            //positions[i+2] = positions[i+2] * Math.cos(counter);


        }

        requestAnimationFrame(loop);
    }

loop();

    }
}

main();
