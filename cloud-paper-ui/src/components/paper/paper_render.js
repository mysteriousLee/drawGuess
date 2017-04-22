
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
          // 这里需要设置 CSS 光标样式
          break;
        case 'rect': //矩形
        case 'ellipse': //椭圆
          this.corner = this.last;
          [this.duplicate, this.layer] = this.fork();
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
        case 'rect':
          this.layer.clearRect(0, 0, this.duplicate.width, this.duplicate.height);
          this.layer.strokeRect(this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
        case 'ellipse':
          this.layer.clearRect(0, 0, this.duplicate.width, this.duplicate.height);
          this.drawEllipse(this.layer, this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
      }
      this.last = this.current;
    }

    end () {
      switch(this.type) {
        case 'rect':
          this.context.strokeRect(this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
        case 'ellipse':
          this.drawEllipse(this.context, this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
      }
    }

    clear () {
      this.context.clearRect(0, 0, this.width, this.height);
    }


    fork () {
      let duplicate, layer;
      let that = this;
      // console.log(this);
      duplicate = document.createElement('canvas');
      duplicate.width = this.width;
      duplicate.height = this.height;
      duplicate.style.position = 'absolute';
      duplicate.style.left = this.canvas.getBoundingClientRect().left + 'px';
      duplicate.style.top = this.canvas.getBoundingClientRect().top + 'px';
      duplicate.style['z-index'] = 1;
      layer = duplicate.getContext('2d');
      layer.lineWidth = this.pencilSize;
      layer.strokeStyle = this.color;
      document.body.appendChild(duplicate);
      //console.log(duplicate,layer);
      duplicate.addEventListener('touchmove', this.move, {passive: false});
      document.addEventListener('touchend', function _self(e) {
        that.end(e);
        duplicate.removeEventListener('touchmove', that.move, {passive: false});
        document.removeEventListener('touchend', _self, {passive: false});
        document.body.removeChild(duplicate);
      }, {passive: false});

      duplicate.addEventListener('mousemove', this.move, {passive: false});
      document.addEventListener('mouseup', function _self(e) {
        that.end(e);
        duplicate.removeEventListener('mousemove', that.move, {passive: false});
        document.removeEventListener('mouseup', _self, {passive: false});
        document.body.removeChild(duplicate);
      }, {passive: false});

      return [duplicate, layer];
    }

    drawLine (context, first, last) {
      context.beginPath();
      context.moveTo(this.factor*first.x, this.factor*first.y);
      context.lineTo(this.factor*last.x, this.factor*last.y);
      context.stroke();
      context.closePath();
    }

    drawEllipse(context, x, y, a, b) {
      context.save();
      var r = (a > b) ? a : b;
      var ratioX = a / r;
      var ratioY = b / r;
      context.scale(ratioX, ratioY);
      context.beginPath();
      context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
      context.closePath();
      context.restore();
      context.stroke();
    }

  };
