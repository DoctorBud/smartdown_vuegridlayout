
var SDtext1 =
`
### Welcome to Div1

[What is your name?](:?Name)

#### A Few of My Favorite Things

- Raindrops on Roses
- Whiskers on Kittens
- Bright copper kettles
- Warm woollen mittens
- Brown paper packages tied up with strings

`;

var SDtext2 =
`
### Welcome to Div2

Pleasant to meet you, [](:!Name)

---

#### Raindrops on Roses

![](https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Raindrops_red_rose.jpg/240px-Raindrops_red_rose.jpg)

`;

var SDtext3 =
`
### Welcome to Div3


\`\`\`p5js/playable
var PI = Math.PI;
var HALF_PI = PI / 2.0;
var SEGMENTS = env.SEGMENTS || 50;  // number of segments
var SEG_WIDTH = env.SEG_WIDTH || 8;
var SEG_LENGTH = env.SEG_LENGTH || 100;
var DIAMETER = SEG_LENGTH * 2;
var speed = 0.05;
var ax = .01;
var ay = ax;
var az = ay;
var dx, dy, dz;

p5.setup = function() {
  dx = p5.random(-speed, speed);
  dy = p5.random(-speed, speed);
  dz = p5.random(-speed, speed);

  p5.createCanvas(200, 200, 'webgl');
  p5.normalMaterial();

  p5.frameRate(35);
};

p5.draw = function() {
  p5.camera(0, SEG_LENGTH, SEG_LENGTH, 0, 0, 0, 0, 1, 0);
  p5.rotateX(ax += dx);
  p5.rotateY(ay += dy);
  p5.rotateZ(az += dz);

  for (var i = 0; i < SEGMENTS; i++) {
	var frac = i * 2 / SEGMENTS;
	p5.push();
	p5.rotateX(frac * HALF_PI);
	p5.rotateY(HALF_PI);
	p5.translate(
		0,
		DIAMETER * p5.cos(frac * HALF_PI),
		DIAMETER * p5.sin(frac * PI));
	p5.cylinder(SEG_WIDTH, SEG_LENGTH);
	p5.pop();
  }
};
\`\`\`


`;

var testSD = [SDtext1, SDtext2, SDtext3];

var numOfSDContent = testSD.length;

var indexes = Array.from(Array(numOfSDContent).keys());

var width = 1;
var height = 1;
var testLayout = Array(numOfSDContent);

let x = 0;

for (var index of indexes) {
	let w = width * 2 * (index + 1);
  testLayout[index] = {
  	"x": x,
  	"y": 0,
  	"w": w,
  	"h": height,
  	"i": index.toString(),
  	"sdi":"smartdown-output" + index
  };
  x += w;
}

Vue.config.debug = true;
Vue.config.devtools = true;
/* global VueGridLayout */
var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

/*global Vue*/
new Vue({
	el: '#layoutApp',
	components: {
		  "GridLayout": GridLayout,
		   "GridItem": GridItem
	},
	data: {
		layout: testLayout,
		SDcontent: testSD,
		draggable: true,
		resizable: false
	},
});


/* eslint-disable */
/* global smartdown */
var baseURL = 'https://127.0.0.1:4000/';    // 'https://smartdown.site/';
var svgIcons = {
};

function smartdownLoaded() {
  console.log('smartdownLoaded... populating DIVs');
  for (var index of indexes) {
	var div = document.getElementById(testLayout[index].sdi);
	smartdown.setSmartdown(testSD[index], div);
  }
}

var calcHandlers = null;
const linkRules = [
];

smartdown.initialize(svgIcons, baseURL, smartdownLoaded, null, calcHandlers, linkRules);



/* //additional vue-grid-layout functions
	mounted: function () {
		this.index = this.layout.length;
	},
	methods: {
		increaseWidth: function(item) {
			var width = document.getElementById("content").offsetWidth;
			width += 20;
			document.getElementById("content").style.width = width+"px";
		},
		decreaseWidth: function(item) {

			var width = document.getElementById("content").offsetWidth;
			width -= 20;
			document.getElementById("content").style.width = width+"px";
		},
		removeItem: function(item) {
			//console.log("### REMOVE " + item.i);
			this.layout.splice(this.layout.indexOf(item), 1);
		},
		addItem: function() {
			var self = this;
			//console.log("### LENGTH: " + this.layout.length);
			var item = {"x":0,"y":0,"w":2,"h":2,"i":this.index+"", whatever: "bbb"};
			this.index++;
			this.layout.push(item);
		}
	}
*/


