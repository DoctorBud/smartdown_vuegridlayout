
var SDtext1 = {"text":
`
### Welcome to Div1

[What is your name?](:?Name)
`,
	       "i":"smartdown-output0"
};

var SDtext2 = {"text":
`
### Welcome to Div2

Pleasant to meet you, [](:!Name)
`,
	       "i":"smartdown-output1"
};

var testSD = [SDtext1, SDtext2];

var numOfSDContent = testSD.length;

var indexes = Array.from(Array(numOfSDContent).keys());

var width = 6;
var height = 4;
var testLayout = Array(numOfSDContent);

for (var index of indexes) {
  testLayout[index] = {"x":index*width,"y":0,"w":width,"h":height,"i":index.toString(),"sdi":"smartdown-output"+index};
}
//console.log(testLayout);
//var testLayout = [
//    {"x":0,"y":0,"w":2,"h":2,"i":"0","sdi":"smartdown-output0"},
//    {"x":2,"y":0,"w":2,"h":4,"i":"1","sdi":"smartdown-output1"}
//];

//var Vue = require('vue');

//Vue.config.debug = true;
//Vue.config.devtools = true;
/* global VueGridLayout */
var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

/*global Vue*/
new Vue({
    el: '#app',
    components: {
		    GridLayout,
		    GridItem
    },
    data: {
        layout: testLayout,
        SDcontent: testSD
    },
});


/* eslint-disable */
/* global smartdown */
var baseURL = 'https://smartdown.site/';
var svgIcons = {
};

function smartdownLoaded() {
  console.log('smartdownLoaded... populating DIVs');
  for (var index of indexes) {
    var div = document.getElementById(testLayout[index].sdi);
    smartdown.setSmartdown(testSD[index].text, div);
  }
}

var calcHandlers = null;
const linkRules = [
];

smartdown.initialize(svgIcons, baseURL, smartdownLoaded, null, calcHandlers, linkRules);


/*
var baseURL = 'https://smartdown.site/';
var icons = {
'hypercube': baseURL + '/lib/resources/Hypercube.svg',
'StalactiteStalagmite': baseURL + '/lib/resources/StalactiteStalagmite.svg',
'church': baseURL + '/lib/resources/church.svg',
'lighthouse': baseURL + '/lib/resources/lighthouse.svg',
'barn': baseURL + '/lib/resources/barn.svg',
'medieval-gate': baseURL + '/lib/resources/medieval-gate.svg'
};

var multiparts = {};

function cardLoaded(sourceText, cardKey, cardURL) {
multiparts = smartdown.partitionMultipart(sourceText);
var output = document.getElementById('smartdown-output');
smartdown.setHome(multiparts._default_, output, function() {
  smartdown.startAutoplay(output);
  window.location.hash = '#' + cardKey;
});
}

function relativeCardLoader(cardKey) {
var part = multiparts[cardKey];
if (part) {
  var output = document.getElementById('smartdown-output');
  smartdown.setHome(part, output, function() {
    smartdown.startAutoplay(output);
  });
}
else {
  var cardURL = window.location.origin + window.location.pathname + cardKey + '.md';
  if (cardKey.indexOf('http') === 0) {
    cardURL = cardKey;
  }
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function() {
    cardLoaded(this.responseText, cardKey, cardURL);
  });
  oReq.open("GET", cardURL);
  oReq.send();
}
}

function loadHome() {
var hash = window.parent.location.hash || window.location.hash;
if (hash === '') {
  hash = 'Home';
}
hash = hash.replace(/#/g, '');
relativeCardLoader(hash);
}

var calcHandlers = smartdown.defaultCalcHandlers;
const linkRules = [];

smartdown.initialize(icons, baseURL, loadHome, relativeCardLoader, calcHandlers, linkRules);
*/

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


