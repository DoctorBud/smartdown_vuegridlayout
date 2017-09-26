var testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0"},
    {"x":2,"y":0,"w":2,"h":4,"i":"1"},
    {"x":4,"y":0,"w":2,"h":5,"i":"2"},
    {"x":6,"y":0,"w":2,"h":3,"i":"3"},
];

var testSD = [
    'smartdown_samples/01.md'
];
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
    },
});


/* eslint-disable */
/* global smartdown */
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
/* eslint no-invalid-this: 0 */
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


