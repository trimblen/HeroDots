import { Dot } from './Dot';

/**
 * DotGrid is a class that represents a hexagonal grid of dots.
 */
export class DotGrid {
  /**
   * Creates a new DotGrid, initializes its grid, and layout using input values.
   * @param {Phaser.Scene} scene - The scene that this belongs to
   * @param {number} numRows - The number of rows in the grid
   * @param {number} numColumns - The number of columns in the grid
   * @param {number} numColors - The number of colors to randomize dots with
   * @param {number} centerX - The center x position of the grid in world position
   * @param {number} centerY - The center y position of the grid in world position
   * @param {number} maxWidth - The maximum width that the grid can expand to
   * @param {number} maxHeight - The maximum height that the grid can expand to
   */
  constructor(scene, numRows, numColumns, numColors, centerX, centerY, maxWidth, maxHeight) {
    this.scene = scene;
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.numColors = numColors;
    
    // Set ratio to lay out cells in even hexagonal spacing.
    let widthToHeightRatio = (this.numColumns + 0.5) / (this.numRows * Math.cos(Math.PI/6));

    // We want to fit the grid inside maxWidth and maxHeight, but we need to first check
    // whether to scale by width or by height.
    if (widthToHeightRatio > maxWidth / maxHeight)  {
      // This means the grid is wider than than max dimensions, so scale by width.
      this.width  = maxWidth;
      this.height = maxWidth / widthToHeightRatio;
    }
    else {
      // This means the grid is taller than max dimensions, so scale by height.
      this.width  = maxHeight * widthToHeightRatio;
      this.height = maxHeight;
    }

    this.cellDistanceX = this.width / (this.numColumns + 0.5);
    this.cellDistanceY = this.height / this.numRows;
    this.dotScale = 0.8 * this.cellDistanceX / 128;


    // Initialize grid cells
    this.grid = new Array(this.numRows);

    for (let r = 0; r < this.numRows; r++) {
      this.grid[r] = new Array(this.numColumns);

      for (let c = 0; c < this.numColumns; c++) {

        // Find the world position for this cell in the hexagonal grid layout
        let cellX = centerX - this.width/2 + this.cellDistanceX * (c + 0.5);
        let cellY = centerY - this.height/2 + this.cellDistanceY * (r + 0.5);

        if (r % 2 === 1)
          cellX += this.cellDistanceX/2; // offset odd rows

        this.grid[r][c] = {
          x: cellX,
          y: cellY,
          dot: null
        };
      }
    }

    // Initialize dot group (for object pooling)
    this.dotGroup = scene.add.group({
      defaultKey: 'dot',
      maxSize: numRows * numColumns * 2,
      classType: Dot,
      createCallback: (dot) => {
        dot.setName('dot' + this.dotGroup.getLength());
        dot.group = this.dotGroup;
        dot.dotScale = this.dotScale;
      
        dot.on('pointerdown', () => {
          scene.dotClicked(dot);
        });
  
        dot.on('pointerover', () => {
          scene.dotHovered(dot);
        });
      }
    });
  }

