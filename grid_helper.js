/* global smartdown */
/* global VueGridLayout */
/* global jsyaml */
/* eslint no-unused-vars: 0 */

Vue.config.debug = true;
Vue.config.devtools = true;

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

const enforceMaxRows = true;
const defaultMaxRows = 5;
const defaultRowHeight = 100;
const defaultNumColumns = 12;
const vueAppDivId = 'layoutApp';

var availableTableaux = ['Welcome', 'Comic', 'Gallery', 'WebGL', 'Pegoda'];


function buildLayout(numContent, xDelta, yDelta, width, widthDelta, height, heightDelta) {
  xDelta = xDelta === undefined ? 0 : xDelta;
  yDelta = yDelta === undefined ? 1 : yDelta;
  width = width === undefined ? defaultNumColumns : width;
  height = height === undefined ? 1 : height;
  widthDelta = widthDelta === undefined ? -1 : widthDelta;
  heightDelta = heightDelta === undefined ? 0 : heightDelta;

  var layout = [];

  for (var index = 0; index < numContent; index++) {
    let x = xDelta * index;
    let y = yDelta * index;
    let w = width + widthDelta * index;
    let h = height + heightDelta * index;

    if (x + w >= defaultNumColumns) {
      ++y;
      x = x % defaultNumColumns;
    }
    layout.push({
      x: x,
      y: y,
      w: w,
      h: h,
      i: index.toString(),
      divID: "smartdown-output" + index
    });
  }

  return layout;
}


function buildXLayout(numContent) {
  var numContentPerCorner = Math.floor((numContent - 1) / 4);
  var layout = [];
  var index = 0;
  var w = 3;

  // UL corner
  for (let i = 0; i < numContentPerCorner; ++i) {
    let cell = {
      x: i * w,
      y: 0,
      w: w,
      h: 1,
      i: index.toString(),
      divID: "smartdown-output" + index
    };
    layout.push(cell);
    ++index;
  }

  // UR corner
  for (let i = 0; i < numContentPerCorner; ++i) {
    let cell = {
      x: defaultNumColumns - numContentPerCorner * w + (i * w),
      y: 0,
      w: w,
      h: 1,
      i: index.toString(),
      divID: "smartdown-output" + index
    };
    layout.push(cell);
    ++index;
  }

  // Center
  let cell = {
    x: 2,
    y: 3,
    w: 8,
    h: 1,
    i: index.toString(),
    divID: "smartdown-output" + index
  };
  layout.push(cell);
  ++index;

  // LL corner
  for (let i = 0; i < numContentPerCorner; ++i) {
    let cell = {
      x: i * w,
      y: 6,
      w: w,
      h: 1,
      i: index.toString(),
      divID: "smartdown-output" + index
    };
    layout.push(cell);
    ++index;
  }

  // LR corner
  for (let i = 0; i < numContentPerCorner; ++i) {
    let cell = {
      x: defaultNumColumns - numContentPerCorner * w + (i * w),
      y: 6,
      w: w,
      h: 1,
      i: index.toString(),
      divID: "smartdown-output" + index
    };
    layout.push(cell);
    ++index;
  }

  return layout;
}


function fitContent(tableau, rowHeight, maxRows) {
  var layout = tableau.layout.cells;
  layout.forEach(function(layoutElement) {
    var divID = layoutElement.divID;
    var gridCellDiv = document.getElementById(divID);
    if (!gridCellDiv) {
      console.log('Error in fitContent()... div not found: ', divID);
    }
    else {
      var innerContainerChildren = gridCellDiv.children;
      var sumHeight = 0;
      var numInnerChildren = innerContainerChildren.length;
      for (var i = 0; i < numInnerChildren; ++i) {
        var innerChild = innerContainerChildren[i];
        sumHeight += innerChild.clientHeight;
      }

      sumHeight *= 1.5; // total hack to compensate for imperfect size calc.
      var newHeight = Math.round(sumHeight / rowHeight);
      if (enforceMaxRows && maxRows && newHeight > maxRows) {
        newHeight = maxRows;
      }
      layoutElement.h = newHeight;
      layoutElement.moved = true;
    }
  });
}

