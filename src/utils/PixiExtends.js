/***************************************************************************
 * Extending Pixi classes for game development
 * Implement UpdateObject to be able to use update()
 ***************************************************************************/
import { Container, Sprite } from 'pixi.js';
/*********************************************
 * PixiのContainerクラスへUpdateObject実装
 *********************************************/
export class ExtContainer extends Container {
    destroyed = false;
    objectsToUpdate = [];
    elapsedFrameCount = 0;
    constructor() {
        super();
    }
    //メインループで更新処理を行うべきオブジェクトの登録
    registerUpdatingObject(object) {
        this.objectsToUpdate.push(object);
    }
    //更新処理を行うべきオブジェクトを更新する
    updateRegisteredObjects(delta) {
        const nextObjectsToUpdate = [];
        for (let i = 0; i < this.objectsToUpdate.length; i++) {
            const obj = this.objectsToUpdate[i];
            if (!obj || obj.isDestroyed()) {
                continue;
            }
            obj.update(delta);
            nextObjectsToUpdate.push(obj);
        }
        this.objectsToUpdate = nextObjectsToUpdate;
    }
    //Updateする子要素を追加
    addUpdateChild(obj) {
        this.addChild(obj);
        this.registerUpdatingObject(obj);
    }
    isDestroyed() {
        return this.destroyed;
    }
    destroy() {
        super.destroy();
        this.destroyed = true;
    }
    update(dt) {
        this.updateRegisteredObjects(dt);
        this.elapsedFrameCount++;
    }
}
/******************************************************************************************
 * フレームナンバーで切り替えるフレームアニメーションスプライト
 * 拡大表示すると端に余計なものが入る問題がある
 ******************************************************************************************/
export class ExtSprite extends Sprite {
    destroyed = false;
    objectsToUpdate = [];
    _frameNumber = 0;
    elapsedFrameCount = 0;
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    //メインループで更新処理を行うべきオブジェクトの登録
    registerUpdatingObject(object) {
        this.objectsToUpdate.push(object);
    }

    //更新処理を行うべきオブジェクトを更新する
    updateRegisteredObjects(delta) {
        const nextObjectsToUpdate = [];
        for (let i = 0; i < this.objectsToUpdate.length; i++) {
            const obj = this.objectsToUpdate[i];
            if (!obj || obj.isDestroyed()) {
                continue;
            }
            obj.update(delta);
            nextObjectsToUpdate.push(obj);
        }
        this.objectsToUpdate = nextObjectsToUpdate;
    }
    //Updateする子要素を追加
    addUpdateChild(obj) {
        this.addChild(obj);
        this.registerUpdatingObject(obj);
    }
    isDestroyed() {
        return this.destroyed;
    }
    destroy() {
        super.destroy();
        this.destroyed = true;
    }
    //画像データ
    get image() {
        return this._image;
    }
    set image(data) {
        this._image = data;
        this.frameColumns = (this._image.width / this.width) | 0;
        this.frameRows = (this._image.height / this.height) | 0;
        this.frameMax = this.frameRows * this.frameColumns;
        this.setTexture();
    }
    //フレームナンバー
    get frameNumber() {
        return this._frameNumber;
    }
    set frameNumber(frameNumber) {
        this._frameNumber = frameNumber;
        if (!this._image) return; //まだ画像がセットされてなければ抜ける
        this.setTexture();
    }
    //テクスチャーをセット
    setTexture() {
        const frameNumber = this._frameNumber % this.frameMax;
        const left = (frameNumber % this.frameColumns) * this.width;
        const top = ((frameNumber / this.frameColumns) | 0) * this.height;
        this.texture = new PIXI.Texture(
            this._image,
            new PIXI.Rectangle(left, top, this.width, this.height),
        );
    }
    update(dt) {
        this.updateRegisteredObjects(dt);
        this.elapsedFrameCount++;
    }
}
/***************************************************************************************************
 * 角丸のボタン
 ***************************************************************************************************/
export class RoundRectButton extends Container {
    constructor(data) {
        super();
        let width;
        if (typeof data.width === 'undefined') {
            width = 200;
        } else {
            width = data.width;
        }
        let height;
        if (typeof data.height === 'undefined') {
            height = 80;
        } else {
            height = data.height;
        }
        let backgroundColor;
        if (typeof data.backgroundColor === 'undefined') {
            backgroundColor = 0xffffff;
        } else {
            backgroundColor = data.backgroundColor;
        }
        let text;
        if (typeof data.text === 'undefined') {
            text = 'ボタン';
        } else {
            text = data.text;
        }
        let fontColor;
        if (typeof data.fontColor === 'undefined') {
            fontColor = 0x000000;
        } else {
            fontColor = data.fontColor;
        }
        let fontSize;
        if (typeof data.fontSize === 'undefined') {
            fontSize = Math.floor(width * 0.2);
        } else {
            fontSize = data.fontSize;
        }
        let fontFamily;
        if (typeof data.fontFamily === 'undefined') {
            fontFamily = 'sans-serif';
        } else {
            fontFamily = data.fontFamily;
        }
        //ボタン背景
        const bg = new PIXI.Graphics();
        bg.lineStyle(1, backgroundColor, 1);
        bg.beginFill(backgroundColor);
        bg.drawRoundedRect(0, 0, width, height, height * 0.2);
        bg.endFill();
        this.addChild(bg);
        //テキスト
        const label = new PIXI.Text(
            text,
            new PIXI.TextStyle({
                fontFamily: fontFamily,
                fontSize: fontSize,
                fill: fontColor,
                padding: 12,
                fontWeight: 'bold',
            }),
        );
        label.anchor.set(0.5, 0.5);
        label.position.set(width * 0.5, height * 0.5);
        this.addChild(label);
    }
}
