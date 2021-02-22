import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.sass']
})

export class SnakeComponent implements OnInit {
  game:snake_game=new snake_game(80,80)
  constructor() { }
  ngOnInit(): void {
    setInterval(()=>this.game.run(),100)
  }
  onKey(event: any){
    var code;
    code = event.keyCode;
    if(code<=40 &&code>=37){
      this.game.snakeMove=code;
      return false;
    }
    if(code==32){
      this.game.start()
      return false;
    }
  }
}
class map{
  x_max:number;
  y_max:number;
  maps:Array<Array<number>>;
  constructor(
    x_max:number,
    y_max:number,
    init_color:number
    )
    {
      this.x_max=x_max;
      this.y_max=y_max;
      this.maps=new Array<Array<number>>(0);
      for(var x=0;x<x_max;x++){
        this.maps.push(new Array<number>(y_max));
      }
      this.clear(init_color);
    }
  check(x:number,y:number){
    return 0<=x && 0<=y && x<this.x_max && y<this.y_max;
  }
  clear(init_color:number){
    for(var x=0;x<this.x_max;x++){
      for(var y=0;y<this.y_max;y++){
        this.maps[x][y]=init_color
      }
    }
  }
}

let BLOCK_SNAKE_HED=0xf0f;
let BLOCK_SNAKE_BODY=0x1f1;
let BLOCK_ESA=0xf00;
let BLOCK_NULL=0x000;

function pointCopy(a:[number,number]):[number,number]{
  return [a[0],a[1]]
}
class snake_game extends map{
  snakeMove:40|39|38|37=40;
  snakePoint:[number,number];
  snakeBody:Array<[number,number]|null>=[];
  esas:Array<[number,number]>=[];
  gameStatus:"stop"|"run"|"gameover"="stop";
  esaTimer:number=0;
  constructor(
    x_max:number,
    y_max:number
    ){
      super(x_max,y_max,BLOCK_NULL);
      this.init()
    }
  run(){
    if(this.gameStatus!=="run")return false;
    let oldSnakePoint:[number,number]= pointCopy(this.snakePoint);
    if(this.snakeMove==37){       this.snakePoint[0]--;
    }else if(this.snakeMove==38){ this.snakePoint[1]--;
    }else if(this.snakeMove==39){ this.snakePoint[0]++;
    }else if(this.snakeMove==40){ this.snakePoint[1]++;
    }
    if(this.check(this.snakePoint[0],this.snakePoint[1]))
    {
      let idx_esa:number=this.esas.findIndex((a)=>a&&a[0]===this.snakePoint[0]&&a[1]===this.snakePoint[1]);
      let idx_body:number=this.snakeBody.findIndex((a)=>a&&a[0]===this.snakePoint[0]&&a[1]===this.snakePoint[1]);
      if(idx_body>=0){
        this.gameOver();
      }
      if(idx_esa>=0){
        this.snakeBody.push(null);
        delete this.esas[idx_esa];
      }
      if(this.snakeBody.length){
        this.snakeBody.shift()
        this.snakeBody.push(oldSnakePoint)
  
      }
      this.setEsa();
      this.view();
    }else{
      this.gameOver();
    }
  }
  view(){
    this.clear(BLOCK_NULL);
    this.maps[this.snakePoint[0]][this.snakePoint[1]]=BLOCK_SNAKE_HED;
    this.snakeBody.forEach(a=>a&&(this.maps[a[0]][a[1]]=BLOCK_SNAKE_BODY))
    this.esas.forEach(a=>a&&(this.maps[a[0]][a[1]]=BLOCK_ESA))
  }
  init(){
    this.snakePoint=[Math.round(this.x_max/2),Math.round(this.y_max/2)];
    this.esaTimer=0;
    this.snakeBody=[];
    this.esas=[];
    this.gameStatus="stop";
  }
  start(){
    this.init();
    this.gameStatus="run";
  }
  checkObjects(p:[number,number]){
    if(this.snakePoint[0]==p[0]&&this.snakePoint[1]==p[1])return false;
    if(this.esas.find((a)=>a[0]===this.snakePoint[0]&&a[1]===this.snakePoint[1]))return false
    if(this.snakeBody.find((a)=>a&&a[0]===this.snakePoint[0]&&a[1]===this.snakePoint[1]))return false;
    return true;
  }
  setEsa(){
    if(--this.esaTimer<0){
      this.esaTimer=10;
      this.esas.push([
        Math.floor(Math.random()*Math.floor(this.x_max)),
        Math.floor(Math.random()*Math.floor(this.y_max))  
      ]);
    }
  }
  gameOver(){
    this.gameStatus="gameover";
  }
  getPoint(){
    return this.snakeBody.length;
  }
}