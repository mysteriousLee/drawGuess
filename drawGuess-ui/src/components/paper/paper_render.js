export default class PaperRender {
    constructor() {}

    init (canvas) {
      const context = canvas.getContext('2d');
      let current, last; //记录上一次与本次事件的坐标
      let corner; //记录矩形起点
    }

    //基类的 start, move, end 是根据信息进行操作

    start () {
      this.context.lineWidth = this.pencilSize;
      this.context.strokeStyle = this.color;
      switch (this.type) {
        case 'pen': //画笔
          break;
        case 'eraser': //橡皮
          this.corner = this.last;
          break;
      }
    }

    move () {
      // console.log(last.x, last.y, current.x, current.y);
      switch (this.type) {
        case 'pen':
          this.drawLine(this.context, this.last, this.current);
          break;
        case 'eraser':
          this.context.clearRect(this.current.x*this.factor, this.current.y*this.factor, this.eraserSize*10*this.factor, this.eraserSize*10*this.factor);
          break;
      }
      this.last = this.current;
    }

    clear () {
      this.context.clearRect(0, 0, this.width, this.height);
    }

    drawLine (context, first, last) {
      context.beginPath();
      context.moveTo(this.factor*first.x, this.factor*first.y);
      context.lineTo(this.factor*last.x, this.factor*last.y);
      context.stroke();
      context.closePath();
    }


  };