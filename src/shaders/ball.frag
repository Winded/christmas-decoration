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

uniform mat4 view;

uniform vec4 ambient_color;
uniform Light light;

in vec3 fragPosition;
in vec3 fragNormal;
in vec2 fragUV;

out vec4 frag_color;

void main()
{
    vec3 viewPos = view[3].xyz;

    vec4 albedo = texture(diffuse_texture, fragUV.xy);

    vec4 specular_color = vec4(1.0, 1.0, 1.0, 1.0);

    vec3 lightDir = normalize(light.origin - fragPosition);
    vec3 viewDir = normalize(viewPos - fragPosition);
    vec3 reflectDir = reflect(lightDir, fragNormal);
    float diff = max(dot(fragNormal, lightDir), 0.0);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
    if (albedo.rgb == vec3(1.0, 1.0, 1.0)) {
        spec *= 0.1;
    }
    
    float intensity = light.intensity * (1.0 - min(length(fragPosition - light.origin) / light.range, 1.0));

    vec4 color = ambient_color + (light.color * intensity * diff) + (specular_color * intensity * spec);
    frag_color = albedo * color;
}