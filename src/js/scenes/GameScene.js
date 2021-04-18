import { constants } from "../constants";
import { UiHandler } from '../classes/UiHandler';
import { DotGrid } from '../classes/DotGrid';
import { DOT_STATE, DOT_COLORS } from '../classes/Dot';
import { DotEffect } from "../classes/DotEffect";

export const GAME_STATE = {
  START: 0,
  RUNNING: 1,
  OVER: 2,
  PAUSE:3,
  WIN:4,
  LEVELINFO:5,
  SETTINGS:6,
  ABOUT: 7    
}

export const GAME_CONSTANTS = {
  NUM_ROWS:  6,
  NUM_COLUMNS: 8,
  NUM_COLORS: 7,
  MIN_LOOP_COUNT: 3,
  ROUND_TIME: 60
}

/**
 * GameScene is the scene for the main game. Operates using 3 states: Start, Running, and Over
 */
export class GameScene extends Phaser.Scene {
  
  constructor() {  
    super({
      key: constants.SCENES.GAME
    });
  }

  // PHASER SCENE METHODS =========================================================================

  preload() {
    this.canvas = this.sys.game.canvas;
    this.pointer = this.input.activePointer;
    this.input.on('pointerup', () => this.pointerUp());
    this.points = 0;
    this.music              = undefined; 
    this.dotClick           = undefined;
    this.dotBonusClick      = undefined;
    this.GameOver           = undefined;
    this.GameWin            = undefined;
    this.BonusPickup        = undefined; 
    this.SoundTest          = undefined;   
    // Initialize dot grid
    this.dotGrid = new DotGrid(
      this, 
      GAME_CONSTANTS.NUM_ROWS, 
      GAME_CONSTANTS.NUM_COLUMNS, 
      GAME_CONSTANTS.NUM_COLORS, 
      this.canvas.width/2, 
      this.canvas.height/2, 
      this.canvas.width, 
      this.canvas.height
    );

    // Initialize selection to keep track of currently selected dots
    this.selection = {
      selected: [],
      selectedScore: [],    
      colorId: 0,
      loop: false
    };

    // Make a group for object-pooling dot effects
    this.dotEffectGroup = this.add.group({
      defaultKey: 'dotEffect',
      maxSize: GAME_CONSTANTS.NUM_ROWS * GAME_CONSTANTS.NUM_COLUMNS,
      classType: DotEffect,
      createCallback: (dotEffect) => {
        dotEffect.setName('dotEffect' + this.dotEffectGroup.getLength());
        dotEffect.group = this.dotEffectGroup;
      }
    });
  }

  create() {
      
    // Add Background     
    var volumeLevel = localStorage.getItem("volumeLevel") == null ? 1 : localStorage.getItem("volumeLevel");  
    
    const bg = this.add.image(0,0, "gradient-bg").setOrigin(0);
      
    Phaser.Display.Align.In.Center(bg, this.add.zone(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height));  
      
    this.music                  = this.sound.add('MenuMusic');
    this.music.loop             = true;  
    this.dotClick               = this.sound.add('DotClick');  
    this.dotBonusClick          = this.sound.add('DotBonusClick');  
    this.dotFruitDissapear      = this.sound.add('dotFruitDissapear');
    this.dotFruitBonusDissapear = this.sound.add('dotFruitBonusDissapear');   
    this.GameWin                = this.sound.add('GameWin');
    this.GameOver               = this.sound.add('GameOver');   
    this.BonusPickup            = this.sound.add('DotBonusPickup');
    this.SoundTest              = this.sound.add('SoundTest');    
    var gotBonus                = 0;  
         
    this.music.play();  
      
    //Alexandr + 01/02/2021 - game score  
    this.isResumed      = false; 
    this.currentLevel   = parseInt(localStorage.getItem("levelselect") == null ? 1 : localStorage.getItem("levelselect"));
    this.levelScore     = this.currentLevel*10;
    //Alexandr -0 01/02/2021  
      
    // Line graphics
    this.selectedLinesGraphics = this.add.graphics();
    this.selectedLinesGraphics.setDepth(-1);
    this.pointerLineGraphics = this.add.graphics();
    this.pointerLineGraphics.setDepth(-1);

    // Dot Grid
    this.dotGrid.drawColumnLines();
    this.dotGrid.fillWithRandomDots();
      
    //Bonus Sprites Animations Alexandr + 15/02/2021
    this.cfgbonus1 = {            
        key: 'explode1',
        frames: this.anims.generateFrameNumbers('dotbonus1', { start: 0, end: 24, first: 0 }),
        frameRate: 24,
        repeat: -1
    };  
      
    this.cfgbonus2 = {            
        key: 'explode2',
        frames: this.anims.generateFrameNumbers('dotbonus2', { start: 0, end: 24, first: 0 }),
        frameRate: 24,
        repeat: -1
    }; 
      
    this.cfgbonus3 = {            
        key: 'explode3',
        frames: this.anims.generateFrameNumbers('dotbonus3', { start: 0, end: 24, first: 0 }),
        frameRate: 24,
        repeat: -1
    };   
    
    this.anims.create(this.cfgbonus1);   
    this.anims.create(this.cfgbonus2);   
    this.anims.create(this.cfgbonus3); 
      
    //console.log(this.anims);  
    //Alexandr - 15/02/2021  

    // UI Handler
    this.uiHandler = new UiHandler(this, this.canvas);
    this.setState(GAME_STATE.START);    
  }