function applySmartdownRecursively(loadedTableauCells, done) {
  if (loadedTableauCells.length === 0) {
    done();
  }
  else {
    var layoutElement = loadedTableauCells[0];
    var divID = layoutElement.divID;
    var div = document.getElementById(divID);
    if (!div) {
      console.log('applySmartdown ERROR ... div not found:', divID);
    }
    else {
      var content = layoutElement.content;

      smartdown.setSmartdown(content, div, function() {
        smartdown.startAutoplay(div);

        applySmartdownRecursively(loadedTableauCells.slice(1), done);
      });
    }
  }
}

//
// This function is overloaded a little too much and perhaps should be broken
// up into two functions. Right now, 'extend' means that 'loadedTableau' will be used, and perhaps
// added to with 'content'. Otherwise, 'content' is used and a layout is synthesized.
//
function applyLayoutAndContentToTableau(extend, numCols, content, loadedTableau, done) {
  var tableauCells = [];
  var maxY = 0;
  var baseIndex = 0;
  var layout = null;
  if (extend) {
    loadedTableau.layout.cells.forEach(function(cell) {
      var cellY = cell.y + cell.h;
      if (cellY > maxY) {
        maxY = cellY;
      }

      tableauCells.push(cell);
    });

    baseIndex = tableauCells.length;
  }
  else {
    layout = buildLayout(content.length, 1, 1, numCols, -1, 1, 0);
    //                                        xDelta, yDelta, width, widthDelta, height, heightDelta


  }
  content.forEach(function(contentElement, loadedElementIndex) {
    var index = loadedElementIndex + baseIndex;
    var cellName = `Card${index}`;
    var layoutElement = layout ?
                          layout[loadedElementIndex] :
                          {
                            x: 0,
                            y: ++maxY,
                            w: defaultNumColumns,
                            h: 1
                          };

    var tableauCell = {
      x: layoutElement.x,
      y: layoutElement.y,
      w: layoutElement.w,
      h: layoutElement.h,
      i: index,
      name: cellName,
      content: contentElement,
      contentURL: null,
      divID: 'smartdown-output' + index
    };
    tableauCells.push(tableauCell);
  });
  var tableau = {
    layout: {
      cells: tableauCells
    }
  };
  done(tableau);
}


function applyLayoutToTableau(layout, rowHeight, loadedTableau, done) {
  var loadedTableauCells = loadedTableau.layout.cells;

  if (layout.length !== loadedTableauCells.length) {
    console.log('layout.length !== loadedTableauCells.length', layout.length, loadedTableauCells.length);
  }
  else {
    loadedTableauCells.forEach(function(loadedElement, loadedElementIndex) {
      var layoutElement = layout[loadedElementIndex];
      loadedElement.h = layoutElement.h;
      loadedElement.w = layoutElement.w;
      loadedElement.x = layoutElement.x;
      loadedElement.y = layoutElement.y;
    });
    done();
  }
}

// Should be called tab
function loadTableauData(tableau, cardName, done) {
  var cells = tableau.layout.cells;
  var layout = [];
  var cellsRemainingUntilDone = cells.length;
  cells.forEach(function(cell, i) {
    var index = i.toString();
    var cellName = `Card${index}`;

    if (cell.contentURL) {
      var pathElements = cell.contentURL.split('/');
      cellName = pathElements[pathElements.length - 1];
    }
    var layoutCell = {
      x: cell.posX,
      y: cell.posY,
      w: cell.dimW,
      h: cell.dimH,
      i: index,
      name: cellName,
      content: cell.content || '',
      contentURL: cell.contentURL,
      divID: 'smartdown-output' + index
    };
    layout.push(layoutCell);

    var contentURL = cell.contentURL;
    if (contentURL && contentURL.length > 0) {
      var contentReq = new XMLHttpRequest();
      contentReq.addEventListener('load', function() {
        layoutCell.content = this.responseText;
        if (--cellsRemainingUntilDone === 0) {
          let loadedTableau = {
            layout: {
              cells: layout
            }
          };
          done(loadedTableau, cardName);
        }
      });
      contentReq.open('GET', contentURL);
      contentReq.send();
    }
    else {
      if (--cellsRemainingUntilDone === 0) {
        let loadedTableau = {
          layout: {
            cells: layout
          }
        };
        done(loadedTableau, cardName);
      }
    }
  });
}


