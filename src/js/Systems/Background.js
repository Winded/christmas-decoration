import { quad as quadMesh } from '../../webgl-framework/PrimitiveMesh.js';
import { loadShader, loadStandardVertexBuffer, loadTexture } from '../../webgl-framework/WebGLUtil.js';
import { requestImage, requestText } from '../../webgl-framework/Ajax.js';
import { mat4, vec3 } from '../../webgl-framework/GLMatrix/index.js';
import * as Camera from '../../webgl-framework/DataSources/Camera.js';

let mesh = null;
let texture = null;
let shader = null;

let modelMatrix = mat4.create();

let ready = false;

async function setup(gl) {
    mesh = loadStandardVertexBuffer(gl, quadMesh.vertices, quadMesh.indices);
    texture = loadTexture(gl, await requestImage("/assets/textures/background.png"));
    shader = loadShader(gl, await requestText("/shaders/unlit.vert"), await requestText("/shaders/unlit.frag"));

    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -10));
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(30, 25, 1));

    ready = true;
}

export function start(gl) {
    setup(gl);
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
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindVertexArray(mesh.vao);

    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projection"), false, Camera.properties.projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view"), false, Camera.properties.viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "model"), false, modelMatrix);

    gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_INT, 0);
}