  //Alexandr + 07/02/2021
 reduceTime () {
    this.endTime--;
    if (this.endTime === 0){
        //  Stop the timer
        this.updatePointerLine(); 
        this.timedEvent.paused = true;
        this.timedEvent.remove();
        this.timedEvent.destroy();
        this.timedEvent = undefined;
    }
  };  
  //Alexandr - 07/02/2021    
    
  update() { 
    this.dotGrid.dotGroup.children.iterate(dot => dot.update());
    this.updatePointerLine();
    this.updateTimerDisplay();
  }

  // MAIN METHODS =================================================================================

  setState(state) {
    this.uiHandler.changeState(this.state, state);
    this.state = state;

    switch(state) {
      case GAME_STATE.RUNNING:
        this.music.resume();    
        //Alexandr + 02/02/2021 - pause check     
        if(!this.isResumed){           
            this.dotGrid.fillWithRandomDots();
            
            this.anims.remove(this.cfgbonus1);
            this.anims.remove(this.cfgbonus2);
            this.anims.remove(this.cfgbonus3);
            
            this.anims.create(this.cfgbonus1);
            this.anims.create(this.cfgbonus2);
            this.anims.create(this.cfgbonus3);
            
            //this.endTime = this.time.now + GAME_CONSTANTS.ROUND_TIME + 900;
            this.endTime         = GAME_CONSTANTS.ROUND_TIME;
            this.timedEvent      = this.time.addEvent({ delay: 1600 - this.currentLevel*1.6, callback: this.reduceTime, callbackScope: this, loop: true }); //Alexander + 05/04/2021 - simple speed increase algorhytm 
            this.points          = 0;
            this.uiHandler.pointsDisplay.setText(this.points); 
            this.updateColorOverlay();
            this.isResumed = false;            
        };
        this.timedEvent.paused = false;    
        //Alexandr - 02/02/2021    
        break;

      case GAME_STATE.OVER:
        this.music.pause();     
        this.GameOver.play();    
        this.uiHandler.yourScore.setText("Your Score is: " + this.points);
        this.pointerUp();
        this.selection.selected         = [];
        this.selection.selectedScore    = [];     
        this.selection.loop = false;
        this.updateSelectedLines();
        this.updatePointerLine();
        this.updateColorOverlay();
        this.isResumed = false;            
        break;
        
      //Alexandr + 01/02/2021 - game pause
      case GAME_STATE.PAUSE:
        this.music.pause();      
        this.pointerUp();
        this.selection.selected         = [];
        this.selection.selectedScore    = [];     
        this.selection.loop = false;
        this.updateSelectedLines();
        this.updatePointerLine();
        this.updateColorOverlay(); 
        this.isResumed = true;
        this.timedEvent.paused = true;             
        break;      
      //Alexandr - 01/02/2021 
            
      //Alexandr + 01/02/2021 - game win
      case GAME_STATE.WIN:           
        this.music.pause();    
        this.GameWin.play();  
            
        let  curLevelFromSt = this.currentLevel+1;            
        this.uiHandler.currLevel.setText("Your level is: " + (curLevelFromSt).toString()+"\nYou need to gain " + (curLevelFromSt*10).toString()+" points to get in the " + (curLevelFromSt+1).toString() + " level!", {fontFamily: "bloggerSansBold", fontSize: 30});
        
        this.levelScore     = curLevelFromSt*10; 
        this.currentLevel   +=1;
            
        this.uiHandler.yourScoreWin.setText("You are a winner! Your Score: " + this.points);    
        this.pointerUp();
        this.selection.selected         = [];
        this.selection.selectedScore    = [];    
        this.selection.loop = false;
        this.updateSelectedLines();
        this.updatePointerLine();
        this.updateColorOverlay(); 
        this.isResumed = false; 
        this.timedEvent.paused = true;     
        break;      
      //Alexandr - 01/02/2021          
            
    }
  }

