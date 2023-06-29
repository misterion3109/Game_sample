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
     // Game.ship.gameObjects[0].moveTo(Game.targetPointer, 500);
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
    
    Game.instantiateRandomAsteroid = function() {
       //création d'un axe X aléatoire pour chaque instances
      var minX = 180;
      var maxX = 1800;
      var randomX = Math.random() * (maxX - minX) + minX;
      //création de l'objets avec une coordonée X aléatoire
      var asteroid = new DE.GameObject({
        x: randomX,
        y: 250,
        scale: 0.3,
        automatisms: [
          ['translateY', 'translateY', { value1: 2 }]
        ],
        renderers: [
        new DE.SpriteRenderer({ spriteName: "asteroid" })
      ]
    });
    
    Game.scene.add(asteroid);
    
    // Détruire l'astéroïde après quelques secondes réglables
    setTimeout(function() {
      Game.scene.remove(asteroid);
    }, 6500);
  };
  
  // Appeler la fonction pour la première fois
  Game.instantiateRandomAsteroid();
  
  // Appeler la fonction toutes les 2 secondes à partir de la deuxième fois
  setInterval(function() {
    Game.instantiateRandomAsteroid();
  }, 2000);
  
  
  Game.ship = new DE.GameObject({
    x: 950,
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
  
  function collisionBulletAsteroid(bullet, asteroid) {
    const bulletX = Game.scene(bullet.x); // Position x de la balle
    const bulletY = Game.scene(bullet.y); // Position y de la balle
    const bulletRadius = Game.scene(bullet.renderers[0].radius); // Rayon de la balle
    
    const asteroidX = Game.scene(asteroid.x); // Position x de l'astéroïde
    const asteroidY = Game.scene(asteroid.x); // Position y de l'astéroïde
    const asteroidRadius = Game.scene(asteroid.render[0].radius); // Rayon de l'astéroïde
    
    const distance = Math.sqrt(
      (bulletX - asteroidX) ** 2 + (bulletY - asteroidY) ** 2
      ); // Calcul de la distance entre la balle et l'astéroïde
      
      if (distance <= bulletRadius + asteroidRadius) {
        // Collision détectée
        Game.scene.remove(Game.scene(asteroid));
        collisionBulletAsteroid(bullet, asteroid);
      }
    }
    
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
       
      };
      
      Game.scene.add(
        Game.ship,
        
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