function loadTableauFromURL(tableauURL, cardName, done) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener('load', function() {
    var tableau = jsyaml.safeLoad(this.responseText);
    done(tableau, cardName);
  });
  oReq.open('GET', tableauURL);
  oReq.send();
}

function exportTableau(tableau) {
  var layoutCells = [];
  var layout = tableau.layout.cells;
  layout.forEach(function(cell) {
    var layoutCell = {
      posX: cell.x,
      posY: cell.y,
      dimW: cell.w,
      dimH: cell.h
    };

    if (cell.contentURL && cell.contentURL.length > 0) {
      layoutCell.contentURL = cell.contentURL;
    }
    else {
      layoutCell.content = cell.content;
    }
    layoutCells.push(layoutCell);
  });

  var tableauToExport = {
    layout: {
      cells: layoutCells
    }
  };

  var yaml = jsyaml.dump(tableauToExport);
  yaml += '\n';

  var filename = 'tableau.yaml';
  var yamlExportData =
    'data:text/x-yaml;charset=utf-8,' + encodeURIComponent(yaml);

  var link = document.createElement('a');
  link.href = yamlExportData;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);  // required in FF, optional for Chrome/Safari
  link.click();
  document.body.removeChild(link);  // required in FF, optional for Chrome/Safari
}


function filesSelected(done) {
  var loadedTableau = '';
  var loadedContent = [];

  // !This is bad, how is a method within a view to know about DOM elements?!
  var selectedFiles = document.getElementById('selectedFiles').files;
  var numItemsLeft = selectedFiles.length;
  function fileLoaded(index) {
    return function(event) {
      var name = selectedFiles[index].name;
      if (name.endsWith('.yaml') && loadedTableau === '') {
        loadedTableau = event.target.result;
      }
      else if (name.endsWith('.md')) {
        loadedContent.push(event.target.result);
      }
      else {
        console.log('Error:', name);
      }

      if (--numItemsLeft === 0) {
        done(loadedTableau, loadedContent);
      }
    };
  }

  for (var indexOfFile = 0; indexOfFile < selectedFiles.length; indexOfFile++) {
    var reader = new FileReader();
    reader.onloadend = fileLoaded(indexOfFile);
    reader.readAsText(selectedFiles[indexOfFile]);
  }
}


