import { mat4, vec3, vec4 } from '../../webgl-framework/GLMatrix/index.js';
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

let wireShader = null;
let wireTexture = null;
let quadMesh = null;

let ballMatrix = mat4.create();
let wireMatrix = mat4.create();

const light = {
    origin: vec3.fromValues(10, 10, 10),
    color: vec4.fromValues(1, 1, 1, 1),
    intensity: 8,
    range: 20,
}

const ambientLight = vec4.fromValues(0.1, 0.1, 0.1, 1);

let ready = false;

/**
 *  
 * @param {WebGL2RenderingContext} gl 
 */
async function setup(gl) {
    shader = loadShader(gl, await requestText("/shaders/ball.vert"), await requestText("/shaders/ball.frag"));
    textures.diffuse = loadTexture(gl, await requestImage("/assets/textures/snowflake-ball.png"));
    mesh = sharedResources.sphereMesh;

    wireShader = loadShader(gl, await requestText("/shaders/unlit.vert"), await requestText("/shaders/unlit.frag"));
    wireTexture = loadTexture(gl, await requestImage("/assets/textures/white.png"));
    quadMesh = sharedResources.quadMesh;

    ready = true;
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 */
export function start(gl) {
    setup(gl);

    mat4.translate(wireMatrix, wireMatrix, vec3.fromValues(0, 2, 0));
    mat4.scale(wireMatrix, wireMatrix, vec3.fromValues(0.05, 2, 1));
}

export function update(deltaTime) {
    mat4.rotateY(ballMatrix, ballMatrix, (15 / 180) * Math.PI * deltaTime);
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

    gl.uniform3fv(gl.getUniformLocation(shader, "light.origin"), light.origin);
    gl.uniform4fv(gl.getUniformLocation(shader, "light.color"), light.color);
    gl.uniform1f(gl.getUniformLocation(shader, "light.intensity"), light.intensity);
    gl.uniform1f(gl.getUniformLocation(shader, "light.range"), light.range);
    gl.uniform4fv(gl.getUniformLocation(shader, "ambient_color"), ambientLight);

    gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_INT, 0);

    gl.useProgram(wireShader);
    gl.bindTexture(gl.TEXTURE_2D, wireTexture);
    gl.bindVertexArray(quadMesh.vao);

    gl.uniformMatrix4fv(gl.getUniformLocation(wireShader, "projection"), false, Camera.properties.projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(wireShader, "view"), false, Camera.properties.viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(wireShader, "model"), false, wireMatrix);

    gl.drawElements(gl.TRIANGLES, quadMesh.numIndices, gl.UNSIGNED_INT, 0);
}
