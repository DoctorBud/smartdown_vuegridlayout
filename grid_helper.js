const authorMode = true;
const enforceMaxHeight = false;


var debugCard0 =
`
### Welcome to Debug Card 0

[What is your name?](:?Name)

#### A Few of My Favorite Things

- Raindrops on Roses
- Whiskers on Kittens
- Bright copper kettles
- Warm woollen mittens
- Brown paper packages tied up with strings

`;

var debugCard1 =
`
### Welcome to Debug Card 1

Pleasant to meet you, [](:!Name)

---

#### Raindrops on Roses

![](https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Raindrops_red_rose.jpg/240px-Raindrops_red_rose.jpg)

`;

var debugCard2 =
`
### Welcome to Debug Card 2


\`\`\`p5js/playable/autoplay
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
  p5.background('ivory');
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
var debugContent = [debugCard0, debugCard1, debugCard2];

/*
  var x = 0;

  var y = x++;

*/

function updateSdSelection(sdContent, done) {
  // !This is bad, how is a method within a view to know about DOM elements?!
  var selectedFiles = document.getElementById('sdSelection').files;
  sdContent.length = 0;
  sdContent.length = selectedFiles.length;
  var numItemsLeft = sdContent.length;
  function updateSdContent(index) {
    return function(event) {
      var sdText = event.target.result;
      sdContent[index] = sdText;
      if (--numItemsLeft === 0) {
        done();
      }
    };
  }

  for (var indexOfFile = 0; indexOfFile < selectedFiles.length; indexOfFile++) {
    var reader = new FileReader();
    reader.onloadend = updateSdContent(indexOfFile);
    reader.readAsText(selectedFiles[indexOfFile]);
  }
}

Vue.config.debug = true;
Vue.config.devtools = true;
/* global VueGridLayout */
var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

var gridView = null;
const defaultRowHeight = 100;
const numColumns = 12;
const vueAppDivId = 'layoutApp';


function buildStaggeredLayout(numOfSDContent, numCols) {
  console.log('buildStaggeredLayout', numOfSDContent, numCols);
  var width = numCols / numOfSDContent;
  var height = 1;
  var layout = Array(numOfSDContent);
  let x = 0;

  for (var index = 0; index < numOfSDContent; index++) {
    let h = height * (index + 1);
    layout[index] = {
      "x": x,
      "y": 0,
      "w": width,
      "h": h,
      "i": index.toString(),
      "divID": "smartdown-output" + index
    };

    x += width;
  }

  return layout;
}



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


function fitContent(layout, rowHeight) {
  layout.forEach(function(layoutElement, layoutElementIndex) {
    var divID = layoutElement.divID;
    var gridCellDiv = document.getElementById(divID);
    var innerContainer = gridCellDiv.children[0];
    if (!innerContainer) {
      console.log('Error when adjusting Smartdown container grid height: need to populate SD content first!');
    }
    else {
      var contentHeight = innerContainer.clientHeight;
      if (enforceMaxHeight) {
        var maxHeight = window.innerHeight;
        if (contentHeight > maxHeight) {
          contentHeight = maxHeight;
        }
      }
      var newHeight = Math.floor(contentHeight / rowHeight) + 1;

      layoutElement.h = newHeight;
      layoutElement.moved = true;
    }
  });
}


function applySmartdown(layout, contentItems, done) {
  if (!contentItems || contentItems.length == 0) {
    console.log('No smartdown content, please select smartdown files to display!')
  }
  else if (contentItems.length !== layout.length) {
    var numOfSDContent = contentItems.length;
    console.log('applySmartdown ERROR ... numOfSDContent !== layout.length', numOfSDContent, layout.length);
  }
  else {
    var unresolvedItems = contentItems.length;
    layout.forEach(function(layoutElement, layoutElementIndex) {
      var divID = layoutElement.divID;
      var div = document.getElementById(divID);
      if (!div) {
        console.log('applySmartdown ERROR ... div not found:', divID);
      }
      else {
        var content = contentItems[layoutElementIndex];
        // div.innerHTML = content;
        smartdown.setSmartdown(content, div, function() {
          smartdown.startAutoplay(div);

          if (--unresolvedItems === 0) {
            done();
          }
        });
      }
    });
  }
}


function loadTableau(layoutURL, done) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener('load', function() {
    var tableau = jsyaml.safeLoad(this.responseText);
    var cells = tableau.layout.cells;
    var layout = [];
    var content = [];
    var cellsRemainingUntilDone = cells.length;
    cells.forEach(function(cell, i) {
      var index = i.toString();
      var layoutCell = {
        x: cell.posX,
        y: cell.posY,
        w: cell.dimW,
        h: cell.dimH,
        i: index,
        contentURL: cell.contentURL,
        divID: 'smartdown-output' + index
      };
      layout.push(layoutCell);

      var contentValue = 'Not Yet Loaded';
      content.push(contentValue);

      var contentURL = cell.contentURL;
      if (contentURL && contentURL.length > 0) {
        var contentReq = new XMLHttpRequest();
        contentReq.addEventListener('load', function(x) {
          content[i] = this.responseText;
          if (--cellsRemainingUntilDone === 0) {
            done(layout, content);
          }
        });
        contentReq.open('GET', contentURL);
        contentReq.send();
      }
      else {
        content[i] = '';
        if (--cellsRemainingUntilDone === 0) {
          done(layout, content);
        }
      }
    });
  });
  oReq.open('GET', layoutURL);
  oReq.send();
}

function exportTableau(layout, content) {
  var layoutCells = [];
  layout.forEach(function(cell, index) {
    var layoutCell = {
      posX: cell.x,
      posY: cell.y,
      dimW: cell.w,
      dimH: cell.h,
      contentURL: cell.contentURL || ''
    };

    layoutCells.push(layoutCell);
  });

  var tableau = {
    layout: {
      cells: layoutCells
    }
  };

  var yaml = jsyaml.dump(tableau);
  console.log('exportTableau', yaml);


  var filename = 'tableau.yaml';
  var yamlExportData =
    encodeURI('data:text/x-yaml;charset=utf-8,' + yaml);

  var link = document.createElement('a');
  link.href = yamlExportData;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);  // required in FF, optional for Chrome/Safari
  link.click();
  document.body.removeChild(link);  // required in FF, optional for Chrome/Safari
}


function buildView(divId, initialLayout, initialContent=[], numCols=12, gridRowHeight=200, draggable=false, resizable=false) {
  /*global Vue*/
  var view = new Vue({
      el: '#' + divId,
      created: function () {
        if (window.gridHelperOptions) {
          this.kioskMode = window.gridHelperOptions.kioskMode;
          this.tableaux = window.gridHelperOptions.tableaux || ['Welcome', 'Comic', 'Gallery'];
          this.defaultTableauName = window.gridHelperOptions.defaultTableauName || this.tableaux[0] || 'Welcome';
        }
        else {
          this.tableaux = ['Welcome', 'Comic', 'Gallery'];
          this.defaultTableauName = this.tableaux[0];
        }
      },
      mounted: function() {
        const that = this;
        window.addEventListener('resize', that.onResize);
        window.onhashchange = that.locationHashChanged;
        //window.addEventListener('hashChange', that.locationHashChanged);
        if (initialContent && initialLayout) {
          this.sdContent = initialContent;
          this.layout = initialLayout;
          this.applyContentAndFixLayout();
          this.locationHash = '#Debug';
          window.location.hash = this.locationHash;
        }
        else {
          //loadTableau('tableaux/' + that.defaultTableauName.toLowerCase() + '.yaml', function(layout, sdContent) {
            //that.layout = layout;
            //that.sdContent = sdContent;
            //that.applyContentAndFixLayout();
          //});
          that.loadTableau(that.defaultTableauName);
        }
      },
      beforeDestroy() {
        // Unregister the event listener before destroying this Vue instance
        window.removeEventListener('resize', this.onResize)
      },
      components: {
        "GridLayout": GridLayout,
        "GridItem": GridItem
      },
      data: {
        layout: [],
        rowHeight: gridRowHeight,
        numCols: numCols,
      	sdContent: [],
        draggable: draggable,
        resizable: resizable,
        index: 0,
        showSettings: authorMode,
        kioskMode: false,
        defaultTableauName: 'Welcome',
        tableaux: [],
        locationHash: '',
      },
      computed: {
      },
      watch: {
      },
      methods: {
        onResize(event) {
          var that = this;
          this.$nextTick(function () {
            that.fixLayout();
          });
        },
        isDragging: function() {
          return this.$refs.layout ?
            this.$refs.layout.isDragging :
            false;
        },
        loadTableau: function(name) {
          var that = this;
          loadTableau('tableaux/' + name.toLowerCase() + '.yaml', function(layout, sdContent) {
            that.layout = layout;
            that.sdContent = sdContent;
            that.applyContentAndFixLayout();
          });
          that.locationHash = '#' + name;
          window.location.hash = that.locationHash;
        },
        locationHashChanged: function() {
          if (this.locationHash && this.locationHash !== window.location.hash) {
            var tableauxName = window.location.hash.replace(/#/g, '');
            if (this.tableaux.indexOf(tableauxName) > -1) {
              this.loadTableau(tableauxName);
            }
            else {
              console.log(`The tableaux you tried to load does not exist! Available tableaux are ${this.tableaux.toString()}`)
            }
          }
        },
        exportTableau: function() {
          exportTableau(this.layout, this.sdContent);
        },
        applyContentAndFixLayout: function() {
          var that = this;
          that.$nextTick(function () {
            applySmartdown(that.layout, that.sdContent, function() {
              that.fixLayout();
            });
          });
        },
        fixLayout: function() {
          var that = this;
          fitContent(that.layout, that.rowHeight);
          that.$nextTick(function () {
            that.$refs.layout.lastLayoutLength = 0;
            that.$refs.layout.layoutUpdate();
            window.setTimeout(function () {
              fitContent(that.layout, that.rowHeight);
              that.$refs.layout.onWindowResize();
              that.$refs.layout.updateHeight();
            }, 1000);
          });
        },
        switchToColumnLayout: function() {
          this.layout = buildColumnLayout(this.sdContent.length, this.numCols);
          this.fixLayout();
        },

        switchToRowLayout: function() {
          this.layout = buildRowLayout(this.sdContent.length, this.numCols);
          this.fixLayout();
        },

	      updateSdSelection: function() {
          this.sdContent = [];
          var that = this;
	        updateSdSelection(this.sdContent, function() {
            that.layout = buildRowLayout(that.sdContent.length, that.numCols);
            that.$nextTick(function () {
              applySmartdown(that.layout, that.sdContent, function() {
                that.fixLayout();
              });
            });
          });
	      },

        resizeEvent: function(i, newH, newW){
          // console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
        },
        resizedEvent: function(i, newH, newW, newHPx, newWPx){
          const that = this;
          console.log("RESIZED");
          if (!authorMode) {
            this.$nextTick(function () {
              that.fixLayout();
            });
          }
        },
        dragStart: function(){
          console.log("dragStart");
        },
        resizeStart: function(){
          console.log("resizeStart", this);
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
  var debugLayout = debugContent ?
    buildColumnLayout(debugContent.length, numColumns) :
    null;
  // debugLayout = buildStaggeredLayout(3, numColumns);
  //debugLayout = null;
  gridView = buildView(vueAppDivId, debugLayout, debugContent, 12, defaultRowHeight, authorMode, authorMode);
}

var calcHandlers = null;
const linkRules = [
];

smartdown.initialize(svgIcons, baseURL, smartdownLoaded, null, calcHandlers, linkRules);
