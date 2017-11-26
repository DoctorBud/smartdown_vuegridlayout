### Welcome Tableau, Card 1

Smartdown Tableaux provides an additional way to present Smartdown content by allowing Smartdown documents (aka Cards) to be organized into a two-dimensional layout.

---

Vector Field Example Based upon https://github.com/winkerVSbecks/material-vector-field

```p5js/playable

var locs = [];
function calcVec(x, y) {
  return new P5.Vector(y - x, - x - y);
}

p5.setup = function() {
  p5.createCanvas(300, 300);

  var res = 20;
  var countX = p5.ceil(p5.width/res) + 1;
  var countY = p5.ceil(p5.height/res) + 1;

  for (var j = 0; j < countY; j++) {
    for (var i = 0; i < countX; i++) {
      locs.push( new P5.Vector(res*i, res*j) );
    }
  };

  p5.noFill();
  p5.stroke(249, 78, 128);

};
p5.draw = function() {
  p5.background(30, 67, 137);
  for (var i = locs.length - 1; i >= 0; i--) {
    var h = calcVec( locs[i].x - p5.mouseX, locs[i].y - p5.mouseY);
    p5.push();
      p5.translate(locs[i].x, locs[i].y);
      p5.rotate(h.heading());
      p5.line(0, 0, 0, - 15);
    p5.pop();
  };
};
```
