import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 480,
    height: 800,
    backgroundColor: '#87ceeb',
    parent: 'game-container',
    scene: [GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1200 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 480,
        height: 800,
        parent: 'game-container'
    }
};

new Phaser.Game(config);
