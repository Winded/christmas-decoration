import { mat4, vec3 } from '../../webgl-framework/GLMatrix/index.js';
import * as Camera from '../../webgl-framework/DataSources/Camera.js';
import * as Star from '../DataSources/Star.js';
import * as Planets from '../DataSources/Planets.js';
import * as SharedResources from '../DataSources/SharedResources.js';
import { generateSphereMesh } from '../../webgl-framework/PrimitiveMesh.js';

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 */
function loadMeshes(gl) {
    let mesh = generateSphereMesh();

    let vertices = new Float32Array(mesh.vertices);
    let indices = new Uint32Array(mesh.indices);

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
    gl.enableVertexAttribArray(2);
    gl.bindVertexArray(null);

    let sphereMesh = SharedResources.resources.sphereMesh;
    sphereMesh.vao = vao;
    sphereMesh.vbo = vbo;
    sphereMesh.ebo = ebo;
    sphereMesh.numIndices = mesh.indices.length;
}

export function start(gl) {
    mat4.perspective(Camera.properties.projectionMatrix, Math.PI / 3, 640 / 480, 0.1, 100);
    mat4.lookAt(Camera.properties.viewMatrix, vec3.fromValues(15, 0, 0), vec3.fromValues(10, 0, 0), vec3.fromValues(0, 1, 0));
    
    let planet = Planets.newPlanet();
    mat4.translate(planet.modelMatrix, planet.modelMatrix, vec3.fromValues(10, 0, 0));

    Star.properties.lightRadius = 20;
    Star.properties.brightness = 1.5;

    loadMeshes(gl);
}
