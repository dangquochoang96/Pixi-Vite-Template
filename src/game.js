import { GameManager } from './manager/GameManager';
import { GameConfig } from './utils/constant';
import { LoaderScene } from './screens/LoaderScene';

function startGame() {
    GameManager.initialize(GameConfig.Screen.BackgroundColor);
    // We no longer need to tell the scene the size because we can ask Manager!
    const loady = new LoaderScene();
    GameManager.loadScene(loady);
}

window.onload = () => {
    startGame();
};