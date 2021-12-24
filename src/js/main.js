import { run as runApp, defaultSystems } from '../webgl-framework/WebGLApp.js';
import { config as pathConfig } from '../webgl-framework/DataSources/Paths.js';
import * as Setup from './Systems/Setup.js';
import * as Decoration from './Systems/Decoration.js';
import * as Background from './Systems/Background.js';

const systems = [
    ...defaultSystems.preUpdate,
    Setup,
    Decoration,
    Background,
    ...defaultSystems.postUpdate,
];

async function main() {
    pathConfig.pathPrefix = '/webgl-framework';

    const success = runApp("gl_canvas", systems);
    if (!success) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
}

window.onload = main;
