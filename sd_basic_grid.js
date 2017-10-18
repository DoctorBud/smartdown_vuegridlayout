/*
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
*/

function updateSdSelection(sdContent) {
  var newSdContent = [];
  // !This is bad, how is a method within a view to know about DOM elements?!
  var selectedFiles = document.getElementById('sdSelection').files;
  console.log(selectedFiles);
  
  for (var file of selectedFiles) {
    var reader = new FileReader();
    reader.readAsText(file);
    console.log(reader);
    reader.onload = function() { 
      var SDtext = reader.result;
      console.log(SDtext);
      newSdContent.push(SDtext);
      console.log(sdContent);
    };
  }
  sdContent = newSdContent;
}

var sdContent = ['1','2','3']; // This is a place holder
//var sdContent = [SDtext1, SDtext2, SDtext3];
var numOfSDContent = sdContent.length;


Vue.config.debug = true;
Vue.config.devtools = true;
/* global VueGridLayout */
var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

var gridView = null;
const defaultRowHeight = 100;
const numColumns = 12;
const vueAppDivId = 'layoutApp';


function buildColumnLayout(numOfSDContent, numCols) {
  var width = numCols / numOfSDContent;
  var height = 1;
  var layout = Array(numOfSDContent);
  let x = 0;

  for (var index = 0; index < numOfSDContent; index++) {
    //let w = width * 2 * (index + 1);
    layout[index] = {
      "x": x,
      "y": 0,
      "w": width,
      "h": height,
      "i": index.toString(),
      "divID": "smartdown-output" + index
    };

    x += width;
  }

  return layout;
}


function buildRowLayout(numOfSDContent, numCols) {
  //console.log("Switching to row layout");
  var width = numCols;
  var height = 1;
  var layout = Array(numOfSDContent);
  let y = 0;
  for (var index = 0; index < numOfSDContent; index++) {
    let h = height + index;
    layout[index] = {
      "x": 0,
      "y": y,
      "w": width,
      "h": h,
      "i": index.toString(),
      "divID": "smartdown-output" + index
    };
    y += h;
  }

  return layout;
}

function optimizeSDGridCellHeight(layout) {
  layout.forEach(function(layoutElement, layoutElementIndex) {
    var divID = layoutElement.divID;
    var SDGridCellDiv = document.getElementById(divID);
    var SDInnerContainer = SDGridCellDiv.children[0];
    if (!SDInnerContainer) {
      console.log('Error when adjusting Smartdown container grid height: need to populate SD content first!');
    }
    else {
      var divHeight = SDGridCellDiv.clientHeight;
      var SDHeight = SDInnerContainer.clientHeight;
      var newHeight = Math.ceil(SDHeight / divHeight);
      layoutElement.h = newHeight;
      if (layoutElement.y !== 0) {
        layoutElement.y = layout[layoutElementIndex-1].y + layout[layoutElementIndex-1].h;
      }
    }
  });
}

function applySmartdown(layout, contentItems) {
  console.log('applySmartdown', layout);

  if (contentItems.length !== layout.length) {
    console.log('applySmartdown ERROR ... numOfSDContent !== layout.length', numOfSDContent, layout.length);
  }
  else {
    layout.forEach(function(layoutElement, layoutElementIndex) {
      var divID = layoutElement.divID;
      var div = document.getElementById(divID);
      if (!div) {
        console.log('applySmartdown ERROR ... div not found:', divID);
      }
      else {
        var content = contentItems[layoutElementIndex];
        // div.innerHTML = content;
        smartdown.setSmartdown(content, div);
      }
    });
  }
}

/*
function() {
          var firstChildDiv = div.children[0];
          //var contentPrefix = content.slice(0, 30);
          //console.log('## Adjust this cell height', layoutElement, divID, contentPrefix, div, firstChildDiv, div.clientHeight, firstChildDiv.clientHeight);
          //console.log('  #### current height: ', div.clientHeight, ' ... desired height: ', firstChildDiv.clientHeight);
          var divHeight = div.clientHeight;
          var SDHeight = firstChildDiv.clientHeight;
          var numRows = Math.ceil(SDHeight / divHeight);
          layoutElement.h = numRows;
}
*/


