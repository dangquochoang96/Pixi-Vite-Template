import { Container } from "pixi.js";
import Immediate from "./transition/Immediate";

export default class Scene extends Container {
  destroyed = false;
  objectsToUpdate = [];
  elapsedFrameCount = 0;
  constructor() {
    super();
    this.transitionIn = new Immediate();
    this.transitionOut = new Immediate();
    this.eventMode = "static";
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

  /**
   * シーン追加トランジション開始
   * 引数でトランジション終了時のコールバックを指定できる
   */
  beginTransitionIn(onTransitionFinished) {
    this.transitionIn.setCallback(() => onTransitionFinished(this));

    const container = this.transitionIn.getContainer();
    if (container) {
      this.addChild(container);
    }
    this.transitionIn.begin();
  }

  /**
   * シーン削除トランジション開始
   * 引数でトランジション終了時のコールバックを指定できる
   */
  beginTransitionOut(onTransitionFinished) {
    this.transitionOut.setCallback(() => onTransitionFinished(this));

    const container = this.transitionOut.getContainer();
    if (container) {
      this.addChild(container);
    }
    this.transitionOut.begin();
  }

  elapsedFrameCount = 0;

  /**
   * GameManagerによってrequestAnimationFrame毎に呼び出されるメソッド
   */
  update(delta) {
    this.elapsedFrameCount++;
    if (this.transitionIn.isActive()) {
      this.transitionIn.update(delta);
    } else if (this.transitionOut.isActive()) {
      this.transitionOut.update(delta);
    }
  }
}
