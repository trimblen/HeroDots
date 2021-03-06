const Color = Phaser.Display.Color;

export const DOT_STATE = {
  NONE: 0,
  SELECTED: 1
};

export const DOT_COLORS = [
  Color.HSLToColor(0.76, 0.49, 1.0),  // 1
  Color.HSLToColor(0.12, 0.65, 0.63),  // 2
  Color.HSLToColor(0.77, 0.37, 0.87),  // 3
  Color.HSLToColor(0.89, 0.05, 0.96),  // 4
  Color.HSLToColor(0.75, 0.41, 0.62),  // 5
  Color.HSLToColor(0.45, -0.44, 0.61),  // 6
  Color.HSLToColor(0.90, -0.10, 0.93),  // 7
  Color.HSLToColor(0.47, 0.47, 0.25)   // 8
];

const touchRadius = 70;

/**
 * Represents a Dot. Extends from Image. Can be clicked, colored, animated, etc
 */
export class Dot extends Phaser.GameObjects.Sprite {
  /**
   * Makes a new dot and initializes it. The spawn() function must be called before the dot is usable.
   * @param {Phaser.Scene} scene - The scene that this belongs to
   * @param {number} x - The x coordinate of this in world space
   * @param {number} y - The y coordinate of this in world space
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'dot');

    let touchCircle = new Phaser.Geom.Circle(64, 64, touchRadius);
    this.setInteractive(touchCircle, Phaser.Geom.Circle.Contains);
    
    this.t = 0; // used for animating movement on path
    this.dotScale = 1;
    
    //Alexandr + 18/02/2021 - setting dot as not a bonus by defaultd
    this.bonusFeature = 0;   
    //Alexandr - 18/02/2021  
  }

  update() {
    if (this.path && this.t >= 0) {
      let vec = new Phaser.Math.Vector2();
      this.path.getPoint(this.t, vec);
      this.setPosition(vec.x, vec.y);
    }
  }

  setGridPosition(row, column) {
    this.row = row;
    this.column = column;
  }

  //Alexandr + 18/02/2021 - correcting with tint    
  setColorId(colorId, colorTint) {
    this.colorId = colorId; 
    //console.log(colorTint);  
    if (colorTint===true){  
        this.setTint(DOT_COLORS[colorId]._color);
    }else{
      this.clearTint();  
    };
  };
  //Alexandr - 18/02/2021
    
  //Alexandr - 24.01.2020 - set frame id    
  setFrameId(frameId) {       
    this.setFrame(frameId);
  }
  //Alexandr - 24.01.2020      
    
  setState(state) {
    this.state = state;
  }

  spawn() {
    this.setState(DOT_STATE.NONE);
    this.setActive(true);
    this.setVisible(true);

    // Start spawn animation
    this.scene.tweens.add({
      targets: this,
      scaleX: {from: 0, to: this.dotScale},
      scaleY: {from: 0, to: this.dotScale},
      ease: 'Bounce.out',
      duration: 300,
    });
  }

  despawn() { 

    // Start disappear animation
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      ease: 'Sine.easeIn',
      duration: 100,
    })
    .setCallback('onComplete', () => {
      this.group.killAndHide(this);
    }, []);
  }

  startFall(path) {
    this.path = path;
    this.scene.tweens.add({
      targets: this,
      t: {from: 0, to: 1},
      ease: 'Bounce.out',
      duration: 700
    })
    .setCallback('onComplete', () => {
      this.t = -1;
    }, []);
  }
}