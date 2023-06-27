/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';
var Game = {};

Game.render = null;
Game.scene = null;
Game.ship = null;
Game.obj = null;



// init
Game.init = function() {
  console.log('game init');
  // DE.config.DEBUG = 1;
  // DE.config.DEBUG_LEVEL = 2;
  
  // Create the renderer before assets start loading
  Game.render = new DE.Render('render', {
    resizeMode: 'stretch-ratio',
    width: 1920,
    height: 1080,
    backgroundColor: '0x00004F',
    roundPixels: false,
    powerPreferences: 'high-performance',
  });
  Game.render.init();
  
  DE.start();
};

Game.onload = function() {
  console.log('game start');
  
  // scene
  Game.scene = new DE.Scene();

  // don't do this because DisplayObject bounds is not set to the render size but to the objects inside the scene
  // scene.interactive = true;
  // scene.click = function()
  // {
    //   console.log( "clicked", arguments );
    // }
    
    // if no Camera, we add the Scene to the render (this can change if I make Camera)
    
    Game.camera = new DE.Camera(0, 0, 1920, 1080, {
      scene: Game.scene,
      backgroundImage: 'bg',
    });
    Game.camera.interactive = true;
    Game.camera.pointermove = function(pos, e) {
      Game.targetPointer.moveTo(pos, 100);
    };
    Game.camera.pointerdown = function(pos, e) {
      Game.ship.gameObjects[0].moveTo(Game.targetPointer, 500);
      // Game.targetPointer.shake( 10, 10, 200 );
      Game.targetPointer.renderer.setBrightness([1, 0]);
    };
    Game.camera.pointerup = function(pos, e) {
      console.log('up');
      Game.targetPointer.shake(10, 10, 200);
    };
    Game.render.add(Game.camera);
    // Game.render.add( Game.scene );
    
    Game.targetPointer = new DE.GameObject({
      zindex: 500,
    renderer: new DE.SpriteRenderer({ spriteName: 'target', scale: 0.3 }),
  });
  
  Game.ship;
  
  Game.asteroid = new DE.GameObject({
    x: 850,
    y: 250,
    scale: 0.3,
    
    automatisms: [
      ['translateY', 'translateY', { value1: 2  }]
    ],
    renderers: [
      new  DE.SpriteRenderer({spriteName: "asteroid"}),
    ]
    
  });
  // Déclaration du tableau d'astéroïdes
  const asteroidArray = [];
  
  Game.asteroid.instantiateAndRemoveObject = function(bullet) {
    setTimeout(() => {
      // Instanciation de l'astéroïde
      const newAsteroid = new Game.asteroid();
      
      // Ajout de l'astéroïde au tableau
      asteroidArray.push(newAsteroid);
      
      // Vérification de la collision avec la balle
      for (let i = 0; i < asteroidArray.length; i++) {
        const currentAsteroid = asteroidArray[i];
        
        debug(asteroidArray.values);
        // Vérifier la collision entre la balle et l'astéroïde actuel
        if (checkCollision(bullet, currentAsteroid)) {
          // Supprimer l'astéroïde du tableau
          asteroidArray.splice(i, 1);
          break; // Sortir de la boucle une fois l'astéroïde supprimé
        }
      }
    }, 2000); // Délai de 2 secondes avant chaque instance d'astéroïde
    console.log('salut')
    Game.scene.add(newAsteroid);
  };
  
  function checkCollision(bullet, asteroid) {
    // Obtenez les positions de la balle et de l'astéroïde
    const bulletX = bullet.x;
    const bulletY = bullet.y;
    const asteroidX = asteroid.x;
    const asteroidY = asteroid.y;
  
    // Vérifiez si les deux objets se chevauchent
    if (
      bulletX < asteroidX + asteroid.width &&
      bulletX + bullet.width > asteroidX &&
      bulletY < asteroidY + asteroid.height &&
      bulletY + bullet.height > asteroidY
    ) {
      // Collision détectée
      return true;
    }
  
    // Pas de collision
    return false;
  }
  
  Game.ship = new DE.GameObject({
    x: 960,
    y: 940,
    scale: 1,
    renderers: [
      new DE.SpriteRenderer({ spriteName: 'ayeraShip' }),
      new DE.TextRenderer('', {
        localizationKey: 'player.data.realname',
        y: -100,
        textStyle: {
          fill: 'white',
          fontSize: 35,
          fontFamily: 'Snippet, Monaco, monospace',
          strokeThickness: 1,
          align: 'center',
        },
      }),
      new DE.SpriteRenderer({
        spriteName: 'reactor',
        y: 80,
        scale: 0.3,
        rotation: Math.PI,
      }),
    ],
    axes: { x: 0, y: 0 },
    interactive: true,
    click: function() {
      console.log('click');
    },
    checkInputs: function() {
      this.translate({ x: this.axes.x * 2, y: this.axes.y * 2 });
    },
     automatisms: [['checkInputs', 'checkInputs']],

  });

  Game.ship.fire = function() {
    DE.Save.save('fire', DE.Save.get('fire') + 1 || 1);
    DE.Audio.fx.play('piew');
    var bullet = new DE.GameObject({
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      renderer: new DE.SpriteRenderer({ spriteName: 'player-bullet' }),
    });
    bullet.addAutomatism('translateY', 'translateY', { value1: -6 });
     //bullet.moveTo( { z: 10 }, 2000 );
     //bullet.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.1 } );
     //bullet.addAutomatism( "inverseAutomatism", "inverseAutomatism", { value1: "rotate", interval: 100 } );
    bullet.addAutomatism('askToKill', 'askToKill', {
      interval: 3000,
      persistent: false,
    });

    console.log('fired in total ' + DE.Save.get('fire') + ' times');
    Game.scene.add(bullet);
  };

  Game.heart1 = new DE.GameObject({
    x: 1600,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({ spriteName: 'heart' }),
  });
  Game.heart2 = new DE.GameObject({
    x: 1700,
    y: 100,
    zindex: 10,
    renderer: new DE.TextureRenderer({
      spriteName: 'heart',
      width: 50,
      height: 20,
    }),
  });

  var rectangle = new DE.GameObject({
    x: 800,
    y: 300,
    interactive: true,
    renderers: [
      new DE.RectRenderer(40, 70, '0xFFFF00', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
      }),
      new DE.RectRenderer(40, 70, '0xF0F0F0', {
        lineStyle: [4, '0xFF3300', 1],
        fill: true,
        x: -20,
        y: -35,
        visible: false,
      }),
    ],
    pointerover: function() {
      this.renderers[1].visible = true;
      console.log('mouse over');
    },
    pointerout: function() {
      this.renderers[1].visible = false;
      console.log('mouse out');
    },
  });
  var rectangle2 = new DE.GameObject({
    x: 850,
    y: 300,
    renderer: new DE.RectRenderer(40, 70, '0xDDF0CC', {
      lineStyle: [4, '0x00F30D', 10],
      x: -20,
      y: -35,
    }),
  });

  var customShape = new DE.GameObject({
    x: 900,
    y: 300,
    renderer: new DE.GraphicRenderer(
      [
        { beginFill: '0x66CCFF' },
        { drawRect: [0, 0, 50, 50] },
        { endFill: [] },
      ],
      { x: -25, y: -25 },
    ),
  });
  Game.shapes = {
    customShape: customShape,
    rectangle: rectangle,
    rectangle2: rectangle2,
  };

  Game.scene.add(
    Game.ship,
    Game.asteroid,
    Game.heart1,
    Game.heart2,
    Game.targetPointer,
  );

  DE.Inputs.on('keyDown', 'left', function() {
    Game.ship.axes.x = -4;
  });
  DE.Inputs.on('keyDown', 'right', function() {
    Game.ship.axes.x = 4;
  });
  DE.Inputs.on('keyUp', 'right', function() {
    Game.ship.axes.x = 0;
  });
  DE.Inputs.on('keyUp', 'left', function() {
    Game.ship.axes.x = 0;
  });

  DE.Inputs.on('keyDown', 'up', function() {
    Game.ship.axes.y = -2;
  });
  DE.Inputs.on('keyDown', 'down', function() {
    Game.ship.axes.y = 2;
  });
  DE.Inputs.on('keyUp', 'down', function() {
    Game.ship.axes.y = 0;
  });
  DE.Inputs.on('keyUp', 'up', function() {
    Game.ship.axes.y = 0;
  });

  DE.Inputs.on('keyDown', 'fire', function() { 
    Game.ship.addAutomatism('fire', 'fire', { interval: 350 });
  });
  DE.Inputs.on('keyUp', 'fire', function() {
    Game.ship.removeAutomatism('fire');
  });

};

// just for helping debugging stuff, never do this ;)
window.Game = Game;

export default Game;
