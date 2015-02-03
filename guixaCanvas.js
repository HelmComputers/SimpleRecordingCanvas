//By Mijail
var canvasWidth = 600;
var canvasHeight = 400;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var timeStamps = new Array();
var fromDate;
var toDate;
var paint;
var isPlaying;
var difference;
var primer = true;
var duration;
var millisToWaitWhenFinished = 1000;
var intervalID;
var maxTimeWithoutPainting = 2000;
var timeoutID;
var autoplay = true;
var demo = true;

var canvasDiv = document.getElementById('GuixaCanvas');
var playBt = document.getElementById('PlayButton');
canvas = document.createElement('canvas');
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");


$( document ).ready(function() {
  if (demo) initDemo();
  startAutoPlayback();
});

$('#PlayButton').click(function(e){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  play();
});


$('#canvas').mousedown(function(e){
  if (intervalID) reset(); //if autoplay
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  if (primer) {
    fromDate = Date.now();
    primer = false;
  }
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false,Date.now());
  redraw();
});

$('#canvas').mousemove(function(e){
  if(paint){
    var date = Date.now();
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true, date);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint = false;
    console.log("mouseup");

  if (autoplay) startCountingTimeIfNeeded();
});



function startAutoPlayback() {
  if (!autoplay) return;
  duration = toDate-fromDate;


  play();
  intervalID = setInterval(play,duration+millisToWaitWhenFinished);
}


function startCountingTimeIfNeeded() {
  if (timeoutID) {
    clearTimeout(timeoutID);
    timeoutID = null;
  }
  toDate = Date.now();
  timeoutID = setTimeout(startAutoPlayback,maxTimeWithoutPainting);
}


function reset() {
  console.log("reset");
 clearInterval(intervalID);
 intervalID = null;
 clickX = new Array();
 clickY = new Array();
 clickDrag = new Array();
 timeStamps = new Array();
 isPlaying = false;
 primer = true;
}

function addClick(x, y, dragging, timeStamp)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  timeStamps.push(timeStamp);

}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;
			
  for(var i=0; i < clickX.length; i++) {
        if (isPlaying) {
            difference = timeStamps[i] - fromDate;
            var aux = difference;
            parche(i,aux);
        }
        else drawLine(i);
  }
  if (isPlaying) isPlaying = false;

}

function parche(i,diff) {
  setTimeout(function() { drawLine(i);}, diff);
}

function clear () {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
}

function generateJSON() {
var jsondata = "data=\'{\"clickX\": ["+clickX+"], \"clickY\": ["+clickY+"],\"timeStamps\": ["+timeStamps+"], \"clickDrag\": ["+clickDrag+"], \"fromDate\": "+fromDate+"}\'";
var url = 'data:text/json;charset=utf8,' + encodeURIComponent(jsondata);
window.open(url, '_blank');
window.focus();
}

function initDemo() {
var mydata = JSON.parse(data);
clickX = mydata["clickX"];
clickY = mydata["clickY"];
clickDrag = mydata["clickDrag"];
timeStamps = mydata["timeStamps"];
fromDate = mydata["fromDate"];
toDate = mydata["timeStamps"][timeStamps.length-1];
}

function drawLine (i) {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
}

function play() {
difference = 0;
  isPlaying = true;
  redraw();
}