  dotClicked(dot) {
    if (this.state !== GAME_STATE.RUNNING) return;

    let selected        = this.selection.selected;
    let selectedScore   = this.selection.selectedScore;  
    if (selected.length === 0) {
      dot.setState(DOT_STATE.SELECTED);
      selected.push(dot);
      selectedScore.push(dot);    
      this.selection.colorId = dot.colorId;    
      //Alexandr + 24/01/2020   
      this.addDotEffect(dot.x, dot.y, dot.colorId, this.selection.selected[0].frame.name, this.selection.selected[0].texture.key);
      //Alexandr - 24/01/2020      
    }
  }

  dotHovered(dot) {
    if (this.state !== GAME_STATE.RUNNING) return;
      
    //console.log(dot.bonusFeature);  

    // Only check a hovered dot if a selection has been started and the dot is adjacent to last selected dot.
    let selected        = this.selection.selected;
    let selectedScore   = this.selection.selectedScore;  
    if ( selected.length === 0 || !this.dotGrid.checkAdjacent(dot, selected[selected.length-1]) ) return;
//    
//    //Alexandr + 18/02/2021 -getting and setting color id for bonus dots
//    if (dot.bonusFeature>0){
//        dot.setColorId(selected[selected.length-1].colorId);           
//    };  
//      
//    if (selected[selected.length-1].bonusFeature>0){
//        selected[selected.length-1].setColorId(dot.colorId);           
//    };       
//    //Alexandr - 18/02/2021  
      
    // If this dot is unselected and has the same color as selection, add it to selection.
    if (
      selected.length > 0 
      && dot.state !== DOT_STATE.SELECTED 
      && dot.colorId === this.selection.colorId || dot.bonusFeature>0 || selected[selected.length-1].bonusFeature>0
      && this.dotGrid.checkAdjacent(dot, selected[selected.length-1])
      && !this.selection.loop
    ) {
      dot.setState(DOT_STATE.SELECTED);
      selected.push(dot);
      selectedScore.push(dot);    
      this.addDotEffect(dot.x, dot.y, dot.colorId, selected[selected.length-1].frame.name, selected[selected.length-1].texture.key);
    }
    // If this dot is the previously selected dot, undo the last selected dot.
    // This lets the player "undo" selections by backtracking.
    else if (selected.length > 1 && dot.name === selected[selected.length-2].name) {
      if (this.selection.loop) {
        this.selection.loop = false;
      }
      else {
        selected[selected.length-1].setState(DOT_STATE.NONE);
      }
      selected.pop();
      selectedScore.pop();
      this.selection.loop = false;
    }
    // If this dot is the same as the first selected dot and enough dots are selected
    // for a loop, add it and set loop to true.
    else if (selected.length > GAME_CONSTANTS.MIN_LOOP_COUNT - 1 && dot === selected[0]) {
      selected.push(dot);
      selectedScore.push(dot);    
      this.selection.loop = true;
      this.addDotEffect(dot.x, dot.y, dot.colorId, selected[selected.length-1].frame.name, selected[selected.length-1].texture.key);
    }

    // Update visualizations that could have changed
    this.updateColorOverlay();
    this.updateSelectedLines();
  }

  pointerUp() {
    if (this.state !== GAME_STATE.RUNNING) return;

    let selected        = this.selection.selected;
    let selectedScore   = this.selection.selectedScore;  
    if (selected.length === 0) return;

    //console.log(this.selection.selected.length);   //here is selection path alexandr

    if (selected.length === 1) {
      selected[0].setState(DOT_STATE.NONE);
    }
    else if (this.selection.loop) {
      //console.log('loop');
      selectedScore.pop();   
      let numRemoved = this.dotGrid.removeAllDotsWithColorId(this.selection.colorId, this.selection.selected.length-1, selectedScore); //Alexandr + 16/02/2021
      //this.points += numRemoved;
      this.selection.loop = false;
    }
    else {
      //console.log('no loop');    
      this.dotGrid.removeDots(selected, this.selection.selected.length, selectedScore); //Alexandr + 16/02/2021
      //this.points += selected.length;
    }
    this.uiHandler.pointsDisplay.setText(this.points);
    this.selection.selected         = [];
    this.selection.selectedScore    = [];  
    this.updateColorOverlay();
    this.updateSelectedLines();
  }
  
  restart() {       
    this.setState(GAME_STATE.RUNNING); 
  }
    
  createScoreAnimation(x, y, message){
      
    //Create a new label for the score
    var scoreAnimation  = this.add.text(x, y, message, {fontFamily: 'Tenor Sans', fontSize: '32px',  stroke: "#627388", strokeThickness: 45});   
    var scoreTween      = this.tweens.add({  
                        targets: scoreAnimation,
                        x: 48,
                        y: 96,
                        ease: 'Power1',
                        duration: 1000,
                          onStart     : ()=>{

                          },       

                          onComplete: ()=>{                         

                          scoreAnimation.destroy();                               
                        }

                        }, this);            

  };
    
    
  exit() {
//      
//      
//    this.timedEvent.paused  = true;
//    this.timedEvent         = undefined;   
    
    this.music.pause();      
    this.music = undefined;  
          
    this.scene.start(constants.SCENES.GAME);
  }

