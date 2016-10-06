/**
 * Created by ryan on 9/30/16.
 */


//in this exercise, I create new points by clicking in the canvas.
//this involves capturing the mouse event, and translating the x and y event coordinates
//to canvas & clipspace coordinates

"use strict";

function main() {

//------context creation and shader loading boilerplate---------------

    //paths to external shader sources
    var vertexShaderPath = 'shaders/matricesV.glsl';
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





        //set the res
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

        // hook up js variables to gl program attributes
        var a_Position = gl.getAttribLocation(program, 'a_position');

        var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

        var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

        var u_Matrix = gl.getUniformLocation(program, 'u_matrix');

        //array to store our point positions
        var g_points = [];

        //counter
        var counter = 0;
        var rads = 0;

        var matrix = makeIdentity();



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

            //x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
            //y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
            x = x - rect.left;
            y = y -rect.top;

            g_points.push(x, y, z, [Math.abs(x)/canvas.height, Math.abs(y)/canvas.height, 0.0]);

        }

        g_points.push(canvas.width/2,canvas.height/2,15, [0.0, 0.0, 1.0, 1.0]); //so the screen isn't blank to start
        console.log(g_points);

        function loop(){

            //set clear color
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            //clear the screen
            gl.clear(gl.COLOR_BUFFER_BIT);

            var len = g_points.length;

            var rotation = makeRotation(rads);

            matrix = matrixMultiply(matrix, rotation);

            //currently only drawing one at a time, no buffer, no batch. NOT how webGL works best
            //but works for playing around with what I've learned so far
            for(var i = 0; i < len; i+=4){

                //pass vertex position to attribute variable
                gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

                //gl.uniformMatrix3fv(u_Matrix, false, matrix);
                //pass point draw size to attribute variable
                //gl.vertexAttrib1f(a_PointSize, g_points[i+2]); //the 'z' value

                //set the fragment Color to the tuple we stored at i+3
                gl.uniform4f(u_FragColor, g_points[i+3][0], g_points[i+3][1], g_points[i+3][2], 1.0);

                // draw
                //var primitiveType = gl.POINTS;
                //var offset = 0;
                //var count = 1;
                gl.drawArrays(gl.POINTS, 0, 1);

                counter+= .00001;

                rads = counter / 0.0174533;



                //positions[i] = positions[i] * Math.sin(counter);
                //positions[i+2] = positions[i+2] * Math.cos(counter);


            }

            requestAnimationFrame(loop);
        }

        loop();

    }
}

main();
