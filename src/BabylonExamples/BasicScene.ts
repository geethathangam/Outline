import { Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, Color3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders"

export class BasicScene{
    scene: Scene;
    engine: Engine;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.engine.runRenderLoop(()=> {
            this.scene.render();
        })
    }

    CreateScene():Scene{
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
        camera.attachControl();

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene);
        hemiLight.intensity = 0.5;

        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, this.scene);
        const ball = MeshBuilder.CreateSphere("ball", {diameter: 1}, this.scene);
        ball.position = new Vector3(1, 1, 0);

        const capsule = MeshBuilder.CreateCapsule("capsule", { tessellation:16, subdivisions:6, height: 2, radius: 0.5 }, this.scene);
        capsule.position = new Vector3(-1, 1, 0);

        this.CreateModel();

        return scene;
    }

    async CreateModel():Promise<void>{
        const {meshes} = await SceneLoader.ImportMeshAsync("", "./model/", "Teapot.obj");
        console.log("meshes", meshes);
        meshes[0].position = new Vector3(0, 1, -0.5);
        meshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
    }
}