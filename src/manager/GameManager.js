import { Application } from 'pixi.js';
import { bgm } from './Sound';
import { GameConfig } from '../utils/constant';

export class GameManager {
    hasInteracted = false;
    isPushedScene = false;

    constructor(app) {
        if (GameManager.instance) {
            throw new Error('GameManager can be instantiate only once');
        }
        this.game = app;
    }

    static initialize(background) {
        const game = new Application({
            view: document.getElementById('pixi-canvas'),
            resolution: window.devicePixelRatio || 1,
            width: GameConfig.Screen.Width,
            height: GameConfig.Screen.Height,
            autoDensity: true,
            backgroundColor: background,
        });
        globalThis.__PIXI_APP__ = game;

        GameManager.instance = new GameManager(game);
        window.addEventListener('resize', GameManager.resizeCanvas);
        GameManager.resizeCanvas();
        GameManager.backgroundMusic();

        game.ticker.add(this.update, this);
    }

    static backgroundMusic() {
        window.addEventListener('pointerdown', () => {
            if (!this.hasInteracted) {
                // Only play audio if it hasn't already been played
                bgm.play('audio/Fluffing-a-Duck.mp3');
            }
            this.hasInteracted = true;
        });
    }

    static loadScene(newScene) {
        const instance = GameManager.instance;

        if (instance.currentScene) {
            instance.currentScene.destroy();
        }

        if (instance.waitingScene) {
            instance.waitingScene.destroy();
            instance.isPushedScene = false;
        }
        instance.currentScene = newScene;

        if (instance.game) {
            instance.game.stage.addChild(newScene);
        }
        newScene.beginTransitionIn((_) => {});
    }

    static pushScene(newScene) {
        const instance = GameManager.instance;

        instance.isPushedScene = true;
        instance.waitingScene = instance.currentScene;
        instance.currentScene = newScene;

        if (instance.game) {
            instance.game.stage.addChild(newScene);
        }
    }

    static popScene() {
        const instance = GameManager.instance;

        if (!instance.isPushedScene) return;
        if (!instance.waitingScene) return;

        instance.isPushedScene = false;
        instance.currentScene.destroy();
        instance.currentScene = instance.waitingScene;
    }

    static resizeCanvas() {
        const instance = GameManager.instance;
        let width = GameConfig.Screen.Width;
        let height = GameConfig.Screen.Height;
    
        // current screen size
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
        // uniform scale for our game
        const scale = Math.min(screenWidth / width, screenHeight / height);
    
        // the "uniformly enlarged" size for our game
        const enlargedWidth = Math.floor(scale * width);
        const enlargedHeight = Math.floor(scale * height);
    
        // margins for centering our game
        const horizontalMargin = (screenWidth - enlargedWidth) / 2;
        const verticalMargin = (screenHeight - enlargedHeight) / 2;
    
        // now we use css trickery to set the sizes and margins
        instance.game.view.style.width = `${enlargedWidth}px`;
        instance.game.view.style.height = `${enlargedHeight}px`;
        instance.game.view.style.marginLeft = instance.game.view.style.marginRight = `${horizontalMargin}px`;
        instance.game.view.style.marginTop = instance.game.view.style.marginBottom = `${verticalMargin}px`;
        console.log(horizontalMargin, verticalMargin);
    }

    static update(dt) {
        if (this.instance.currentScene) {
            this.instance.currentScene.update(dt);
        }
    }
}
