
var SDtext1 =
`
### Welcome to Div1

[What is your name?](:?Name)
`;

var SDtext2 = 
`
### Welcome to Div2

Pleasant to meet you, [](:!Name)
`;

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
		  "GridLayout": GridLayout,
		   "GridItem": GridItem
    },
    data: {
        layout: testLayout,
        SDcontent: testSD,
        draggable: true,
        resizable: true
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


