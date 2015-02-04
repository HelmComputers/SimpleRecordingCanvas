//By Miguel Berrocal
var canvasWidth = 700;
var canvasHeight = 400;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var timeStamps = new Array();
var timeouts = new Array();
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
canvas.setAttribute('style', 'background-color:#2d2d2d');

canvasDiv.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");


$( document ).ready(function() {
  if (demo) initDemo();
  startAutoPlayback();

});



function handleStart(e) {
  if (intervalID) reset(); //if autoplay
  if (timeoutID) clearTimeout(timeoutID);
  var mouseX = e.pageX - canvas.offsetLeft;
  var mouseY = e.pageY - canvas.offsetTop;
  if (primer) {
    fromDate = Date.now();
    primer = false;
  }
  paint = true;
  addClick(mouseX, mouseY, false, Date.now());
  drawLastClick();
}

function handleMove(e) {
    if(paint){
    var date = Date.now();
    addClick(e.pageX - canvas.offsetLeft , e.pageY - canvas.offsetTop, true, date);
    drawLastClick();
  }
}

function handleEnd(e) {
  paint = false;
  if (autoplay) startCountingTimeIfNeeded();
}

function handleLeave(e) {
   paint = false;
}

function handleTabletStart(e) {
  e.preventDefault();
  handleStart(e.targetTouches[0]);
}

function handleTabletMove(e) {
  e.preventDefault();
  handleMove(e.targetTouches[0]);
}

function handleTabletEnd(e) {
  handleEnd(e.targetTouches[0]);
}
function handleTabletLeave(e) {
  handleLeave(e.targetTouches[0]);
}


$('#canvas').mousedown(handleStart);
$('#canvas').mousemove(handleMove);
$('#canvas').mouseup(handleEnd);
$('#canvas').mouseleave(handleLeave);


canvas.addEventListener('touchstart',handleTabletStart,false);
canvas.addEventListener('touchmove',handleTabletMove,false);
canvas.addEventListener('touchend',handleTabletEnd,false);
canvas.addEventListener('touchcancel',handleTabletLeave,false);



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
 clearInterval(intervalID);
 if (timeouts) {
  clearAllDrawingTimeOuts();
 }
 intervalID = null;
 clickX = new Array();
 clickY = new Array();
 clickDrag = new Array();
 timeStamps = new Array();
 timeouts = new Array();
 isPlaying = false;
 primer = true;
 clear();
}

function clearAllDrawingTimeOuts() {
  for (var i=0; i<timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
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
  context.strokeStyle = "#ffffff";
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
  if (isPlaying)
	  isPlaying = false;
}

function drawLastClick() {
  context.strokeStyle = "#ffffff";
  context.lineJoin = "round";
  context.lineWidth = 5;
  
  drawLine(clickX.length - 1); 
}

function parche(i,diff) {
 var drawLineTimeoutID = setTimeout(function() { drawLine(i);}, diff);
 timeouts.push(drawLineTimeoutID);
}

function clear () {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
}

function generateJSON() {
var jsondata = "data=\'{\"clickX\": ["+clickX+"], \"clickY\": ["+clickY+"],\"timeStamps\": ["+timeStamps+"], \"clickDrag\": ["+clickDrag+"], \"fromDate\": "+fromDate+"}\'";
var url = 'data:text/json;charset=utf8,' + encodeURIComponent(jsondata);
window.open(url, '_self');
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