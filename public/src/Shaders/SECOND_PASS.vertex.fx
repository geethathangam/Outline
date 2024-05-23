precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

void main() {

    vec4 p = vec4( position, 1. );

    // Draw the selected mesh as it is into the render texture.
    // Following line converts the point from local space to projection space
    gl_Position = worldViewProjection * p;
}