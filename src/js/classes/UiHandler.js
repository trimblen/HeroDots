import { GAME_STATE, GAME_CONSTANTS } from '../scenes/GameScene';
import { Button } from './Button';

export class UiHandler {
  /**
   * Handles UI for the game.
   * @param {Phaser.Scene} scene - The scene this belongs to
   * @param {HTMLCanvasElement} canvas - The canvas to use for positioning
   */
  constructor(scene, canvas) {

    // This is a dictionary containing a separate array of UI elements for each game state.
    // Their visibility is handled in this.setState().
    this.uiElements = {};

    // UI elements: Start Screen
    let startOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );
    startOverlay.on('pointerdown', () => {scene.setState(GAME_STATE.GAMEINFO)}); //Alexandr + 10/02/2021 - showing gameinfo 
    startOverlay.setInteractive();

    let titleText = scene.add.bitmapText(canvas.width/2, canvas.height/2 - 150, 'bloggerSans', 'HeroDots', 115);
    titleText.setOrigin(0.5, 0.5);

    let startText = new Button(scene, canvas.width/2, canvas.height/2 + 50, 170, 60, 'Start');
    startText.rectangle.on('pointerdown', () => {scene.setState(GAME_STATE.GAMEINFO)});//Alexandr + 10/02/2021
      
    let settingsText = new Button(scene, canvas.width/2, canvas.height/2 + 150, 170, 60, 'Settings');
    //settingsText.setOrigin(0.5, 0.5); 
    settingsText.rectangle.on('pointerdown', () => {scene.setState(GAME_STATE.SETTINGS)});//Alexandr + 10/02/2021  
      
    let aboutText = new Button(scene, canvas.width/2, canvas.height/2 + 250, 170, 60, 'About');
    aboutText.rectangle.on('pointerdown', () => {scene.setState(GAME_STATE.ABOUT)});//Alexandr + 16/03/2021
      //aboutText.setOrigin(0.5, 0.5);  

    this.uiElements[GAME_STATE.START] = [
      startOverlay,
      titleText,
      startText,
      settingsText,
      aboutText  
    ];

    // UI Elements: While game is running
    this.timerDisplay = scene.add.bitmapText(48, 32, 'bloggerSansBold', Math.floor(GAME_CONSTANTS.ROUND_TIME/1000), 64);
    this.timerDisplay.setOrigin(0.5, 0.5);

    this.pointsDisplay = scene.add.bitmapText(48, 96, 'bloggerSansBold', 0, 48);
    this.pointsDisplay.setOrigin(0, 0.5);
      
    //Alexandr + 27/01/2020 - displays current level
    let pauseButton = new Button(scene, canvas.width - 96, 64, 128, 48, 'Menu');  
    pauseButton.rectangle.on('pointerdown', () => scene.setState(GAME_STATE.PAUSE));
    //Alexandr - 27/01/2020  

