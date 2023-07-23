import { Tween, Group } from 'tweedle.js';
import { Sprite, Ticker } from 'pixi.js';
import Scene from './Scene';
import { GameManager } from '../manager/GameManager';
import { GameConfig } from '../utils/constant';

export class GameScene extends Scene {
    constructor() {
        super();

        this.cat = Sprite.from('images/cat.png');

        this.cat.anchor.set(0.5);
        this.cat.x = GameConfig.Screen.Width / 2;
        this.cat.y = GameConfig.Screen.Height / 2;
        this.addChild(this.cat);

        // See how these chains all together
        new Tween(this.cat.scale)
            .to({ x: 0.5, y: 0.5 }, 1000)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }

    update() {
        Group.shared.update();
    }
}
