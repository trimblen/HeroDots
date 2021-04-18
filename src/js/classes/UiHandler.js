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
      0x64AAD0,
      100
    );
      
    startOverlay.on('pointerdown', () => {scene.setState(GAME_STATE.GAMEINFO)}); //Alexandr + 10/02/2021 - showing gameinfo 
    startOverlay.setInteractive();

    let titleText = scene.add.text(canvas.width/2, canvas.height/2 - 150, 'HeroDots', {fontFamily: "bloggerSansBold", fontSize: 115});
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
    this.timerDisplay = scene.add.text(48, 32, Math.floor(GAME_CONSTANTS.ROUND_TIME/1000), {fontFamily: "Tenor Sans", fontSize: 45});
    this.timerDisplay.setOrigin(0.5, 0.5);

    this.pointsDisplay = scene.add.text(48, 96, "", {fontFamily: "bloggerSansBold", fontSize: 40});
    //console.log(this.pointsDisplay);  
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
      0x64AAD0,
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
      0x64AAD0,
      100
    );

    let timesUp = scene.add.text(canvas.width/2, canvas.height/2-100, "Time's Up!", {fontFamily: "bloggerSansBold", fontSize: 100});
    timesUp.setOrigin(0.5, 0.5);

    this.yourScore = scene.add.text(canvas.width/2, canvas.height/2, "Your Score:", {fontFamily: "bloggerSansBold", fontSize: 80});
    this.yourScore.setOrigin(0.5, 0.5);

    let restartButton = new Button(scene, canvas.width/2, canvas.height/2+150, 170, 60, 'Restart');
    restartButton.rectangle.on('pointerdown', function() {        
        scene.GameOver.stop();
        scene.setState(GAME_STATE.GAMEINFO);
    });//Alexandr + 10/02/2021

    let exitButton = new Button(scene, canvas.width/2, canvas.height/2+250, 170, 60, 'Exit');
    exitButton.rectangle.on('pointerdown', function() { 
        scene.GameOver.stop();
        scene.exit();
    });

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
      0x64AAD0,
      100
    );

    let aboutTextMain = scene.add.text(canvas.width/2, canvas.height/2-100, "About", {fontFamily: "bloggerSansBold", fontSize: 80});
    aboutTextMain.setOrigin(0.5, 0.5);  
    let aboutExitButton = new Button(scene, canvas.width/2, canvas.height/2+200, 170, 60, 'Exit');
    aboutExitButton.rectangle.on('pointerdown', () => scene.exit());
      
    let aboutContent = scene.add.text(canvas.width/2, canvas.height/2+50, "Play with fruit dots, check equal fruits to gain max points!\nAdditional thanks to zvukipro.ru and hexdots16.\nGet more than 5 dots per selection to get universal dots bonuses!", {fontFamily: "bloggerSansBold", fontSize: 35});
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
      0x64AAD0,
      100
    );

    let pauseMenuHeader = scene.add.text(canvas.width/2, canvas.height/2-150, "Pause Menu", {fontFamily: "bloggerSansBold", fontSize: 80});  
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
      0x64AAD0,
      100
    );

    let winrestartButton = new Button(scene, canvas.width/2, canvas.height/2+100, 170, 60, 'Exit');
    winrestartButton.rectangle.on('pointerdown', function() {
        scene.GameWin.stop();
        scene.exit();
    });

    let continueButton = new Button(scene, canvas.width/2, canvas.height/2, 170, 60, 'Continue');
    continueButton.rectangle.on('pointerdown', function() {
        scene.GameWin.stop();
        scene.setState(GAME_STATE.GAMEINFO);
    }); //Alexandr + 10/02/2021

    let winMenuHeader = scene.add.text(canvas.width/2, canvas.height/2-250, "You won!", {fontFamily: "bloggerSansBold", fontSize: 80});  
    winMenuHeader.setOrigin(0.5, 0.5);  
      
    this.yourScoreWin  = scene.add.text(canvas.width/2, canvas.height/2-100, "", {fontFamily: "bloggerSansBold", fontSize: 35});   
    this.yourScoreWin.setOrigin(0.5, 0.5); 
      
    this.uiElements[GAME_STATE.WIN] = [
      winGameOverlay,
      winrestartButton,
      continueButton,
      winMenuHeader,
      this.yourScoreWin    
    ];   
    //Alexandr - 03/02/2021  
      
    //Alexandr + 07/02/2021 - settings game menu
    let settingsOverlay = scene.add.rectangle(
      canvas.width/2,
      canvas.height/2,
      canvas.width,
      canvas.height,
      0x64AAD0,
      100
    );

    let settText = scene.add.text(canvas.width/2, canvas.height/2-100, "Settings", {fontFamily: "bloggerSansBold", fontSize: 100});
    settText.setOrigin(0.5, 0.5);  
    let volumeLevelLabel = scene.add.text(canvas.width/2, canvas.height/2,  "Volume level", {fontFamily: "bloggerSansBold", fontSize: 40});
    volumeLevelLabel.setOrigin(0.5, 0.5);    
    
    let decrButton = new Button(scene, canvas.width/2-100, canvas.height/2+100, 170, 60, '-');
      
    decrButton.rectangle.on('pointerdown', function(){
        if(scene.sound.volume>=0.1){        
          scene.sound.setVolume(scene.sound.volume-=0.1); 
          localStorage.setItem("volumeLevel", (Math.round(scene.sound.volume * 100)/100).toFixed(1)); 
          if (scene.isResumed){
            scene.SoundTest.play();  
          };    
        };
    }, this);  
      
    let incrButton = new Button(scene, canvas.width/2+100, canvas.height/2+100, 170, 60, '+');
      
    incrButton.rectangle.on('pointerdown', function(){
        if(scene.sound.volume<1){        
          scene.sound.setVolume(scene.sound.volume+=0.1);      
          localStorage.setItem("volumeLevel", (Math.round(scene.sound.volume * 100)/100).toFixed(1)); 
          if (scene.isResumed){
            scene.SoundTest.play();  
          };        
        };
    },this);  
      
    let muteButton = new Button(scene, canvas.width/2-10, canvas.height/2+175, 250, 60, 'Mute'); 
    muteButton.rectangle.on('pointerdown', function(){
        if (muteButton.label.text=="Unmute"){
           scene.sound.mute = false; 
           muteButton.label.setText("Mute");
           if (scene.isResumed){
            scene.SoundTest.play();  
           };      
        }else{
           scene.sound.mute = true;
           muteButton.label.setText("Unmute");     
        };       
    });   
    let settingsOkButton = new Button(scene, canvas.width/2, canvas.height/2 + 250, 170, 60, 'Ok');
 
    settingsOkButton.rectangle.on('pointerdown', function () {
       if (scene.isResumed) {scene.setState(GAME_STATE.PAUSE)} else {scene.exit()};
    });

    this.uiElements[GAME_STATE.SETTINGS] = [
      settingsOverlay,
      settText,
      volumeLevelLabel,    
      decrButton,
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
      0x64AAD0,
      100
    );
      
    let newLevel = scene.add.text(canvas.width/2, canvas.height/2 - 100, "Lets Start!", {fontFamily: "bloggerSansBold", fontSize: 100});
    newLevel.setOrigin(0.5, 0.5); 
      
    let  curLevelFromSt = parseInt(localStorage.getItem("levelselect") == null ? 1 : localStorage.getItem("levelselect")); 
    this.currLevel      = scene.add.text(canvas.width/2, canvas.height/2, "Your level is: " + (curLevelFromSt).toString()+"\nYou need to gain " + (curLevelFromSt*10).toString()+" points to get in the " + (curLevelFromSt+1).toString() + " level!", {fontFamily: "bloggerSansBold", fontSize: 30});
    this.currLevel.setOrigin(0.5, 0.5);   
    
    let levelInfoOkButton = new Button(scene, canvas.width/2, canvas.height/2+100, 170, 60, 'Ok');
    levelInfoOkButton.rectangle.on('pointerdown', () => scene.restart());

    this.uiElements[GAME_STATE.GAMEINFO] = [
      levelInfoOverlay,
      newLevel,
      this.currLevel,    
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