#version 300 es
precision highp float;

struct Star
{
    vec3 origin;
    vec4 color;
    float intensity;
    float range;
};

uniform sampler2D diffuse_texture;

uniform vec4 ambient_color;
uniform Star star;

in vec3 fragPosition;
in vec3 fragNormal;
in vec2 fragUV;

out vec4 frag_color;

void main()
{
    vec4 albedo = texture(diffuse_texture, fragUV.xy);

    vec3 lightDir = normalize(fragPosition - star.origin);
    float diff = max(dot(fragNormal, -lightDir), 0.0);
    
    float intensity = star.intensity * (1.0 - min(length(fragPosition - star.origin) / star.range, 1.0));

    vec4 color = ambient_color + (star.color * intensity * diff);
    frag_color = albedo * color;
}