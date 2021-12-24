import { mat4 } from '../../webgl-framework/GLMatrix/index.js';
import * as Camera from '../../webgl-framework/DataSources/Camera.js';
import { loadShader, loadStandardVertexBuffer, loadTexture } from '../../webgl-framework/WebGLUtil.js';
import { requestImage, requestText } from '../../webgl-framework/Ajax.js';
import { resources as sharedResources } from '../DataSources/SharedResources.js';

let shader = null;
let textures = {
    diffuse: null,
    specular: null,
};
let mesh = null;

let ballMatrix = mat4.create();
let cylinderMatrix = mat4.create();

let ready = false;

/**
 *  
 * @param {WebGL2RenderingContext} gl 
 */
async function setup(gl) {
    shader = loadShader(gl, await requestText("/shaders/ball.vert"), await requestText("/shaders/ball.frag"));
    textures.diffuse = loadTexture(gl, await requestImage("/assets/textures/snowflake-ball.png"));
    mesh = sharedResources.sphereMesh;

    ready = true;
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 */
export function start(gl) {
    setup(gl);
}

export function update(deltaTime) {
    mat4.rotateY(ballMatrix, ballMatrix, (45 / 180) * Math.PI * deltaTime);
}

/**
 * 
 * @param {float} deltaTime 
 * @param {WebGL2RenderingContext} gl 
 */
export function render(deltaTime, gl) {
    if (!ready) {
        return;
    }

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(shader);
    gl.bindTexture(gl.TEXTURE_2D, textures.diffuse);
    gl.bindVertexArray(mesh.vao);

    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projection"), false, Camera.properties.projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view"), false, Camera.properties.viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "model"), false, ballMatrix);

    gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_INT, 0);
}
