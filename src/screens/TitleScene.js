import { Sprite, Text, TextStyle } from 'pixi.js';
import Scene from './Scene';
import { GameScene } from './GameScene';
import { GameManager } from '../manager/GameManager';
import Fade from './transition/Fade';
import { PixelateFilter } from '@pixi/filter-pixelate';
import { GameConfig } from '../utils/constant';

export default class TitleScene extends Scene {
    isTransitionOutStart = false;

    constructor() {
        super();
        this.transitionOut = new Fade(0.0, 1.0, 0.02);
        this.initScene();
    }
    initScene() {
        this.eventMode = 'static';
        const bg = new Sprite();
        bg.width = GameConfig.Screen.Width;
        bg.height = GameConfig.Screen.Height;
        this.addChild(bg);

        const title = new Text(
            'Hello World',
            new TextStyle({
                fontFamily: 'MinecraftTen',
                fontSize: 100,
                fill: [0xffff00, 0xff0000],
                padding: 12,
                fontWeight: 'bold',
                stroke: 0xffffff,
                strokeThickness: 10,
            }),
        );
        title.anchor.set(0.5, 0.5);
        title.position.set(GameConfig.Screen.Width * 0.5, GameConfig.Screen.Height * 0.3);
        this.addChild(title);

        this.text = new Text(
            'TOUCH TO START',
            new TextStyle({
                fontFamily: 'MinecraftTen',
                fontSize: 32,
                fill: 0xffff00,
                padding: 12,
            }),
        );
        this.text.anchor.set(0.5, 0.5);
        this.text.position.set(
            GameConfig.Screen.Width * 0.5,
            GameConfig.Screen.Height * 0.7,
        );
        this.addChild(this.text);

        window.addEventListener('pointerup', () => {
            if (!this.isTransitionOutStart) {
                this.isTransitionOutStart = true;

                this.pixelateFilter = new PixelateFilter();
                this.pixelateFilter.size = 0;
                this.filters = [this.pixelateFilter];

                this.beginTransitionOut(() =>
                    GameManager.loadScene(new GameScene()),
                );
            }
        });
    }
    textAppealDuration = 20;
    pixelSize = 1;
    update(dt) {
        super.update(dt);
        if (this.elapsedFrameCount % this.textAppealDuration === 0) {
            const visible = this.text.visible;
            this.text.visible = !visible;
        }
        if (this.isTransitionOutStart) {
            this.pixelateFilter.size = this.pixelSize++;
        }
    }
}
