function fitToContainer(canvas){
  canvas.style.width='100%';
  // canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function create_experiment(options){
    this.canvas = $(options.canvas)[0];
    if(this.canvas==undefined){
        this.run=function(){

        }
        return;
    }
    var context = this.canvas.getContext('2d');
    fitToContainer(this.canvas);

    var MAX_Y = this.canvas.height;
    var MAX_X = this.canvas.width;
    var MAX_Z = 100;
    var GRAVITY = 0.01;
    var EDGE_THRES = 5;
    var FRICTION = 0.8;
    var POLY_COUNT = 5;
    var ALPHA = 0.5;
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var icon_bool = getRandomInt(0,2);
    var ICON = (icon_bool == 0 ? true : false);
    var RECT = (icon_bool == 1 ? true : false);

    var imageObj = new Image();

    imageObj.src = "/static/favicon.ico";

    function RGB2Color(r,g,b){
        return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }

    function byte2Hex(n){
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    }

    function changeColour(i){
        if (this.rainbow){
            frequency = 0.1;
            red   = Math.sin(frequency*i + 0) * 127 + 128;
            green = Math.sin(frequency*i + 2*Math.PI/3) * 127 + 128;
            blue  = Math.sin(frequency*i + 4*Math.PI/3) * 127 + 128;
            return RGB2Color(red,green,blue);
        } else {
            // Black
            return RGB2Color(0,0,0);
        }
    }

    function dObject(){
        this.init = function(){
            this.x_speed=(Math.random()*10)-5;
            this.y_speed=(Math.random()*10)-5;
            this.alive = false;
            this.count = Math.random()*100;
            this.colour = 0x000000;
            this.x_edge = 0;
            this.y_edge = 0;
            this.gravity = true;
            this.friction = false;
            this.rainbow = true;
            this.width = 10;
            this.height = 10;
            this.size = (Math.random()+3.5);
            this.x_pos = (Math.random()*(MAX_X-this.width*this.size));
            this.y_pos = (Math.random()*(MAX_Y-this.height*this.size));
        }
        this.get_height = function(){
            return this.height*this.size;
        }
        this.get_width = function(){
            return this.width*this.size;
        }
        this.init();
        this.draw = function(){
            this.colour=changeColour(this.count);
            this.count++;
            if(ICON){
                context.drawImage(imageObj,this.x_pos,this.y_pos,this.get_width(),this.get_height())
            } else if (RECT) {
                context.fillStyle=this.colour;
                context.fillRect(this.x_pos,this.y_pos,this.get_width(),this.get_height())
            } else {
                context.beginPath();
                context.arc(this.x_pos, this.y_pos, this.size, 0, 2 * Math.PI, false);
                context.fillStyle=this.colour;
                context.fill();
                context.lineWidth = 0.1;
                context.strokeStyle = '#003300';
                context.stroke();
            }
        }
        this.update = function(x_accel, y_accel){
            if(this.friction){
                this.x_speed*=FRICTION;
            }
            if(this.gravity){
                y_accel+=GRAVITY;
            }
            this.x_speed+=x_accel;
            this.y_speed+=y_accel;
            this.x_pos+=this.x_speed;
            this.y_pos+=this.y_speed;
            if(Math.abs(this.x_speed) < 0.1){
                this.x_speed = 0;
            }
            if (this.x_pos+this.get_width()+this.x_speed >= MAX_X || this.x_pos+this.x_speed <= 0){
                this.x_speed=-this.x_speed;
                this.x_edge+=1;
                if(this.x_edge>EDGE_THRES){
                    this.x_speed=0;
                }
            } else {
                this.x_edge=0;
            }
            if (this.y_pos+this.get_height()+this.y_speed >= MAX_Y || this.y_pos+this.y_speed <= 0){
                this.y_speed=-this.y_speed;
                this.y_edge+=1;
                if(this.y_edge>EDGE_THRES){
                    this.y_speed=0;
                    this.gravity = false;
                    this.friction = true;
                }
            } else {
                this.friction = false;
                this.gravity = true;
                this.y_edge = 0;
            }
            if (this.x_speed == 0 && this.y_speed == 0){
                this.kill_object();
            }
        }
        this.kill_object = function(){
            this.init();
        }
    }
    function prepareObjects(){
        var cloud = new Array();
        for(var i=0;i<POLY_COUNT;i++){
            cloud.push(new dObject());
        }
        return cloud;
    }
    // explicitObject

    // explicitWord

    this.run = function(){
        window.requestAnimFrame = (function(callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        cloud = prepareObjects();
        function update(container){
            for(var i=0;i<container.length;i++){
                container[i].update(0,0);
            }
        }
        function draw(container){
            for(var i=0;i<container.length;i++){
                container[i].draw();
            }   
        }

        function animate() {
            
            // update
            update(cloud);
            // clear
            context.fillStyle = "rgba(52, 52, 52, "+ALPHA+")"
            context.fillRect(0,0,MAX_X,MAX_Y);

            // draw stuff
            draw(cloud);

            // request new frame
            requestAnimFrame(function() {
                animate();
            });
        }
        animate();
    }
    this.run();
}

var DAMPING = 1;


$(document).ready(function(){

  function getNoise(x){
    return (x-(Math.random()*Math.abs(x*2)))
  }


  function fitToContainer(canvas){
    canvas.style.width='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  var display = document.getElementById('playful');
  var ctx = display.getContext('2d');
  var HYPER_DRIVE=false;
  var particles = [];
  var stars = [];
  var frequency = 0.2;
  var count = 0;
  var mode = true;
  var animate = true;
  var ALPHA = 1.0;
  var ParticleCount = 100;
  var StarCount = 100;
  var width = $(display).parent().width();
  var height = $(display).parent().height();
  var mouse = { x: width * 0.5, y: height * 0.5 };
  var actual_mouse = { x: width * 0.5, y: height * 0.5 };
  var P_TAIL_SIZE = 5;
  var S_TAIL_SIZE = 5;
  var NOISE = 5;
  var FOLLOW = false;
  //
  fitToContainer(display);



  function onMousemove(e,display) {
    var rect = display.getBoundingClientRect();
    actual_mouse.x = e.clientX - rect.left;
    actual_mouse.y = e.clientY - rect.top;
  }

  $("#playful").on("click",function(e){
    if(e.which==1){
      init();
      mode = !mode;
    } else if (e.which == 2){
      FOLLOW=!FOLLOW;
    }
  });

  display.addEventListener('mousemove', function(evt){
    onMousemove(evt,display);
  });

  function byte2Hex(n){
      var nybHexString = "0123456789ABCDEF";
      return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

  function RGB2Color(r,g,b){
      return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }
  function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function changeColour(i){
    red   = Math.sin(frequency*i + 0) * 127 + 128;
    green = Math.sin(frequency*i + 2*Math.PI/3) * 127 + 128;
    blue  = Math.sin(frequency*i + 4*Math.PI/3) * 127 + 128;
    return RGB2Color(red,green,blue);
}


  function Particle(x, y, size) {
    if(size == null){
      this.star = false
      this.size=Math.random()*5;
    } else {
      this.star = true
      this.size = size;

    }
    this.history = []
    this.phase = 0+Math.random()*100;
    this.x = this.oldX = x;
    this.y = this.oldY = y;
  }

  Particle.prototype.integrate = function() {
    var velocityX = (this.x - this.oldX) * DAMPING;
    var velocityY = (this.y - this.oldY) * DAMPING;
    this.oldX = this.x;
    this.oldY = this.y;
    this.x += velocityX;
    this.y += velocityY;
  };

  Particle.prototype.repel = function(x, y, multiplier) {
    var dx = this.x - x;
    var dy = this.y - y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    this.x += dx / distance;
    this.y += dy / distance;
  };

  Particle.prototype.attract = function(x, y, multiplier) {
    var dx = x - this.x;
    var dy = y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    this.x += dx / distance;
    this.y += dy / distance;
  };

  Particle.prototype.draw = function(i) {
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if(i!=null && !this.star){
      ctx.strokeStyle = changeColour(i);
    } else if (this.star){
      ctx.strokeStyle="rgb(255,255,255)"
    } else {
      ctx.strokeStyle = changeColour(this.phase);
    }
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    
    this.backup()
    this.draw_backup();

    this.phase+=frequency
    if(this.phase>10000){
      this.phase=0;
    }
  };

  Particle.prototype.backup = function() {
    if(!this.star){
      var history = {colour:ctx.strokeStyle, previous_x:this.oldX, previous_y:this.oldY, current_x:this.x,current_y:this.y};
      this.history.splice(0,0,history);

      // {colour:ctx.strokeStyle, previous_x:this.oldX, previous_y:this.oldY, current_x:this.x,current_y:this.y}
      if (this.history.length>P_TAIL_SIZE){
        this.history.splice(P_TAIL_SIZE,this.history.length-P_TAIL_SIZE);
        // console.log(this.history);
        // BLURGH();
     }
    }
}

  Particle.prototype.draw_backup = function() {
    for (var i = 0; i < this.history.length; i++) {
      ctx.beginPath();
      var history =this.history[i]
      if(i!=0){
        var history2 =this.history[i-1]
      }
      ctx.strokeStyle = history.colour;
      ctx.lineWidth = this.size-i;
      ctx.moveTo(history.previous_x, history.previous_y);
      if(history2!=null){
        ctx.lineTo(history2.previous_x, history2.previous_y);
      }
      ctx.stroke();
    }
  }

  function init(){
    stars = new Array(StarCount);
    for (var i = 0; i < StarCount; i++) {
      stars[i] = new Particle(Math.random() * width, Math.random() * height,Math.random()*2);
    }
    particles = new Array(ParticleCount);
    for (var i = 0; i < ParticleCount; i++) {
      particles[i] = new Particle(Math.random() * width, Math.random() * height);
    }
  }

  init();

  function draw(){
    requestAnimationFrame(draw);
    if(animate){
      ctx.fillStyle = "rgba(52, 52, 52, "+ALPHA.toFixed(2)+")"
      ctx.fillRect(0,0,width,height);
      for (var i = 0; i < stars.length; i++) {
        stars[i].draw();
      }
      if(!HYPER_DRIVE){
        for (var i = 0; i < particles.length; i++) {
          if(mode===true){
            particles[i].draw(count);
          } else {
            particles[i].draw();
          }
          if (count>100000){
            count = 0;
          }
        }
        count++;
      }
    } 
  }

  function update(){
    if(FOLLOW){
      mouse.x = actual_mouse.x;
      mouse.y = actual_mouse.y;
    }
    if(animate){
      for (var i = 0; i < stars.length; i++) {
        stars[i].repel(mouse.x,mouse.y);
        stars[i].integrate();
        if(stars[i].x>width || stars[i].x<0 || stars[i].y > height || stars[i].height<0 ){
          stars[i]= new Particle(Math.random() * width, Math.random() * height,Math.random()*2);
        }
      }
      if(!HYPER_DRIVE){
        for (var i = 0; i < particles.length; i++) {
          particles[i].attract(mouse.x, mouse.y);
          particles[i].attract(particles[i].x+getNoise(NOISE),particles[i].y+getNoise(NOISE));
          particles[i].integrate();
          if (count>100000){
            count = 0;
          }
        }
        count++;
      }
    }
  }
  requestAnimationFrame(draw);
  window.setInterval(update, 10);

  $("#frequency-control").text("Frequency "+frequency.toFixed(2));
  $("#alpha-control").text("Alpha "+ALPHA.toFixed(2));
  $("#particle-control").text("Particle Count "+ParticleCount);
  $(document).keydown(function(evt) {
    // console.log(evt.keyCode)
    if (evt.keyCode == 80) {
      animate = !animate;
    } else if (evt.keyCode==83){
      HYPER_DRIVE=!HYPER_DRIVE;
    } else if (evt.keyCode==37){
      frequency-=0.1;
      $("#frequency-control").text("Frequency "+frequency.toFixed(2));
    } else if (evt.keyCode==39){
      frequency+=0.1;
      $("#frequency-control").text("Frequency "+frequency.toFixed(2));
    } else if (evt.keyCode==221){
      ALPHA+=0.1;
      $("#alpha-control").text("Alpha "+ALPHA.toFixed(2));
    } else if (evt.keyCode==219){
      ALPHA-=0.1;
      $("#alpha-control").text("Alpha "+ALPHA.toFixed(2));
    }else if (evt.keyCode==81){
      ParticleCount = ParticleCount+100;
      $("#particle-control").text("Particle Count "+ParticleCount);
    }else if (evt.keyCode==87){
      ParticleCount = ParticleCount+10;
      $("#particle-control").text("Particle Count "+ParticleCount);
    }else if (evt.keyCode==69){
      ParticleCount = ParticleCount-10;
      $("#particle-control").text("Particle Count "+ParticleCount);
    }else if (evt.keyCode==82){
      ParticleCount = ParticleCount-100;
      $("#particle-control").text("Particle Count "+ParticleCount);
    }
  })
});