  // Add a new randomized dot to every cell in the grid, removing old dots.
  fillWithRandomDots() {
    // reset colorBuckets
    //Alexandr + 16/03/2021 - recreating scene anims
//    this.scene.anims.destroy(this.scene.cfgbonus1);   
//    this.scene.anims.destroy(this.scene.cfgbonus2);   
//    this.scene.anims.destroy(this.scene.cfgbonus3);  
//      
//    this.scene.anims.create(this.scene.cfgbonus1);   
//    this.scene.anims.create(this.scene.cfgbonus2);   
//    this.scene.anims.create(this.scene.cfgbonus3);     
    //Alexandr - 16/03/2021  
    this.colorBuckets = new Array(this.numColors);
    for (let i = 0; i < this.colorBuckets.length; i++) {
      this.colorBuckets[i] = [];
    }
    // remove old dots and replace with a new dot with random color
    this.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.dot !== null) {
           
          //Alexanndr + 16/03/2021 - removing old animations      
          if(cell.dot.bonusFeature>0){
             cell.dot.bonusFeature = 0;   
             //console.log("bonus " + cell.dot.bonusFeature); 
             cell.dot.anims.stop();  
             cell.dot.anims.remove(this.scene.anims.get('explode'+cell.dot.bonusFeature)); 
             cell.dot.setTexture("dot");
            // console.log(cell.dot);  
          };   
          //Alexanndr - 16/03/2021 
            
          this.dotGroup.killAndHide(cell.dot);
          cell.dot = null;
        }
        let dot = this.addNewDot(cell.x, cell.y);
        dot.setGridPosition(r, c);
        this.grid[r][c].dot = dot;
      });
    });
  }

  // Adds a new dot at world position (x, y). Returns the new dot, or null if no dot was available.
  //Alexandr + 16/02/2021    
  addNewDot(x, y, bonusDot = 0) {
    let dot = this.dotGroup.get(x, y);
    if (!dot) {
      console.error("No dots available!");
      return null;
    }

    // Add to matching color bucket
    //Alexandr - 24.01.2020 - set frame id  
    //console.log(bonusDot); 
    if(bonusDot===0){        
//        if (dot.texture.key !="dot"){
//            console.log(dot); 
//            dot.anims.remove(this.scene.anims.get('explode'+dot.bonusFeature)); 
//            dot.setTexture("dot");    
//        };      
//        
        dot.setFrameId(Math.floor(Math.random() * this.numColors));           
        //dot.setColorId(Math.floor(Math.random() * this.numColors)); 
        dot.setColorId(dot.frame.name, true);
        //dot.anims.destroy();
    }else{     
       //console.log('there!');
       dot.setTexture("dotbonus"+bonusDot);   
       dot.setColorId(dot.frame.name, false);        
       //let anima = this.scene.anims.get('explode'+bonusDot);       
       dot.anims.play(this.scene.anims.get('explode'+bonusDot));    
    };    
     
    dot.bonusFeature = bonusDot;  
    //Alexandr - 24.01.2020 
      
    dot.indexInColorBucket = this.colorBuckets[dot.colorId].push(dot) - 1;
    dot.spawn();
    return dot;
  }
  //Alexandr - 16/02/2021
    
  // Removes an array of dots from the grid and moves remaining dots downwards to fill the gaps.
  // Also properly updates dotBuckets. Optimized for removing multiple dots at a time.
  //Alexandr + 16/02/2021 - getting a number of closed points    
  removeDots(dots , numberOfClosed, dotsScore) {
    if (dots.length === 0) return;

    let colorId = dots[0].colorId;

    let columnLowestRowChanged = {};

    // Remove dots and leave nulls where they were referenced
    dots.forEach((dot) => {
      if (dot!=null) {        
          if (columnLowestRowChanged[dot.column] === undefined || columnLowestRowChanged[dot.column] < dot.row) {
            columnLowestRowChanged[dot.column] = dot.row;
          };
          
          this.colorBuckets[dot.colorId][dot.indexInColorBucket] = null;
          this.grid[dot.row][dot.column].dot = null;
          
           //Alexandr + 28/03/2021
          var result = dotsScore.find(obj => {
              return obj.name === dot.name
           });
          
          if (result!=undefined) {              
            //console.log(dot.bonusFeature);  
            let pluspoints = 0;  
              
            if (dot.bonusFeature==0){  
                pluspoints+=1;
                this.scene.points   +=pluspoints;                 
            }else {
                pluspoints+=1;                
                pluspoints          += dot.bonusFeature;
                this.scene.points   += pluspoints;     
            };
              
            this.scene.createScoreAnimation(dot.x, dot.y, "+"+pluspoints);              
          };
          //Alexandr - 28/03/2021 
          //console.log(result);           
          
          //Alexander + 21/02/2021 - destroying animations    
          if(dot.bonusFeature>0){
             //console.log("bonus " + dot.bonusFeature); 
             dot.anims.stop();  
             dot.anims.remove(this.scene.anims.get('explode'+dot.bonusFeature)); 
             //console.log(dot.currentAnim);    
             this.scene.anims.create(this.scene.cfgbonus1);
             this.scene.anims.create(this.scene.cfgbonus2);
             this.scene.anims.create(this.scene.cfgbonus3);
             dot.bonusFeature = 0; 
             dot.setTexture("dot");
             //console.log(dot);
             this.scene.dotFruitDissapear.play();              
          }else{
              this.scene.dotFruitBonusDissapear.play(); 
          };
          //Alexander - 21/02/2021 
         
          dot.despawn();
      };
    });


    // Move dots downwards.
    Object.keys(columnLowestRowChanged).forEach((column) => {
      let lowestRowChanged = columnLowestRowChanged[column];
      column = Number(column);
      let remainingDots = [];

      for (let row = 0; row <= lowestRowChanged; row++) {
        let dot = this.grid[row][column].dot;
        if (dot) {
          remainingDots.push(dot);
        }
      }

      for (let row = lowestRowChanged; row >= 0; row--) {
        let cell = this.grid[row][column];
        if (remainingDots.length > 0) {
          let dot = remainingDots.pop();
          this.moveDotToRow(dot, dot.row, row);
          dot.setGridPosition(row, column);
          cell.dot = dot;
        }
        else {
          cell.dot = null;
        }
      }
    });

    // Remove nulls from color buckets
    let colorBucket = this.colorBuckets[colorId];
    let numDots     = 0;

    for (let i = 0; i < colorBucket.length; i++) {
      if (colorBucket[i] !== null) {
        colorBucket[numDots] = colorBucket[i];
        colorBucket[numDots].indexInColorBucket = numDots;
        numDots++;
      }
    }

    // Remove the nulls from the end
    this.colorBuckets[colorId] = colorBucket.slice(0, numDots);
    
    //Alexandr + 16/02/2021 - getting a bonus dot
    let bonus = 0;       
      
    if (numberOfClosed % 5 === 0) {
       bonus = 1; 
    }else if (numberOfClosed % 6 === 0) {
       bonus = 2; 
    }else if (numberOfClosed % 8 === 0) {
       bonus = 3; 
    }     
    //Alexandr - 16/02/2021  
      
    //console.log(bonus);  
      
    // REPLACE REMOVED CELLS ======================================================================

    this.grid.forEach((row, r) => {
      let delay = 300 + (r / this.numRows) * 700;
      this.scene.time.delayedCall(delay, () => {
        row.forEach((cell, c) => {
          if (cell.dot === null) {          
            //Alexandr + 16/02/2021          
            cell.dot = this.addNewDot(cell.x, cell.y, bonus); //Alexandr + 16/02/2021
            cell.dot.setGridPosition(r, c);                 
            if (bonus > 0){  
              this.scene.createScoreAnimation(cell.dot.x, cell.dot.y, "Bonus Dot level " +bonus +"!");
              this.scene.BonusPickup.play();    
              bonus = 0;
            };              
            //Alexandr - 16/02/2021   
          }
        });
      }, []);
    });
  }
  //Alexandr - 16/02/2021
    
  //Alexandr + 16/02/2021 - getting a number of closed points    
  removeAllDotsWithColorId(colorId, numberOfClosed, dotsScore) {
    let colorBucket = this.colorBuckets[colorId];
    let numRemoved = colorBucket.length;
    this.removeDots(colorBucket, numberOfClosed, dotsScore);
    return numRemoved;
  }
  //Alexandr - 16/02/2021  

  // Returns true if these dots are next to each other on the hex grid
  checkAdjacent(dot1, dot2) {
    let rowDiff = Math.abs(dot1.row - dot2.row);
    let columnDiff = Math.abs(dot1.column - dot2.column);

    if (rowDiff + columnDiff === 1)
      return true;

    if (dot1.row % 2 === 0) {
      if (dot2.column === dot1.column - 1 && rowDiff === 1)
        return true;
    }
    else {
      if (dot2.column === dot1.column + 1 && rowDiff === 1)
        return true;
    }

    return false;
  }

  // Uses a curve and tween to animate the dot moving down to a new row.
  moveDotToRow(dot, originalRow, targetRow) {
    let points = [];
    let c = dot.column;
    for (let r = originalRow; r <= targetRow; r++) {
      points.push(this.grid[r][c].x);
      points.push(this.grid[r][c].y);
    }

    let path = new Phaser.Curves.Path(this.grid[originalRow][c].x, this.grid[originalRow][c].y);
    path.splineTo(points);
    dot.startFall(path);
  }

  // Draw curves on the scene to separate columns.
  drawColumnLines() {
    let baseX = this.grid[0][0].x;
    let baseY = this.grid[0][0].y;
    
    // This gets the points for one curve.
    let points = [];
    for (let r = 0; r < this.numRows; r++) {
      points.push(this.grid[r][0].x - this.cellDistanceX/2 - baseX);
      points.push(this.grid[r][0].y - baseY);
    }

    // Draw that curve once for each column.
    let curve = new Phaser.Curves.Spline(points);
    for (let c = 0; c < this.numColumns+1; c++) {
      let graphics = this.scene.add.graphics({
        x: baseX + c * this.cellDistanceX,
        y: baseY
      });
      graphics.setDepth(5);
      graphics.lineStyle(4, 0xA1BFDD,0.4);
      curve.draw(graphics, (this.numRows-1) * 8);
    }
  }
}