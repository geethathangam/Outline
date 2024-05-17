precision highp float;
        
// Attributes to be used in vertex shader
attribute vec3 position;
attribute vec2 uv;

// Matrix to convert psoition from object space to projection space
uniform mat4 worldViewProjection;

// UV coordinates to be used in fragment shader
varying vec2 vUV;

void main() {
    vUV = uv;
    // Rendering the mesh as it is.
    gl_Position = worldViewProjection * vec4(position, 1.0);
}