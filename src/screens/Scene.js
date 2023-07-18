import Immediate from './transition/Immediate';
import { ExtContainer } from '../utils/PixiExtends';

export default class Scene extends ExtContainer {
    transitionIn = new Immediate();
    transitionOut = new Immediate();
    objectsToUpdate = [];

    //メインループで更新処理を行うべきオブジェクトの登録
    registerUpdatingObject(object) {
        this.objectsToUpdate.push(object);
    }
    /**
     * 更新処理を行うべきオブジェクトを更新する
     */
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
