import { mat4, vec3, vec4 } from '../../webgl-framework/GLMatrix/index.js';
import * as Camera from '../../webgl-framework/DataSources/Camera.js';
import { loadShader, loadStandardVertexBuffer, loadTexture } from '../../webgl-framework/WebGLUtil.js';
import { requestImage, requestText } from '../../webgl-framework/Ajax.js';
import { resources as sharedResources } from '../DataSources/SharedResources.js';
import * as Webcam from '../DataSources/Webcam.js';

let shader = null;
let textures = {
    diffuse: null,
    specular: null,
    webcam: null,
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

let glContext = null;

let ready = false;

/**
 *  
 * @param {WebGL2RenderingContext} gl 
 */
async function setup(gl) {
    shader = loadShader(gl, await requestText("shaders/ball.vert"), await requestText("shaders/ball.frag"));
    textures.diffuse = loadTexture(gl, await requestImage("assets/textures/snowflake-ball.png"));
    mesh = sharedResources.sphereMesh;

    wireShader = loadShader(gl, await requestText("shaders/unlit.vert"), await requestText("shaders/unlit.frag"));
    wireTexture = loadTexture(gl, await requestImage("assets/textures/white.png"));
    quadMesh = sharedResources.quadMesh;

    textures.webcam = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textures.webcam);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 640, 480, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    glContext = gl;

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

export function onWebcamFrame(now, metadata, canvas) {
    if (!glContext || !textures.webcam || !Webcam.settings.enabled) {
        return;
    }

    let gl = glContext;
    gl.bindTexture(gl.TEXTURE_2D, textures.webcam);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, metadata.width, metadata.height, 0, gl.RGB, gl.UNSIGNED_BYTE, canvas);
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
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.diffuse);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.webcam);
    gl.bindVertexArray(mesh.vao);

    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projection"), false, Camera.properties.projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view"), false, Camera.properties.viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "model"), false, ballMatrix);

    gl.uniform3fv(gl.getUniformLocation(shader, "light.origin"), light.origin);
    gl.uniform4fv(gl.getUniformLocation(shader, "light.color"), light.color);
    gl.uniform1f(gl.getUniformLocation(shader, "light.intensity"), light.intensity);
    gl.uniform1f(gl.getUniformLocation(shader, "light.range"), light.range);
    gl.uniform4fv(gl.getUniformLocation(shader, "ambient_color"), ambientLight);

    gl.uniform1i(gl.getUniformLocation(shader, "diffuse_texture"), 0);
    gl.uniform1i(gl.getUniformLocation(shader, "webcam_texture"), 1);

    gl.uniform1i(gl.getUniformLocation(shader, "webcam_enabled"), Webcam.settings.enabled ? 1 : 0);

    gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_INT, 0);

    gl.useProgram(wireShader);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wireTexture);
    gl.bindVertexArray(quadMesh.vao);

    gl.uniformMatrix4fv(gl.getUniformLocation(wireShader, "projection"), false, Camera.properties.projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(wireShader, "view"), false, Camera.properties.viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(wireShader, "model[0]"), false, wireMatrix);

    gl.drawElements(gl.TRIANGLES, quadMesh.numIndices, gl.UNSIGNED_INT, 0);
}