    this.colorOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xffffff,
      240
    );
      
    this.colorOverlay.setDepth(-8);

    this.uiElements[GAME_STATE.RUNNING] = [
      this.pointsDisplay,
      this.timerDisplay,
      pauseButton,
      this.colorOverlay
    ]

    // UI Elements: Game Over screen
    let gameOverOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );

    let timesUp = scene.add.bitmapText(canvas.width/2, canvas.height/2-100, 'bloggerSansBold', "Time's Up!", 100);
    timesUp.setOrigin(0.5, 0.5);

    this.yourScore = scene.add.bitmapText(canvas.width/2, canvas.height/2, 'bloggerSans', "Your Score:", 80);
    this.yourScore.setOrigin(0.5, 0.5);

    let restartButton = new Button(scene, canvas.width/2, canvas.height/2+150, 170, 60, 'Restart');
    restartButton.rectangle.on('pointerdown', () => scene.setState(GAME_STATE.GAMEINFO));//Alexandr + 10/02/2021

    let exitButton = new Button(scene, canvas.width/2, canvas.height/2+250, 170, 60, 'Exit');
    exitButton.rectangle.on('pointerdown', () => scene.exit());

    this.uiElements[GAME_STATE.OVER] = [
      gameOverOverlay,
      timesUp,
      this.yourScore,
      restartButton,
      exitButton
    ];
      
    //Alexandr + 16/03/2021 - about game menu
    let aboutGameOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );

    let aboutTextMain = scene.add.bitmapText(canvas.width/2, canvas.height/2-100, 'bloggerSans', "About", 80);
    aboutTextMain.setOrigin(0.5, 0.5);  
    let aboutExitButton = new Button(scene, canvas.width/2, canvas.height/2+200, 170, 60, 'Exit');
    aboutExitButton.rectangle.on('pointerdown', () => scene.exit());
      
    let aboutContent = scene.add.bitmapText(canvas.width/2, canvas.height/2+50, 'bloggerSans', "About text", 40);
    aboutContent.setOrigin(0.5, 0.5);  
      
    this.uiElements[GAME_STATE.ABOUT] = [
      aboutGameOverlay,
      aboutTextMain,
      aboutContent,    
      aboutExitButton
    ];   
    //Alexandr - 16/03/2021  
      
    //Alexandr + 29/01/2021 - pause game menu
    let pauseGameOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );

    let pauseMenuHeader = scene.add.bitmapText(canvas.width/2, canvas.height/2-150, 'bloggerSans', "Pause Menu", 80);  
    pauseMenuHeader.setOrigin(0.5, 0.5);
      
    let pauserestartButton = new Button(scene, canvas.width/2, canvas.height/2, 170, 60, 'Resume');
    pauserestartButton.rectangle.on('pointerdown', () => scene.restart()); 
      
    let settButton = new Button(scene, canvas.width/2, canvas.height/2+100, 170, 60, 'Settings');
    settButton.rectangle.on('pointerdown', () =>  scene.setState(GAME_STATE.SETTINGS));  

    let pauseexitButton = new Button(scene, canvas.width/2, canvas.height/2+200, 170, 60, 'Exit');
    pauseexitButton.rectangle.on('pointerdown', () => scene.exit());

    this.uiElements[GAME_STATE.PAUSE] = [
      pauseMenuHeader,          
      pauseGameOverlay,
      pauserestartButton,
      settButton,    
      pauseexitButton
    ];   
    //Alexandr - 29/01/2021    
      
    //Alexandr + 03/02/2021 - win game menu
    let winGameOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );

    let winrestartButton = new Button(scene, canvas.width/2, canvas.height/2+100, 170, 60, 'Exit');
    winrestartButton.rectangle.on('pointerdown', () => scene.exit());

    let continueButton = new Button(scene, canvas.width/2, canvas.height/2, 170, 60, 'Continue');
    continueButton.rectangle.on('pointerdown', () =>  scene.setState(GAME_STATE.GAMEINFO)); //Alexandr + 10/02/2021

    let winMenuHeader = scene.add.bitmapText(canvas.width/2, canvas.height/2-150, 'bloggerSans', "You win!", 80);  
    winMenuHeader.setOrigin(0.5, 0.5);  
      
    this.uiElements[GAME_STATE.WIN] = [
      winGameOverlay,
      winrestartButton,
      continueButton,
      winMenuHeader        
    ];   
    //Alexandr - 03/02/2021  
      
    //Alexandr + 07/02/2021 - settings game menu
    let settingsOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );

    let settText = scene.add.bitmapText(canvas.width/2, canvas.height/2-100, 'bloggerSansBold', "Settings!", 100);
    settText.setOrigin(0.5, 0.5);  
    let volumeLevelLabel = scene.add.bitmapText(canvas.width/2, canvas.height/2, 'bloggerSansBold', "Volume level", 40);
    volumeLevelLabel.setOrigin(0.5, 0.5);    
    let decrButton = new Button(scene, canvas.width/2-150, canvas.height/2+100, 170, 60, '-');
    decrButton.rectangle.on('pointerdown', function(){
        console.log(scene.sound.volume>0.1);
        if(scene.sound.volume>0.1){        
          scene.sound.setVolume(scene.sound.volume-0.1); 
          localStorage.setItem("volumeLevel", Math.round(scene.sound.volume * 100)/100);    
          volumeLevelText.setText(scene.sound.volume.toFixed(1));    
        };
    });  
    //decrButton.setOrigin(0.5, 0.5);  
    let volumeLevelText =scene.add.bitmapText(canvas.width/2-20, canvas.height/2+80, 'bloggerSans', localStorage.getItem("volumeLevel") == null ? 1 : localStorage.getItem("volumeLevel"), 40);
    let incrButton = new Button(scene, canvas.width/2+150, canvas.height/2+100, 170, 60, '+');
    incrButton.rectangle.on('pointerdown', function(){
        console.log(scene.sound.volume);
        if(scene.sound.volume<1){        
          scene.sound.setVolume(scene.sound.volume+0.1); 
          localStorage.setItem("volumeLevel", Math.round(scene.sound.volume * 100)/100);    
          volumeLevelText.setText(scene.sound.volume.toFixed(1));    
        };
    });  
    let muteButton = new Button(scene, canvas.width/2-10, canvas.height/2+175, 250, 60, 'Mute'); 
    muteButton.rectangle.on('pointerdown', function(){
        if (muteButton.label.text=="Unmute"){
           scene.sound.mute = false; 
           muteButton.label.setText("Mute");
        }else{
           scene.sound.mute = true;
           muteButton.label.setText("Unmute");     
        };       
    });   
    let settingsOkButton = new Button(scene, canvas.width/2, canvas.height/2 + 250, 170, 60, 'Ok');
    console.log(scene.isResumed);    
    settingsOkButton.rectangle.on('pointerdown', function () {
       if (scene.isResumed) {scene.setState(GAME_STATE.PAUSE)} else {scene.exit()};
    });

    this.uiElements[GAME_STATE.SETTINGS] = [
      settingsOverlay,
      settText,
      volumeLevelLabel,    
      decrButton,
      volumeLevelText,
      incrButton,  
      muteButton,    
      settingsOkButton
    ];   
    //Alexandr - 07/02/2021   
      
    //Alexandr + 07/02/2021 - level info menu
    let levelInfoOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0xd3f0f5,
      100
    );
      
    let newLevel = scene.add.bitmapText(canvas.width/2, canvas.height/2 - 100, 'bloggerSansBold', "Lets start!", 100);
    newLevel.setOrigin(0.5, 0.5); 
    
    let currLevel = scene.add.bitmapText(canvas.width/2, canvas.height/2, 'bloggerSansBold', "Your level is: " + (localStorage.getItem("levelselect") == null ? 1 : localStorage.getItem("levelselect")).toString(), 40);
    currLevel.setOrigin(0.5, 0.5);   
      
    let levelInfoOkButton = new Button(scene, canvas.width/2, canvas.height/2+100, 170, 60, 'Ok');
    levelInfoOkButton.rectangle.on('pointerdown', () => scene.restart());

    this.uiElements[GAME_STATE.GAMEINFO] = [
      levelInfoOverlay,
      newLevel,
      currLevel,    
      levelInfoOkButton
    ];   
    //Alexandr - 07/02/2021   
                
    // Start with all UI hidden
    Object.values(this.uiElements).forEach((elements) => {
      elements.forEach((element) => {
        element.setVisible(false);
      });
    });
  }

  changeState(oldState, newState) {
    // hide previous state UI
    if (this.uiElements[oldState]) {
      this.uiElements[oldState].forEach((element) => {
        element.setVisible(false);
      });
    }

    // show new state UI
    this.uiElements[newState].forEach((element) => {
      element.setVisible(true);
    });
  }
}