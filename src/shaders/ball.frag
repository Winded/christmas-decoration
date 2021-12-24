#version 300 es
precision highp float;

struct Light
{
    vec3 origin;
    vec4 color;
    float intensity;
    float range;
};

uniform sampler2D diffuse_texture;

//uniform vec4 ambient_color;
//uniform Light light;

in vec3 fragPosition;
in vec3 fragNormal;
in vec2 fragUV;

out vec4 frag_color;

void main()
{
    frag_color = texture(diffuse_texture, fragUV.xy);
    /*
    vec4 albedo = texture(diffuse_texture, fragUV.xy);

    vec3 lightDir = normalize(fragPosition - light.origin);
    float diff = max(dot(fragNormal, -lightDir), 0.0);
    
    float intensity = light.intensity * (1.0 - min(length(fragPosition - light.origin) / light.range, 1.0));

    vec4 color = ambient_color + (light.color * intensity * diff);
    frag_color = albedo * color;
    */
}