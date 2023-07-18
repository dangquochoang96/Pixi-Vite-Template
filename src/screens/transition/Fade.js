import { Container, Graphics } from 'pixi.js';
import { GameManager } from '../../manager/GameManager';

export default class Fade {
    //黒画面のコンテナ
    container = new Container();
    //黒画面の描画
    overlay = new Graphics();
    //トランジション開始フラグ
    transitionBegan = false;
    //トランジション終了フラグ
    transitionFinished = false;
    //トランジション終了時コールバック
    onTransitionFinished = () => {};

    constructor(alphaFrom, alphaTo, alphaProgress) {
        this.alphaFrom = alphaFrom;
        this.alphaTo = alphaTo;
        this.alphaProgress = alphaProgress;

        const width = GameManager.instance.game.view.width;
        const height = GameManager.instance.game.view.height;

        this.overlay.beginFill(0x000000);
        this.overlay.moveTo(0, 0);
        this.overlay.lineTo(width, 0);
        this.overlay.lineTo(width, height);
        this.overlay.lineTo(0, height);
        this.overlay.endFill();

        this.overlay.alpha = this.alphaFrom;
        this.container.addChild(this.overlay);
    }
    getContainer() {
        return this.container;
    }

    begin() {
        this.transitionBegan = true;
    }
    isBegan() {
        return this.transitionBegan;
    }
    isFinished() {
        return this.transitionFinished;
    }
    isActive() {
        return this.isBegan() && !this.isFinished();
    }

    update(_dt) {
        if (!this.isBegan()) return;
        if (this.isFinished()) return;

        if (
            (this.alphaTo <= this.alphaFrom &&
                this.overlay.alpha <= this.alphaTo) ||
            (this.alphaTo >= this.alphaFrom &&
                this.overlay.alpha >= this.alphaTo)
        ) {
            this.onTransitionFinished();
            this.transitionFinished = true;
        } else {
            this.overlay.alpha += this.alphaProgress;
        }
    }

    setCallback(callback) {
        this.onTransitionFinished = callback;
    }
}
