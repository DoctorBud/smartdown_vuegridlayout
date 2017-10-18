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
