const cv = wx.createCanvas();
const ctx = cv.getContext('2d');

const db = {
  tag:"DataBase",
  state:"result",
  map:[],
  score:0,
  num:0,
  r:cv.width/10,
  color:['white','skyblue','orange','grey','lightgrey','brown','grey','cyan','lightgreen','wheat','purple','khaki','pink','darkgrey','darkblue','red','blue'],
  name:['','H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S'],
  length:[0,1,2,2,2,1,1,1,1,1,2,2,2,2,2,1,1],
  dv:{
    tag:"Device",
    w:cv.width,
    h:cv.height
  },
  te:{
    tag:"TouchEvent",
    x:0,
    y:0,
    dx:0,
    dy:0
  }
}

const lc = {
  tag:"LogicalConsole",
  getRandom() {
    while (true) {
      var num = Math.floor(Math.random() * 4)
      if (num != 4) {
        return num;
      }
    }
  },
  getNum(){
    db.num = 0;
    for (var mx = 0; mx < 4; mx++) {
      for (var my = 0; my < 4; my++) {
        if(db.map[mx][my] > 0){
          db.num++;
        }
      }
    }
  },
  addItemToMap() {
    while (db.num<16) {
      var x = this.getRandom();
      var y = this.getRandom();
      if (db.map[x][y] == 0) {
        db.map[x][y] = 1;
        db.num++;
        console.log("set[" + x + "," + y + "]=1");
        return true;
      }
    }
    return false;
  },
  checkOver(){
    if(db.num<16){
      return;
    }
    console.log('full');
    for(var x = 0;x<4;x++){
      for(var y = 0;y<4;y++){
        if (x > 0){
          if (db.map[x][y] == db.map[x - 1][y]){
            return;
          }
        }
        if (y > 0) {
          if (db.map[x][y] == db.map[x][y - 1]){
            return;
          }
        }
        if (x < 3) {
          if (db.map[x][y] == db.map[x][y - 1]){
            return;
          }
        }
        if (y < 3) {
          if (db.map[x][y] == db.map[x][y + 1]){
            return;
          }
        }
      }
    }
    db.state = "gameover";
  },
  getResult(){
    var hasResult = false;
    if(db.te.dx != 0){
      for(var y = 0;y < 4;y++){
        for (var x = 1.5 + db.te.dx / 2; x >= 0 & x <= 3; x -= db.te.dx){
          if (db.map[x][y] != 0 & (db.map[x + db.te.dx][y] == 0 | db.map[x + db.te.dx][y] == db.map[x][y])){
            for (var i = x + db.te.dx; i >= 0 & i <= 3; i += db.te.dx) {
              if (db.map[i][y] == db.map[x][y]){
                db.score += Math.pow(2, db.map[x][y]);
                //ani.addAni(db.map[x][y],[x,y],[i,y]);
                db.map[x][y] = 0;
                db.map[i][y]++;
                hasResult = true;
                break;
              }else if(db.map[i][y] != 0){
                if (db.map[i - db.te.dx][y] == 0){
                  db.map[i - db.te.dx][y] = db.map[x][y];
                  db.map[x][y] = 0;
                  hasResult = true;
                }
              }else if(i == 1.5+1.5*db.te.dx){
                db.map[i][y] = db.map[x][y];
                db.map[x][y] = 0;
                hasResult = true;
              }
            }
          }
        }
      }
    }else{
      for (var x = 0; x < 4; x++) {
        for (var y = 1.5 + db.te.dy / 2; y >= 0 & y <= 3; y -= db.te.dy) {
          if (db.map[x][y] != 0 & (db.map[x][y + db.te.dy] == 0 | db.map[x][y + db.te.dy] == db.map[x][y])) {
            for (var i = y + db.te.dy; i >= 0 & i <= 3; i += db.te.dy) {
              if (db.map[x][i] == db.map[x][y]) {
                db.score += Math.pow(2, db.map[x][y]);
                db.map[x][y] = 0;
                db.map[x][i]++;
                hasResult = true;
                break;
              } else if (db.map[x][i] != 0) {
                if (db.map[x][i - db.te.dy] == 0){
                  db.map[x][i - db.te.dy] = db.map[x][y];
                  db.map[x][y] = 0;
                  hasResult = true;
                }
              } else if (i == 1.5 + 1.5 * db.te.dy) {
                db.map[x][i] = db.map[x][y];
                db.map[x][y] = 0;
                hasResult = true;
              }
            }
          }
        }
      }
    }
    this.getNum();
    this.checkOver();
    if (hasResult) {
      this.addItemToMap();
    }
    console.log('score='+db.score);
  }
}