function buildView(divId, numOfSDContent, layout, sdContent, numCols, gridRowHeight, draggable, resizable) {
  /*global Vue*/
  var view = new Vue({
      el: '#'+divId,
      created: function () {
        // `this` points to the vm instance
        console.log('created... data', this);

        // stretchItems(this, this.layout);
      },
      components: {
          "GridLayout": GridLayout,
          "GridItem": GridItem
      },
      data: {
          layout: layout,
	  numOfSDContent: numOfSDContent,
          rowHeight: gridRowHeight,
          numCols: numCols,
	  fileList: [],
	  sdContent: sdContent,
          draggable: draggable,
          resizable: resizable
      },
      methods: {
        switchToColumnLayout: function() {
          this.layout = buildColumnLayout(this.numOfSDContent, this.numCols);
        },

        switchToRowLayout: function() {
          this.layout = buildRowLayout(this.numOfSDContent, this.numCols);
        },

        applySmartdown: function() {
          applySmartdown(this.layout, this.sdContent);
        },
        optimizeSDGridCellHeight: function() {
          optimizeSDGridCellHeight(this.layout);
        },
	updateSdSelection: function() {
	  updateSdSelection(this.sdContent);
	},
      }
  });

  return view;
}


/* eslint-disable */
/* global smartdown */
var baseURL = 'https://smartdown.site/'; //'https://127.0.0.1:4000/';
var svgIcons = {
};

function smartdownLoaded() {
    console.log('smartdownLoaded... populating DIVs');
  //   for (var index of indexes) {
  //       var SDOutputDiv = document.getElementById(rowOrientedLayout[index].sdi);
  //       smartdown.setSmartdown(sdContent[index], SDOutputDiv);
  //   }
  var layout = buildColumnLayout(sdContent.length, numColumns);
  gridView = buildView(vueAppDivId, numOfSDContent, layout, sdContent, numColumns, defaultRowHeight, true, true);

  // initMutationObserver();
}

var calcHandlers = null;
const linkRules = [
];

smartdown.initialize(svgIcons, baseURL, smartdownLoaded, null, calcHandlers, linkRules);



/* additional vue-grid-layout functions that might be useful
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


/***** Leftovers to be deleted after the essential height calculation is extracted.
  function initMutationObserver() {
      var target = document.querySelector('.vue-grid-layout');

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // console.log(mutation.type);
          if (mutation.type == "childList" &&
              mutation.target.className == "no-drag smartdown-container" &&
              mutation.addedNodes.length != 0) {
              // console.log(mutation.type, mutation.target.className, mutation.addedNodes.length);
              var SDInnerDiv = mutation.addedNodes[0]; // mutation.target.firstchild // !This firstchild kept coming back as undefined;
              var SDHeight = SDInnerDiv.clientHeight;
              var numRows = Math.ceil(SDHeight / gridRowHeight);
              // console.log(SDInnerDiv, numRows);
              var SDParentId= SDInnerDiv.parentElement.id
              var index = SDParentId.substr(SDParentId.length - 1)
              rowOrientedLayout[index].h = numRows;
          }
          else {
              console.log('Nothing added to' + mutation.target.className);
          }
         });

      });


      var config = {
              attributes: false,
              childList: true,
              subtree: true,
              characterData: false
          }

      observer.observe(target, config);
  }

  function updateSDHeight() {
      var SDContainerDivList = document.querySelectorAll('.smartdown-container');
      console.log(SDContainerDivList);
      SDContainerDivList.forEach(function(currentValue, currentIndex, listObj) {
          var SDInnerDiv = currentValue.firstchild;
          var SDHeight = SDInnerDiv.clientHeight;
          var numRows = Math.ceil(SDHeight / rowHeight); // Round this up to int
          rowOrientedLayout[i].h = numRows;
      });
  }
*/
