#ifdef GL_ES
precision mediump float;
#endif

// UV coordinates
varying vec2 vUV;
        
// Default texture sample
uniform sampler2D textureSampler;
// Custom texture sample introduced from code
uniform sampler2D outlineTexture;

void main(void)
{
    vec4 first = texture2D(textureSampler, vUV);
    vec4 caustic = texture2D(outlineTexture, vUV);

    // mixes colors from first pass texture and second pass texture
    if (length(caustic) > 1.1)
        gl_FragColor = clamp(mix(first, caustic, 0.5), 0.0, 1.0);
    else
        gl_FragColor = first;
    gl_FragColor.a = 1.0;
}