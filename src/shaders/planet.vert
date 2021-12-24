#version 300 es
precision highp float;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 uv;

out vec3 fragPosition;
out vec3 fragNormal;
out vec2 fragUV;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0);

    fragPosition = vec3(model * vec4(position, 1.0));
    fragNormal = normal;
    fragUV = uv;
}
