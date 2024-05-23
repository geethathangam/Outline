#ifdef GL_ES
precision mediump float;
#endif

// UV coordinates
varying vec2 vUV;
        
// Default texture sample
uniform sampler2D textureSampler;
// Custom texture sample introduced from code
uniform sampler2D outlineTexture;
uniform vec4 outlineColor;
uniform float outlineSize;

void main(void)
{
     // Obtaining the pixel length to be colored as outline
    float offset = 1.0 / outlineSize;

	vec4 tex = texture2D(textureSampler, vUV);
	vec4 col = texture2D(outlineTexture, vUV);
	if (col.a > 0.5) {
		gl_FragColor = tex;
    }
	else {
        // outline texture contains the silhoutte of selected mesh
        // Calculate the color of the adjacent pixels in the outline texture
		float a = texture2D(outlineTexture, vec2(vUV.x + offset, vUV.y)).a +
			texture2D(outlineTexture, vec2(vUV.x, vUV.y - offset)).a +
			texture2D(outlineTexture, vec2(vUV.x - offset, vUV.y)).a +
			texture2D(outlineTexture, vec2(vUV.x, vUV.y + offset)).a;
		if (col.a < 1.0 && a > 0.0) {
			gl_FragColor = outlineColor;
        }
		else {
			gl_FragColor = tex;
        }
	}
}