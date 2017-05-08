
import PaperRender from './paper_render';
import DrawInfo from './lib';
export default class PaperWritter extends PaperRender {
    constructor(obj) {
      super();
      this.width  = obj.width;
      this.height = obj.height;
      this.callback = obj.callback;
      let node = document.createElement('canvas');
      node.width = this.width;
      node.height = this.height;
      obj.el.appendChild(node);
      this.canvas = node;
      this.type = 'pen'; //笔型
      this.pencilSize = 4; //笔的粗细
      this.eraserSize = 4; //橡皮的粗细
      this.color = '#000';
      this.factor = 1;
      this.init();
    }

    //writter 类的 start, move, end 是根据事件处理信息，然后调用基类的方法

    init () {
      let current, last; //记录上一次与本次事件的坐标
      let corner; //记录矩形起点
      let duplicate, layer; //第二个图层

      this.move = (e, last) => {
        e.preventDefault();
        this.current = this.getInfo(e);
        this.callback(this.current);
        super.move();
      };

      this.end = (e, last) => {
        e.preventDefault();
        this.current = this.getInfo(e, last);
        this.callback(this.current);
      };

      this.clear = () => {
        super.clear();
        this.current = this.getInfo();
        this.callback(this.current);
        this.type = 'pen';
      }

      this.bindCanvas();
    }

    bindCanvas () {
      this.context = this.canvas.getContext('2d');
      this.canvas.addEventListener('touchstart', e => {
        let that = this;
        e.preventDefault();
        this.last = this.getInfo(e);
        super.start();
        this.callback(this.last);
        this.canvas.addEventListener('touchmove', this.move, {passive: false});
        document.addEventListener('touchend', function _self(e) {
          that.end(e, that.last);
          that.canvas.removeEventListener('touchmove', that.move, {passive: false});
          document.removeEventListener('touchend', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
      this.canvas.addEventListener('mousedown', e => {
        let that = this;
        e.preventDefault();
        this.last = this.getInfo(e);
        super.start();
        this.callback(this.last);
        this.canvas.addEventListener('mousemove', this.move, {passive: false});
        document.addEventListener('mouseup', function _self(e) {
          that.end(e, that.last);
          that.canvas.removeEventListener('mousemove', that.move, {passive: false});
          document.removeEventListener('mouseup', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
    }

    getInfo (e, last) {
      let x, y;
      if (!e) {
        e = {};
        x = 0;
        y = 0;
        e.type = 'clear';
      } else if (e.type === 'touchend') { 
        x = this.last.x;
        y = this.last.y;
      } else if (e.type === 'mouseup') { 
        x = this.last.x;
        y = this.last.y;
      } else if (e.type.substring(0, 5) === 'touch') {
      	//获取相对于画布的位置
        x = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
      } else { //包含 mouse 事件与 click 事件
        x = e.clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.clientY - e.currentTarget.getBoundingClientRect().top;
      }
      return new DrawInfo({
        width: this.width,
        height: this.height,
        timeStamp: new Date(),
        type: e.type,
        x: x,
        y: y,
        pen: {
          type: this.type,
          pencilSize: this.pencilSize,
          eraserSize: this.eraserSize,
          color: this.color
        }
      });
    }
  };
