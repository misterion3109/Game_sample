/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the inputs list sample that will be loaded by the project
 * Please declare in the same way than this example.
 */
const inputs = {
  "left":{"keycodes":[ "K.left" , 'K.a', 'K.q' ] },
  "right":{"keycodes":[ "K.right" , 'K.d' ] },
  
  "jump":{"keycodes":[ 'G0.B.A', "K.space" ], "stayOn": true },
  
  "fire":{"keycodes":[ "K.space" , 'G0.B.A' ]/*, "interval": 100*/ },
 
  "haxe":{"keycodes":[ "G0.A.LHorizontal" ] },
  "vaxe":{"keycodes":[ "G0.A.LVertical" ] }
};

export default inputs;
