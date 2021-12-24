#version 300 es
precision highp float;

uniform sampler2D diffuse_texture;

in vec2 fragUV;

out vec4 frag_color;

void main()
{
    frag_color = texture(diffuse_texture, fragUV.xy);
}