const atom = {
  drawAtom(mx,my){
    if(db.map[mx][my] == 0){
      return;
    }
    var x = db.dv.w / 2 + (mx - 1.5) * 2 * db.r;
    var y = db.dv.h/2 + (my - 1.5) * 2 * db.r;
    var color = [db.map[mx][my], 0, db.map[mx][my]]
    var k = [1,0.82,0.7]
    for(var i = 0;i<3;i++){
      ctx.beginPath();
      ctx.fillStyle = db.color[color[i]];
      ctx.arc(x, y, db.r*k[i], 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
    ctx.font = 1.414 * db.r / 2 + 'px Comic Sans MS';
    //console.log(1.4 * db.r / 2 + 'px 黑体');
    ctx.fillStyle = db.color[0];
    ctx.fillText(db.name[db.map[mx][my]], x - db.length[db.map[mx][my]]*db.r/4, y + db.r/4);
  }
}

const rder = {
  tag:"Renderer",
  clear(){
    ctx.clearRect(0,0,db.dv.w,db.dv.h);
  },
  drawLabel(){
    var k = [1, 0.82, 0.7];
    var c = ['wheat','white','wheat']
    for(var i = 0;i<3;i++){
      ctx.beginPath();
      ctx.fillStyle = c[i];
      ctx.arc(db.dv.w / 2 - 3 * db.r, db.dv.h / 2 - 5 * db.r, db.r*k[i], 0, 2 * Math.PI, true)
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(db.dv.w / 2 + 3 * db.r, db.dv.h / 2 - 5 * db.r, db.r * k[i], 0, 2 * Math.PI, true)
      ctx.fill();
      ctx.closePath();
      ctx.fillRect(db.dv.w / 2 - 3 * db.r, db.dv.h / 2 - 5 * db.r - db.r * k[i], 6 * db.r , 2 * db.r * k[i]);
    }
    ctx.font = 1.414 * db.r / 2 + 'px Comic Sans MS';
    ctx.fillStyle = db.color[0];
    var str = ''+ db.score;
    console.log(str.length)
    ctx.fillText('SCORE:' + db.score, db.dv.w / 2 - (str.length+6)*db.r / 4,db.dv.h/2-4.7*db.r);
  },
  drawAtoms(){
    for (var mx = 0; mx < 4; mx++) {
      for (var my = 0; my < 4; my++) {
        atom.drawAtom(mx, my);
      }
    }
  },
  drawHoles(){
    for (var mx = 0; mx < 4; mx++) {
      for (var my = 0; my < 4; my++) {
        var x = db.dv.w / 2 + (mx - 1.5) * 2 * db.r;
        var y = db.dv.h / 2 + (my - 1.5) * 2 * db.r;
        ctx.beginPath();
        ctx.fillStyle = db.color[0];
        ctx.arc(x, y, db.r, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
      }
    }
  },
  draw(){
    this.drawHoles();
    this.drawAtoms();
    this.drawLabel();
  },
  gameover(){
    this.draw();
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(db.dv.w / 2, db.dv.h / 2, db.r*4.1, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
    ctx.font = 2.828 * db.r + 'px 黑体';
    ctx.fillStyle = 'black';
    ctx.fillText('X', db.dv.w / 2 - 2 * db.r, db.dv.h / 2 - 0.5*db.r);
    ctx.fillText('X', db.dv.w / 2, db.dv.h / 2 - 0.5*db.r);
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = db.r/4;
    ctx.arc(db.dv.w / 2 - db.r*0.3, db.dv.h / 2 + db.r * 2.4, db.r * 1.5, Math.PI, 2 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'orange';
    ctx.arc(db.dv.w / 2, db.dv.h / 2, db.r * 3.5, Math.PI/3, 13/6 * Math.PI, false);
    ctx.lineTo(db.dv.w * 3 / 4, db.dv.h / 2);
    ctx.stroke();
  }
}

/*const ani = {
  frame : 0,
  list:[],
  addAni:function(n,start,end){
    list[list.length] = [n,start,end];
  },
  doAni:function(){
    rder.clear();
    rder.drawHoles();
    rder.drawLabel();
    this.frame++;
    for(var i = 0;i<this.list.lenth;i++){
      var x = list[i][1][0] + this.frame * (list[i][2][0] - list[i][1][0]) / 5;
      var y = list[i][1][1] + this.frame * (list[i][2][1] - list[i][1][1]) / 5;
      atom.drawAtom(n,x,y);
    }
    if(this.frame == 5){
      db.state = 'result'
      this.frame = 0;
      this.list = [];
      rder.clear();
      rder.draw();
      return;
    }
  }
}*/

const mc = {
  tag:"MainProcessConsole",
  cptInit:{
    tag:"ComponentInit",
    initMap(){
      for(var x = 0;x<4;x++){
        db.map[x] = [];
        for(var y = 0;y<4;y++) {
          db.map[x][y] = 0;
        }
      }
      lc.addItemToMap();
      lc.addItemToMap();
    },
    initTouches(){
      wx.onTouchStart(function(e){
        if(db.state == 'result'){
          db.te.x = e.changedTouches[0].clientX;
          db.te.y = e.changedTouches[0].clientY;
        }
      })
      wx.onTouchEnd(function(e){
        if (db.state == 'result') {
          db.te.dx = e.changedTouches[0].clientX - db.te.x;
          db.te.dy = e.changedTouches[0].clientY - db.te.y;
          if (Math.abs(db.te.dx) > Math.abs(db.te.dy)){
            db.te.dx = db.te.dx / Math.abs(db.te.dx);
            db.te.dy = 0;
          }else{
            db.te.dy = db.te.dy / Math.abs(db.te.dy);
            db.te.dx = 0;
          }
          db.state = "touch";
        }
        if (db.state == "gameover") {
          db.state = "restart";
        }
      })
    }
  },
  init(){
    db.num = 0;
    db.score = 0;
    mc.cptInit.initTouches();
    mc.cptInit.initMap();
    rder.clear();
    rder.draw();
  },
  run(){
    switch(db.state){
    case "restart":
      mc.init();
      db.state = 'result';
      break;
    case "result":
      break;
    case "touch":
      db.state = 'animation'
      lc.getResult();
      break;
    case "animation":
      //ani.doAni();
      db.state = 'result'
      rder.clear();
      rder.draw();
      break;
    case "gameover":
      rder.gameover();
      break;
    }
    //requestAnimationFrame(mc.run);
  },
  start(){
    this.init();
    setInterval(this.run,80);
  }
}

mc.start();