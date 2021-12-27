#version 300 es
precision highp float;

uniform mat4 projection;
uniform mat4 view;

uniform mat4 model[100];

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 uv;

out vec2 fragUV;

void main()
{
    gl_Position = projection * view * model[gl_InstanceID] * vec4(position, 1.0);
    fragUV = uv;
}
