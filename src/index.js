import Phaser from "phaser";
import { LoadScene } from "./js/scenes/LoadScene";
import { GameScene } from "./js/scenes/GameScene";

const config = {
  type: Phaser.AUTO, 
  backgroundColor: 0xdaf1f7,     
  scale: {
    mode: Phaser.Scale.FIT,
    width: '100%',
    height: '100%'   
  },
  scene: [
    LoadScene,
    GameScene
  ]
};

var volumeLevel = 1;

//FBInstant.initializeAsync().then(function() {
  const game     = new Phaser.Game(config);
  //const soundMan = new BaseSoundManager(game);
//}).catch(function(error) {
//  console.log(error.message);
//});
