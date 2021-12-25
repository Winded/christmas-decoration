import { mat4, vec3 } from '../../webgl-framework/GLMatrix/index.js';
import * as Camera from '../../webgl-framework/DataSources/Camera.js';
import * as SharedResources from '../DataSources/SharedResources.js';
import { generateSphereMesh, quad } from '../../webgl-framework/PrimitiveMesh.js';
import { loadStandardVertexBuffer } from '../../webgl-framework/WebGLUtil.js';
import * as Viewoprt from '../../webgl-framework/DataSources/Viewport.js';

export function start(gl) {
    mat4.perspective(Camera.properties.projectionMatrix, Math.PI / 3, Viewoprt.resolution.width / Viewoprt.resolution.height, 0.1, 100);
    mat4.lookAt(Camera.properties.viewMatrix, vec3.fromValues(0, 0, 4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    let mesh = generateSphereMesh(1, 128, 64);
    SharedResources.resources.sphereMesh = loadStandardVertexBuffer(gl, mesh.vertices, mesh.indices);
    SharedResources.resources.quadMesh = loadStandardVertexBuffer(gl, quad.vertices, quad.indices);
}