  // VISUALIZATION METHODS ========================================================================

  updateTimerDisplay() {
    if (this.state === GAME_STATE.RUNNING) {              
         this.uiHandler.timerDisplay.text = this.endTime; 
        
        //Alexander + 04/02/2021 - if win set level and finish game
        if (this.points>=this.levelScore) {          
          this.updatePointerLine();    
          this.setState(GAME_STATE.WIN); 
          localStorage.setItem("levelselect", (this.currentLevel+1));    
        };
        //Alexander - 04/02/2021           
        
       if (this.endTime === 0) {         
         this.updatePointerLine();     
         this.setState(GAME_STATE.OVER);       
       };      
   
        
//      // Update timer display
//      if (this.endTime) {
//        let timeLeft = this.endTime - this.time.now;
//        let secondsLeft;
//        if (this.time.now > this.endTime) {
//          this.setState(GAME_STATE.OVER);
//          secondsLeft = 0;
//        }
//        else {
//          secondsLeft = Math.floor(timeLeft/1000);  
//            
//          //Alexander + 04/02/2021 - if win set level and finish game
//          if (this.points>=this.levelScore) {
//            localStorage.setItem("levelselect", this.currentLevel+1);  
//            this.setState(GAME_STATE.WIN);  
//          };
//          //Alexander - 04/02/2021    
//            
//        }
//        this.uiHandler.timerDisplay.text = secondsLeft;
//      }
    }
  }

  updatePointerLine() {
    let graphics = this.pointerLineGraphics;
    graphics.clear();

    let selected = this.selection.selected;
    if ( selected.length === 0 || this.selection.loop ) return;
    if ( this.pointer.x === 0 || this.pointer.y === 0 ) return; // fix for mobile

    if (selected.length > 0 && !this.selection.loop) {
      graphics.lineStyle(5, DOT_COLORS[this.selection.colorId]._color);
      graphics.beginPath();
      graphics.moveTo(selected[selected.length-1].x, selected[selected.length-1].y);
      graphics.lineTo(this.pointer.x, this.pointer.y);
      graphics.strokePath();
    }
  }

  updateSelectedLines() {
    let selected = this.selection.selected;
    //console.log(selected);
    let graphics = this.selectedLinesGraphics;
    graphics.clear();
    if (selected.length > 1) {
      graphics.lineStyle(5, DOT_COLORS[this.selection.colorId]._color);
      graphics.beginPath();
      graphics.moveTo(selected[0].x, selected[0].y);
      for (let i = 1; i < selected.length; i++) {         
        graphics.lineTo(selected[i].x, selected[i].y);    
      }
      graphics.strokePath();
    }
  }

  // Color overlay turns on and changes to the selected color when you've made a loop.
  updateColorOverlay() {
    let colorOverlay = this.uiHandler.colorOverlay;
    if (this.selection.loop) {
      colorOverlay.fillColor = DOT_COLORS[this.selection.colorId]._color;
      colorOverlay.setVisible(true);
    }
    else {
      colorOverlay.setVisible(false);
    }
  }

  //Alexandr + 24/01/2020    
  addDotEffect(x, y, colorId, frameId, textureKey) {    
    if (textureKey == "dot"){  
        let dotEffect = this.dotEffectGroup.get(x, y);
        if (!dotEffect) {
          console.error("No DotEffect available!");
          return null;
        }
        
        this.dotClick.play();
        
        dotEffect.dotScale = this.dotGrid.dotScale;
        dotEffect.setColorId(colorId, true);
        dotEffect.setFrameId(frameId);
        dotEffect.spawn();
    }else{
        
        this.dotBonusClick.play();
        
        let emitter0    = undefined;
        let emitter1    = undefined;        
        let minParts    = Phaser.Math.Between(5,50);
        let maxParts    = Phaser.Math.Between(10,70);          
        
        emitter0 = this.add.particles('sparks1').createEmitter({
            x: x,
            y: y,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            //active: false,
            maxParticles:maxParts,
            quantity: minParts,
            lifespan: 1200,
            gravityY: 800
        });

        emitter1 = this.add.particles('sparks2').createEmitter({
            x: x,
            y: y,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            blendMode: 'ADD',
            maxParticles: maxParts,
            quantity: minParts,
            //active: false,
            lifespan: 1200,
            gravityY: 800
        });
        
    };
  //Alexandr - 24/01/2020     
  }
}