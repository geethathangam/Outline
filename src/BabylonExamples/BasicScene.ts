import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    SceneLoader,
    ShaderMaterial,
    Texture,
    RenderTargetTexture,
    StandardMaterial,
    PostProcess,
    ActionManager,
    ExecuteCodeAction,
    PassPostProcess,
    Color4,
    AbstractMesh} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, ColorPicker, Control, InputText, Rectangle, ScrollViewer, Slider, StackPanel, TextBlock, TextWrapping } from "@babylonjs/gui";
import "@babylonjs/loaders"

export class BasicScene{
    scene: Scene;
    engine: Engine;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);

        // This creates a basic Babylon Scene object (non-mesh)
        this.scene = new Scene(this.engine);

        // This creates and positions a free camera (non-mesh)
        const camera = new FreeCamera("camera", new Vector3(0, 3, -7), this.scene);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'ground' shape.
        const ground = MeshBuilder.CreateGround("ground", { width: 7, height: 7 }, this.scene);
        const grassTexture = new Texture("grass.jpg", this.scene);
        const groundMat = new StandardMaterial("groundMat", this.scene);
        groundMat.diffuseTexture = grassTexture;
        ground.material = groundMat;

        const sphere = MeshBuilder.CreateSphere("ball", {diameter: 1}, this.scene);
        sphere.position = new Vector3(1, 1, 0);

        const capsule = MeshBuilder.CreateCapsule("capsule", { tessellation:16, subdivisions:6, height: 2, radius: 0.5 }, this.scene);
        capsule.position = new Vector3(-1, 1, 0);

        const actionManager = new ActionManager(this.scene);
        this.scene.actionManager = actionManager;

        sphere.actionManager = this.scene.actionManager;
        capsule.actionManager = this.scene.actionManager;

        // first pass, render scene with original materials.
        // Copy the framebuffer into the post process for further use.
        const imagePass = new PassPostProcess("imagePass", 1.0, camera, Texture.NEAREST_SAMPLINGMODE, this.engine);

        const outlineMaterial = new ShaderMaterial(
            'outline shader material',
            this.scene,
            'SECOND_PASS', // shader path
            {
                attributes: ['position', 'normal', 'uv'],
                uniforms: ['worldViewProjection', 'outlineColor', 'outlineSize']
            }
        );
        outlineMaterial.setColor4("outlineColor", new Color4(1, 0, 0, 1.));
        outlineMaterial.setFloat("outlineSize", 0.1);

        // The render texture. We'll render the scene with highlighted meshes and apply outline shader to this texture.
        const renderTarget = new RenderTargetTexture('outline texture', 512, this.scene);
        this.scene.customRenderTargets.push(renderTarget);

        renderTarget.setMaterialForRendering(sphere, outlineMaterial);
        renderTarget.setMaterialForRendering(capsule, outlineMaterial);

        // Create the model and it to the render target
        const teapotModel = async() => {
            const modelMesh = await this.CreateModel();
            renderTarget.setMaterialForRendering(modelMesh, outlineMaterial);
        }
        teapotModel();

        // Combine the textures from first and second pass
        // and create the final texture to be displayed on screen
        const finalPass = new PostProcess(
            'Final compose shader',
            'FINAL_PASS',  // shader
            null, // attributes
            ['outlineTexture'], // textures
            1.0,  // options
            camera, // camera
            Texture.BILINEAR_SAMPLINGMODE, // sampling
            this.engine // engine
        );
        finalPass.onApply = (effect) => {
            // update the output from final pass to the outline texture.
            effect.setTexture('outlineTexture', renderTarget);
        };

        actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function(ev){
            // this.scene.hoverCursor = "pointer";
            const mesh = ev.meshUnderPointer;
            if (mesh != null){
                if (renderTarget != null && renderTarget.renderList != null) {
                    renderTarget.renderList.push(mesh);
                }
            }
            }));
            //if hover is over remove highlight of the mesh
        actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, function(ev){
            const mesh = ev.meshUnderPointer;
            if (mesh != null){
                if (renderTarget != null && renderTarget.renderList != null) {
                    const index = renderTarget.renderList.findIndex((renderMesh) => { renderMesh == mesh; })
                    renderTarget.renderList.splice(index, 1);
                }
            }
            }));

        this.CreateUIPanel(outlineMaterial);

        // update time on shader
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    async CreateModel():Promise<AbstractMesh>{
        const {meshes} = await SceneLoader.ImportMeshAsync("", "./model/", "Teapot.obj");
        console.log("meshes", meshes);
        meshes[0].name = "Teapot";
        meshes[0].position = new Vector3(0, 1, -0.5);
        meshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
        meshes[0].actionManager = this.scene.actionManager;
        return meshes[0];
    }

    CreateUIPanel(outlineMaterial : ShaderMaterial){
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const panel = new StackPanel();
        panel.isVertical = false;
        panel.top = "-180px";
        panel.paddingLeft = "10px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(panel);

        const tbStart = new TextBlock();
        tbStart.width = "30px";
        tbStart.color = "yellow";
        tbStart.text = "1";
        panel.addControl(tbStart);

        const slider = new Slider();
        slider.minimum = 1;
        slider.maximum = 10;
        slider.value = 2;
        slider.height = "15px";
        slider.width = "130px";
        slider.color = "yellow";
        slider.background = "grey";
        slider.left = "120px";
        slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        slider.onValueChangedObservable.add(function (value) {
            // sphere.scaling = unitVec.scale(value);
            outlineMaterial.setFloat("outlineSize", (value * 0.05));
        });
        panel.addControl(slider);
    
        const tbEnd = new TextBlock();
        tbEnd.width = "30px";
        tbEnd.color = "yellow";
        tbEnd.text = "10";
        panel.addControl(tbEnd);

        const picker = new ColorPicker();
        picker.width = "100px";
        picker.height = "100px";
        picker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        picker.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        picker.left = "20px";
        picker.top = "50px";
        picker.onValueChangedObservable.add(function(value) { // value is a color3
            outlineMaterial.setColor4("outlineColor", new Color4(value.r, value.g, value.b, 1.0));
        });
        advancedTexture.addControl(picker);
    }
}