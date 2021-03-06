import { run as runApp, defaultSystems, invokeCallback } from '../webgl-framework/WebGLApp.js';
import { config as pathConfig } from '../webgl-framework/DataSources/Paths.js';
import * as Setup from './Systems/Setup.js';
import * as Decoration from './Systems/Decoration.js';
import * as Background from './Systems/Background.js';
import * as Snowfall from './Systems/Snowfall.js';
import * as Webcam from './DataSources/Webcam.js';

const systems = [
    ...defaultSystems.preUpdate,
    Setup,
    Decoration,
    Background,
    Snowfall,
    ...defaultSystems.postUpdate,
];

async function main() {
    pathConfig.pathPrefix = '/webgl-framework';

    let webcam = document.getElementById("webcam");
    let webcamToggle = document.getElementById("webcam_toggle");
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      webcam.srcObject = stream;
      webcamToggle.onclick = () => {
        Webcam.settings.enabled = !Webcam.settings.enabled;
      }
    } catch {
      webcamToggle.setAttribute("style", "display: none;");
    }

    const processVideo = (now, metadata) => {
      invokeCallback(systems, "onWebcamFrame", now, metadata, webcam);
      webcam.requestVideoFrameCallback(processVideo);
    }
    webcam.requestVideoFrameCallback(processVideo);

    const success = runApp("gl_canvas", systems);
    if (!success) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
}

window.onload = main;
