var config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: document.getElementById("gameCanvas").clientWidth,
    height: 800,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene:  [menuscene,gamescene],
    
  };

  
  const game = new Phaser.Game(config);

  function preload() {
  }

  function create() {
 
}
function update() {
 
}



    
  