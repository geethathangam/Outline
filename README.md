# b101

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Requirements:

Visual studio Code v1.89.1(Recommended Latest version)
nodejs v20.13.1(Recommended Latest version)

If you get any permission related error execute the following command in powershell: 
Set-ExecutionPolicy RemoteSigned

Install vue framework
Install following packages: babylonjs, babylon-loaders, babylon-gui

Execute "npm run serve" command in the inbuilt terminal to build and run the project.


### Details about the project:

The HTML contains a simple canvas which is used to render the graphics.
The actual script is implemented in Typescript file.
The script contains following code:
- Sets up the scene, camera, engine
- Adds basic shapes like Sphere, capsule, plane
- Loaded an obj file
- Used multipass shaders to highlight the hovered object. 
(The highlight of the object renders on top of every other object. It is not rendered as an actual outline)
#1. The actual objects are rendered in the framebuffer.
#2. The silhouette of the selected object is rendered through the second buffer in the render texture.
#3. In the final pass, the outline pixels are colored based on the color intensity from the adjacent pixels of the texture from second pass. Remaining pixels are colored as it is in the frame buffer.
- Included slider to control the width of the highlight and 
      color picker to set the color of the highlight.

### Alternate approaches:
    - Render the highlight directly into the frame buffer in the first pass and 
      actual object in the second pass. Combine the textures in the final pass.

### Inbuilt Engine capabilities:
    - The Babylonjs has the capability to render the outline of the object
      which could be occluded by the other objects.
	#1. HighlightLayer
	#2. RenderOutline
	#3. EdgesRendering