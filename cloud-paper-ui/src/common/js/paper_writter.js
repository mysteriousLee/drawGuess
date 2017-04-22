import { Position } from '@/common/js/libs'
export default class PaperWritter {
  constructor (obj) {
    this.width = obj.width;
    this.height = obj.height;
    this.lineWidth = obj.lineWidth || 1.0;
    this.color = obj.color || 'black';
    this.message = obj.message;
    obj.el.innerHTML = `<nav>
                  <select id="type">
                    <option value="1">铅笔</option>
                    <option value="2">橡皮</option>
                  </select>
                  <select id="size">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </nav>
                <canvas width="${this.width}" height="${this.height}"></canvas>`;
    let canvas = obj.el.querySelector('canvas');
    // 笔型
    let type = document.getElementById('type');
    // 笔的粗细
    let size = document.getElementById('size');
    this.type = type.value;
    this.size = size.value;
    this.init(canvas, type, size);
  }

  init (canvas, type, size) {
    let context = canvas.getContext('2d');
    let _self = this;
    // 记录上一次与本次事件的坐标
    let current, last;
    let start = function (e) {
      e.preventDefault();
      context.lineWidth = _self.lineWidth;
      context.color = _self.color;
      last = _self.getInfo(e);
      _self.message.push(last);
    };
    let move = function (e) {
      e.preventDefault();
      current = _self.getInfo(e);
      _self.message.push(current);
      context.beginPath();
      context.moveTo(last.x, last.y);
      context.lineTo(current.x, current.y);
      context.stroke();
      context.closePath();
      last = current;
    };
    let end = function (e) {
      e.preventDefault();
    };
    type.addEventListener('change', e => {
      this.type = e.target.value;
    });
    size.addEventListener('change', e => {
      this.size = e.target.value;
    });
    canvas.addEventListener('touchstart', function (e) {
      start(e);
      canvas.addEventListener('touchmove', move, {passive: false});
      canvas.addEventListener('touchend', function _self () {
        canvas.removeEventListener('touchmove', move, {passive: false});
        canvas.removeEventListener('touchend', _self, {passive: false});
      }, {passive: false});
    }, {passive: false});
    canvas.addEventListener('mousedown', function (e) {
      start(e);
      canvas.addEventListener('mousemove', move, {passive: false});
      canvas.addEventListener('mouseup', function _self () {
        canvas.removeEventListener('mousemove', move, {passive: false});
        canvas.removeEventListener('mouseup', _self, {passive: false});
      }, {passive: false});
    }, {passive: false});
  }

  getInfo (e) {
    let x, y;
    if (e.type.substring(0, 5) === 'touch') {
      x = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
      y = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
    } else {
      x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    }
    return new Position({
      width: this.width,
      height: this.height,
      timeStamp: e.timeStamp,
      type: e.type,
      x: x,
      y: y,
      pen: {
        type: this.type,
        size: this.size,
        color: 'black',
        opacity: 1
      }
    });
  }
};
