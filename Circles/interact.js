var canvas = document.querySelector('canvas');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

/* var mouse = {
  x:undefined;
  y:undefined;
} */

function Circle(x, y, r){
  this.x = x;
  this.y = y;
  this.r = r;
  this.dx = Math.random()*20-10;
  this.dy = Math.random()*20-10;
  
   var r = Math.round(Math.random() * 255);
  var g = Math.round(Math.random() * 255);
  var b = Math.round(Math.random() * 255);
  this.color = 'rgba('+r+', '+g+' ,'+b+' , 1)';
  
  this.draw = function(){
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
    c.strokeStyle = this.color;
    c.fillStyle = this.color;
    c.stroke();
    c.fill();
  }
  
  this.update = function(){
    if (this.r>0){
      this.x += this.dx;
      this.y += this.dy;
      if ((this.x>=canvas.width - this.r) || (this.x<=this.r))
        this.dx*=-1;
      if((this.y>=canvas.height - this.r) || (this.y<=this.r))
        this.dy*=-1;
      this.draw(); 
      this.r -=1;
    }
  }
}

function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  for(var k = 0; k<circleArray.length; k++){
    circleArray[k].update();
  }
}

c.lineWidth = 5;
var circleArray = [];

for(var k = 0; k<100; k++){
  var r = Math.round(Math.random()*100);
  var x = Math.round(Math.random()*(canvas.width-2*r)+r);
  var y = Math.round(Math.random()*(canvas.height-2*r)+r);
  
  circleArray.push(new Circle(x,y,r));
}


window.addEventListener('mousemove', function(event){
  circleArray.shift();
  var r = Math.round(Math.random()*100);
  var x = (event.x<=r)?r+1:(event.x<canvas.width-r)?event.x:canvas.width-r-1;
  var y = (event.y<=r)?r+1:(event.y<canvas.height-r)?event.y:canvas.height-r-1;
  circleArray.push(new Circle(x,y,r));
  console.log(circleArray.length);
});

animate();
