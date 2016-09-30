/**
 * Created by ryan on 9/28/16.
 */

//in this exercise, I create new points by clicking in the canvas.
//this involves capturing the mouse event, and translating the x and y event coordinates
//to canvas & clipspace coordinates

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
        var g_points = [];

        //counter
        var counter = 0;



        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        //set the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position)};

        function click(ev, gl, canvas, a_Position) {
            var x = ev.clientX; //mouse x;
            var y = ev.clientY; //mouse y;
            var z = 15.0; //no 3d yet, for size
            var rect = ev.target.getBoundingClientRect();

            //x = ( (x - rect.left) - gl.canvas.height/2 ) / ( gl.canvas.height/2 );
            //y = ( gl.canvas.width/2 - (y - rect.top) ) / ( gl.canvas.width/2 );

            x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
            y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
            console.info('width: ' + canvas.width + ' height: ' + canvas.height  + '\nx: ' + x + ' y: ' + y);
            console.log(rect);
            //x = (ev.clientX / gl.canvas.width) * 2 - 1;
            //y = (ev.clientY / gl.canvas.height) * 2 + 1;

            g_points.push(x); g_points.push(y); g_points.push(z);
        }

        g_points.push(0,0,15); //so the screen isn't blank to start

        function loop(){

            //set clear color
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            //clear the screen
            gl.clear(gl.COLOR_BUFFER_BIT);

            var len = g_points.length;

            //currently only drawing one at a time, no buffer, no batch. NOT how webGL works best
            //but works for playing around with what I've learned so far
            for(var i = 0; i < len; i+=3){

                //pass vertex position to attribute variable
                gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
                //gl.vertexAttrib3f(a_Position, g_points[i] * Math.sin(counter), g_points[i+1] * Math.cos(counter), 0.0);
                //pass point draw size to attribute variable
                gl.vertexAttrib1f(a_PointSize, g_points[i+2]); //the 'z' value

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
