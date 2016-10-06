function threeDeeOne(gl, program){

    var settings = QuickSettings.create(10,10)
        .addColor('backgroundColor', '#ffffff', drawScene)
        .addRange('X rotation', 0, 360, 40, 1, drawScene)
        .addRange('Y rotation', 0, 360, 25, 1, drawScene)
        .addRange('Z rotation', 0, 360, 325, 1, drawScene)

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Set Geometry.
    setGeometry(gl);

    // Set a random color.
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    var translation = [45, 150, 0];
    var rotation = [degToRad(40), degToRad(25), degToRad(325)];
    var scale = [1, 1, 1];

    drawScene();

    function drawScene() {
        rotation = [degToRad(settings.getRangeValue('X rotation')), degToRad(settings.getRangeValue('Y rotation')),
            degToRad(settings.getRangeValue('Z rotation'))];

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Compute the matrices
        var projectionMatrix =
            make2DProjection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        var translationMatrix =
            makeTranslation(translation[0], translation[1], translation[2]);
        var rotationXMatrix = makeXRotation(rotation[0]);
        var rotationYMatrix = makeYRotation(rotation[1]);
        var rotationZMatrix = makeZRotation(rotation[2]);
        var scaleMatrix = makeScale(scale[0], scale[1], scale[2]);

        // Multiply the matrices.
        var matrix = matrixMultiply(scaleMatrix, rotationZMatrix);
        matrix = matrixMultiply(matrix, rotationYMatrix);
        matrix = matrixMultiply(matrix, rotationXMatrix);
        matrix = matrixMultiply(matrix, translationMatrix);
        matrix = matrixMultiply(matrix, projectionMatrix);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    }


};


function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            0,   0,  0,
            30,   0,  0,
            0, 150,  0,
            0, 150,  0,
            30,   0,  0,
            30, 150,  0,

            // top rung front
            30,   0,  0,
            100,   0,  0,
            30,  30,  0,
            30,  30,  0,
            100,   0,  0,
            100,  30,  0,

            // middle rung front
            30,  60,  0,
            67,  60,  0,
            30,  90,  0,
            30,  90,  0,
            67,  60,  0,
            67,  90,  0,

            // left column back
            0,   0,  30,
            30,   0,  30,
            0, 150,  30,
            0, 150,  30,
            30,   0,  30,
            30, 150,  30,

            // top rung back
            30,   0,  30,
            100,   0,  30,
            30,  30,  30,
            30,  30,  30,
            100,   0,  30,
            100,  30,  30,

            // middle rung back
            30,  60,  30,
            67,  60,  30,
            30,  90,  30,
            30,  90,  30,
            67,  60,  30,
            67,  90,  30,

            // top
            0,   0,   0,
            100,   0,   0,
            100,   0,  30,
            0,   0,   0,
            100,   0,  30,
            0,   0,  30,

            // top rung right
            100,   0,   0,
            100,  30,   0,
            100,  30,  30,
            100,   0,   0,
            100,  30,  30,
            100,   0,  30,

            // under top rung
            30,   30,   0,
            30,   30,  30,
            100,  30,  30,
            30,   30,   0,
            100,  30,  30,
            100,  30,   0,

            // between top rung and middle
            30,   30,   0,
            30,   30,  30,
            30,   60,  30,
            30,   30,   0,
            30,   60,  30,
            30,   60,   0,

            // top of middle rung
            30,   60,   0,
            30,   60,  30,
            67,   60,  30,
            30,   60,   0,
            67,   60,  30,
            67,   60,   0,

            // right of middle rung
            67,   60,   0,
            67,   60,  30,
            67,   90,  30,
            67,   60,   0,
            67,   90,  30,
            67,   90,   0,

            // bottom of middle rung.
            30,   90,   0,
            30,   90,  30,
            67,   90,  30,
            30,   90,   0,
            67,   90,  30,
            67,   90,   0,

            // right of bottom
            30,   90,   0,
            30,   90,  30,
            30,  150,  30,
            30,   90,   0,
            30,  150,  30,
            30,  150,   0,

            // bottom
            0,   150,   0,
            0,   150,  30,
            30,  150,  30,
            0,   150,   0,
            30,  150,  30,
            30,  150,   0,

            // left side
            0,   0,   0,
            0,   0,  30,
            0, 150,  30,
            0,   0,   0,
            0, 150,  30,
            0, 150,   0]),
        gl.STATIC_DRAW);
}


loader('shaders/matricesV.glsl', 'shaders/matricesF.glsl', threeDeeOne);