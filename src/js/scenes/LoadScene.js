import { constants } from "../constants";
import { Button } from '../classes/Button';
import gradientBgImg from '../../assets/sprites/bg-herodot.png';
import dotImg from '../../assets/sprites/dot.png';
//Alexandr + 14/02/2021
import dotImgBonus1 from '../../assets/sprites/bonus1/bonus1.png';
import dotImgBonus2 from '../../assets/sprites/bonus2/bonus2.png';
import dotImgBonus3 from '../../assets/sprites/bonus3/bonus3.png';
import menuMusic from '../../assets/audio/GameMusic.ogg';
import dotClick from '../../assets/audio/DotClick.ogg';
import dotBonusPickup from '../../assets/audio/BonusPickup.ogg';
import dotBonusClick from '../../assets/audio/DotBonusClick.ogg';
import dotFruitDissapear from '../../assets/audio/DissapearFruitDot.ogg';
import dotFruitBonusDissapear from '../../assets/audio/DissapearBonusDot.ogg';
import GameOver from '../../assets/audio/GameOver.ogg';
import SoundTest from '../../assets/audio/SoundTest.ogg';
import GameWin from '../../assets/audio/GameWin.ogg';
import sparks1 from '../../assets/particles/red.png';
import sparks2 from '../../assets/particles/blue.png';
import WebFontFile from '../classes/WebFontLoader';
//Alexandr - 14/02/2021

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: constants.SCENES.LOAD,
    });
  }

  init() {};

  preload() {
      
    //FBInstant.setLoadingProgress(100);  
	
    //this.facebook.showLoadProgress(this);
    //this.facebook.once('startgame', this.startGame, this); 
      
    this.load.image('gradient-bg'            , gradientBgImg);     
    this.load.spritesheet('dot'              , dotImg, { frameWidth: 64, frameHeight: 64 }); 
    this.load.audio('MenuMusic'              , menuMusic);
    this.load.audio('DotClick'               , dotClick);
    this.load.audio('DotBonusClick'          , dotBonusClick);
    this.load.audio('DotBonusPickup'         , dotBonusPickup);  
    this.load.audio('SoundTest'              , SoundTest);  
      
    this.load.audio('dotFruitDissapear'      , dotFruitDissapear);
    this.load.audio('dotFruitBonusDissapear' , dotFruitBonusDissapear);       
    this.load.audio('GameWin'                , GameWin);
    this.load.audio('GameOver'               , GameOver); 
      
    this.load.addFile(new WebFontFile(this.load, 'Tenor Sans'));  
    
    this.sound.setVolume(localStorage.getItem("volumeLevel") == null ? 1 : localStorage.getItem("volumeLevel"));  
  
    //this.sound.setVolume(localStorage.getItem("volumeLevel") == null ? 1 : localStorage.getItem("volumeLevel")+1);  
      
    //Alexandr + 14/02/2021
    this.load.spritesheet('dotbonus1', dotImgBonus1, { frameWidth: 64, frameHeight: 64, endFrame: 24 }); 
    this.load.spritesheet('dotbonus2', dotImgBonus2, { frameWidth: 64, frameHeight: 64, endFrame: 24 }); 
    this.load.spritesheet('dotbonus3', dotImgBonus3, { frameWidth: 64, frameHeight: 64, endFrame: 24 }); 
      
    this.load.image('spark' , sparks1);
    this.load.image('spark1', sparks2);  
    //Alexandr - 14/02/2021  
      
//    this.load.on("progress", value=> {
//        FBInstant.setLoadingProgress(value*100);
//    });  
//      
//    this.load.once("complete", ()=>{
//       FBInstant.startGameAsync().then(function() {
//            // nothing to do here. Phaser lifecycle would have already started
//        });
//    }); 

    //FBInstant.startGameAsync().then(this.startGame);       

//  
//    // Loading Bar
//    let loadingBar = this.add.graphics({
//      fillStyle: {
//        color: 0xffffff
//      }
//    });
//
//    this.load.on("progress", (percent) => {
//      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
//    });
};
      
create(){           
    // Add Background
    this.add.image(this.scale.width/2, this.scale.height/2, "gradient-bg").setOrigin(0);      
    let loadGameOverlay = this.add.rectangle(
      this.scale.width/2,
      this.scale.height/2,
      this.scale.width,
      this.scale.height,
      0x64AAD0,
      100
    );

   let playButton = new Button(this, this.scale.width/2, this.scale.height/2, 250, 60, 'Click To Play!');
   playButton.rectangle.on('pointerdown', ()=>
        (this.scene.start(constants.SCENES.GAME)), this); 
    
};      

//  startGame() {      
//              
//    console.log('ready');
//            
//    console.log(constants.SCENES.GAME);  
//      
//    this.scene.start(constants.SCENES.GAME);
//  }    

  //create() {
  //  this.scene.start(constants.SCENES.GAME);
  //}
}