function parseHash(hash) {
  hash = hash.replace(/#/g, '');
  var hashElements = hash.split(/-/g);
  var tableauName = hashElements[0];
  var cardName = hashElements[1] || '';
  return {
    tableauName: tableauName,
    cardName: cardName
  };
}


function buildView(divId, initialTableau, numCols=defaultNumColumns, gridRowHeight=defaultRowHeight) {
  /*global Vue*/
  var view = new Vue({
    el: '#' + divId,

    components: {
      "GridLayout": GridLayout,
      "GridItem": GridItem
    },

    data: {
      layout: [],
      tableau: {
        layout: {
          cells: []
        }
      },
      currentTableauName: '',
      rowHeight: gridRowHeight,
      maxRows: defaultMaxRows,
      numCols: numCols,
      draggable: false,
      resizable: false,
      index: 0,
      authorMode: true,
      kioskMode: false,
      defaultTableauName: 'Welcome',
      tableaux: [],
      locationHash: '',
      focusedCardName: '',
    },

    created() {
      if (window.gridHelperOptions) {
        this.kioskMode = window.gridHelperOptions.kioskMode;
        this.authorMode = window.gridHelperOptions.authorMode;
        this.draggable = this.authorMode;
        this.resizable = this.authorMode;
        this.tableauxPrefix = window.gridHelperOptions.tableauxPrefix || '';
        this.tableaux = window.gridHelperOptions.tableaux || availableTableaux;
        this.defaultTableauName = window.gridHelperOptions.defaultTableauName || this.tableaux[0] || 'Welcome';
      }
      else {
        this.tableaux = availableTableaux;
        this.defaultTableauName = this.tableaux[0];
      }
      this.locationHash = window.location.hash;
    },

    mounted() {
      window.addEventListener('resize', this.onResize);
      var {tableauName, cardName} = parseHash(this.locationHash);

      if (tableauName === '') {
        this.loadHomeTableau(cardName);
      }
      else {
        this.loadTableauByName(tableauName, cardName);
      }
    },

    beforeDestroy() {
      // Unregister the event listener before destroying this Vue instance
      window.removeEventListener('resize', this.onResize);
    },

    computed: {
    },

    watch: {
    },

    methods: {
      loadHomeTableau(cardName) {
        var that = this;
        if (initialTableau) {
          this.loadTableauInline(initialTableau, cardName);
        }
        else {
          this.loadTableauByName(this.defaultTableauName, cardName);
        }
      },

      loadTableauInline(tableau, cardName) {
        this.loadTableauData(tableau, '', cardName);
      },

      loadTableauByName(tableauName, cardName) {
        var that = this;

        loadTableauFromURL(this.tableauxPrefix + tableauName.toLowerCase() + '.yaml', cardName, function(tableau, cardName) {
          that.loadTableauData(tableau, tableauName, cardName);
        });
      },

      loadTableauData(tableau, tableauName, cardName) {
        var that = this;

        loadTableauData(tableau, cardName, function(loadedTableau, cardName) {
          that.tableau = loadedTableau;
          that.currentTableauName = tableauName;
          that.focusOnCard(cardName);

          that.$nextTick(function() {
            var loadedTableauCells = loadedTableau.layout.cells;
            applySmartdownRecursively(loadedTableauCells, function() {
              that.fixLayout();
            });
          });
        });
      },

      onResize() {
        var that = this;
        this.$nextTick(function () {
          that.fixLayout();
        });
      },

      isDragging() {
        return this.$refs.layout ?
          this.$refs.layout.isDragging :
          false;
      },

      isCurrentTableau(tableauName) {
        return this.currentTableauName === tableauName;
      },

      isCardFocused(cardName) {
        return this.focusedCardName === cardName;
      },

      focusOnCard(cardName) {
        this.focusedCardName = cardName;
        if (!cardName || cardName === '') {
          this.locationHash = this.currentTableauName;
        }
        else {
          this.locationHash = this.currentTableauName + '-' + cardName;
        }
        window.location.hash = this.locationHash;
      },

      toggleFocusOnCard(cardName) {
        if (this.isCardFocused(cardName)) {
          this.focusOnCard('');
        }
        else {
          this.focusOnCard(cardName);
        }
      },

      toggleAuthorMode() {
        var that = this;
        this.authorMode = !this.authorMode;
        this.draggable = this.resizable = this.authorMode;
      },

      exportTableau() {
        exportTableau(this.tableau);
      },

      fixLayout() {
        var that = this;
        fitContent(that.tableau, that.rowHeight, that.maxRows);
        that.$nextTick(function () {
          that.$refs.layout.lastLayoutLength = 0;
          that.$refs.layout.layoutUpdate();
          window.setTimeout(function () {
            fitContent(that.tableau, that.rowHeight, that.maxRows);
            that.$refs.layout.onWindowResize();
            that.$refs.layout.updateHeight();
          }, 2000);
        });
      },


      applyLayoutToTableau(layout) {
        var that = this;
        applyLayoutToTableau(layout, this.rowHeight, this.tableau, function() {
          that.fixLayout();
        });
      },

      switchToColumnLayout() {
        // var layout = buildColumnLayout(this.tableau.layout.cells.length, this.numCols);
        var layout = buildLayout(this.tableau.layout.cells.length,
          3, 0, 3, 0, 1, 1);
        //xDelta, yDelta, width, widthDelta, height, heightDelta

        this.applyLayoutToTableau(layout);
      },

      switchToRowLayout() {
        var layout = buildLayout(this.tableau.layout.cells.length,
          0, 1, this.numCols, 0, 1, 0);
        //xDelta, yDelta, width, widthDelta, height, heightDelta
        this.applyLayoutToTableau(layout);
      },

      switchToStaggeredLayout() {
        var layout = buildLayout(this.tableau.layout.cells.length,
          1, 1, this.numCols, -1, 1, 0);
        //xDelta, yDelta, width, widthDelta, height, heightDelta
        this.applyLayoutToTableau(layout);
      },

      switchToXLayout() {
        var numContent = this.tableau.layout.cells.length;
        if ((numContent - 1) % 4 === 0) {
          var layout = buildXLayout(numContent);
          this.applyLayoutToTableau(layout);
        }
      },

      filesSelected() {
        var that = this;
        filesSelected(function(loadedTableauString, loadedContent) {
          var hasTableau = loadedTableauString !== '';

          function applyAdditionalContent(extend) {
            applyLayoutAndContentToTableau(extend, this.numCols, loadedContent, that.tableau, function(tableau) {
              that.tableau = tableau;
              that.currentTableauName = '';
              that.locationHash = '';
              window.location.hash = '';
              that.$nextTick(function() {
                var loadedTableauCells = tableau.layout.cells;
                applySmartdownRecursively(loadedTableauCells, function() {
                  that.fixLayout();
                });
              });
            });
          }

          if (hasTableau) {
            var tableau = jsyaml.safeLoad(loadedTableauString);
            loadTableauData(tableau, '', function(loadedTableau, cardName) {
              that.tableau = loadedTableau;
              that.currentTableauName = '';
              that.focusOnCard(cardName);
              applyAdditionalContent(true);
            });
          }
          else {
            applyAdditionalContent(false);
          }
        });
      },

      resizedEvent(i, newH, newW, newHPx, newWPx) {
        this.fixLayout();
      },

      dragStart() {
        // console.log("dragStart");
      },

      resizeStart() {
        // console.log("resizeStart", this);
      }

    }
  });

  return view;
}


var baseURL = 'https://smartdown.site/'; //'https://127.0.0.1:4000/';
var svgIcons = {
};



var debugCard0 =
`
# Debug Card 0

Simple Card

- [Card1](:@Card1)
- [Card2](:@Card2)

`;

var debugCard1 =
`
# Debug Card 1

[What is your name?](:?Name)

![](http://www.eugeneweekly.com/sites/default/files/uploads/imported/2009/graphics/032609somethingeug.jpg)
`;

var debugCard2 =
`
# Debug Card 2

## FixFontSizeForOutputCells, [](:!Name)

### FixFontSizeForOutputCells, [](:!Name)

#### FixFontSizeForOutputCells, [](:!Name)

##### FixFontSizeForOutputCells, [](:!Name)

###### FixFontSizeForOutputCells, [](:!Name)
`;


var debugTableau = {
  layout: {
    cells: [
      {
        posX: 0,
        posY: 0,
        dimW: defaultNumColumns,
        dimH: 3,
        content: debugCard0
      },
      {
        posX: 0,
        posY: 3,
        dimW: 6,
        dimH: 3,
        content: debugCard1
      },
      {
        posX: 6,
        posY: 3,
        dimW: 6,
        dimH: 3,
        content: debugCard2
      }
    ]
  }
};

var vueApp = null;

function cardLoader(cardName) {
  vueApp.focusOnCard(cardName);
}

function smartdownLoaded() {
  debugTableau = null;
  vueApp = buildView(vueAppDivId, debugTableau);
}

var calcHandlers = null;
const linkRules = [
];


smartdown.initialize(svgIcons, baseURL, smartdownLoaded, cardLoader, calcHandlers, linkRules);

//
// work in progress to create a smartdown component and simplify applySmartdown()
// and fitContent()
// Requires smartdown 0.0.50
//

// Vue.component('smartdown', {
//   props: ['content'],
//   template: '<div>Smartdown content: {{content}}</div>',
//   mounted() {
//     // console.log('mounted', this, this.$el.id, this.content);
//     smartdown.setSmartdown(this.content, this.$el);
//   },
//   updated() {
//     // console.log('updated', this, this.$el.id, this.content);
//     smartdown.setSmartdown(this.content, this.$el);
//   }
// });


