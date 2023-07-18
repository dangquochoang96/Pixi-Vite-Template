import { Assets, Container, Graphics } from 'pixi.js';
import { GameManager } from '../manager/GameManager';
import manifest from '../manifest.json';
import Scene from './Scene';
import TitleScene from './TitleScene';
import { GameConfig } from '../utils/constant';

export class LoaderScene extends Scene {
    constructor() {
        super();
        // lets make a loader graphic:
        const loaderBarWidth = GameConfig.Screen.Width * 0.8; // just an auxiliary variable
        // the fill of the bar.
        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0x008800, 1);
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0; // we draw the filled bar and with scale we set the %

        // The border of the bar.
        this.loaderBarBoder = new Graphics();
        this.loaderBarBoder.lineStyle(10, 0x0, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50);

        // Now we keep the border and the fill in a container so we can move them together.
        this.loaderBar = new Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        //Looks complex but this just centers the bar on screen.
        this.loaderBar.position.x =
            (GameConfig.Screen.Width - this.loaderBar.width) / 2;
        this.loaderBar.position.y =
            (GameConfig.Screen.Height - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);

        this.initializeLoader().then(() => {
            this.gameLoaded();
        });
    }

    async initializeLoader() {
        await Assets.init({ manifest: manifest });
        const bundleIds = manifest.bundles.map((bundle) => bundle.name);
        await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }

    downloadProgress(progressRatio) {
        this.loaderBarFill.scale.x = progressRatio;
    }

    gameLoaded() {
        // Change scene to the game scene!
        GameManager.loadScene(new TitleScene());
    }
    update() {}
    resize() {}
}
