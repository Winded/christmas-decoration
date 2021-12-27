import { requestImage, requestText } from '../../webgl-framework/Ajax.js';
import { vec2, vec3, mat4 } from '../../webgl-framework/GLMatrix/index.js';
import { loadShader, loadTexture } from '../../webgl-framework/WebGLUtil.js';
import * as SharedResources from '../DataSources/SharedResources.js';
import * as Camera from '../../webgl-framework/DataSources/Camera.js';

const maxSnowflakes = 50;

const verticalStart = 5;
const verticalStop = -5;

const minX = -5;
const maxX = 5;

const minScale = 0.05;
const maxScale = 0.5;

const minSpeed = 1;
const maxSpeed = 3;

let snowflakes = [];

let mesh = null;
let texture = null;
let shader = null;

let ready = false;

function createSnowflake() {
    let startPosition = vec2.fromValues(0, verticalStart);
    startPosition[0] = minX + Math.random() * (maxX - minX);
    let scale = minScale + Math.random() * (maxScale - minScale);

    let transform = mat4.create();
    mat4.translate(transform, transform, vec3.fromValues(startPosition[0], startPosition[1], -2));
    mat4.scale(transform, transform, vec3.fromValues(scale, scale, 1));

    return {
        transform: transform,
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
    };
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 */
async function setup(gl) {
    mesh = SharedResources.resources.quadMesh;
    texture = loadTexture(gl, await requestImage("assets/textures/snowflake.png"));
    shader = loadShader(gl, await requestText("shaders/unlit.vert"), await requestText("shaders/unlit.frag"));

    ready = true;
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 */
export function start(gl) {
    setup(gl);

    for (let i = 0; i < maxSnowflakes; i++) {
        snowflakes.push(createSnowflake());
    }
}

export function update(deltaTime) {
    for (let i = 0; i < maxSnowflakes; i++) {
        let snowflake = snowflakes[i];
        snowflake.transform[13] -= snowflake.speed * deltaTime;
        if (snowflake.transform[13] < verticalStop) {
            snowflakes[i] = createSnowflake();
        }
    }
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

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);

    gl.useProgram(shader);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindVertexArray(mesh.vao);

    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projection"), false, Camera.properties.projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view"), false, Camera.properties.viewMatrix);

    for (let i = 0; i < maxSnowflakes; i++) {
        gl.uniformMatrix4fv(gl.getUniformLocation(shader, `model[${i}]`), false, snowflakes[i].transform);
    }

    gl.drawElementsInstanced(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_INT, 0, maxSnowflakes);

    gl.depthMask(true);
    gl.disable(gl.BLEND);
}
