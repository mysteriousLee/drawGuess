<template>
  <div class="show-page">
    <main class="container" id="room">
      <header class="header">
        <div class="header__warp">
          <span>
            <router-link to="/index-page">☁你画我猜</router-link>
          </span>
          <span class="header__warp--living">房间正在直播中</span>
        </div>
      </header>
      <footer class="guessBar">
        <div class="ownerSub" v-if="this.id==='owner'">
          <span v-text="ownerData"></span>
        </div>
        <div class="hostSub" v-else>
          <span v-text="hostData"></span>
          <input type="text" placeholder="请输入答案" v-model="answer">
          <input type="button" name="" value="发送" v-on:click="checkAns">
        </div>
      </footer>
      <section class="paint" id="paint" ref="paint">
        <div class="paint__tools--cursor">
          <img src="./pointPencil.png"  ref="cursorPencil">
          <img src="./pointEraser.png"  ref="cursorEraser">
        </div>
        <div class="paint-board" ref="paintBoard">
          <section @mousemove.stop="mouseFollow">
            <paper-writter v-if="this.id==='owner'"
                           ref="paperWritter"
                           :width="paperWidth"
                           :height="paperHeight"
                           :type="drawType"
                           :pencilSize="pencilSize"
                           :eraserSize="eraserSize"
                           :color="drawColor"
                           @draw="sendDrawEvent2ServerUseSocket"
            ></paper-writter>
            <paper-reader v-if="this.id==='host'"
                          ref="paperReader"
                          :width="paperWidth"
                          :height="paperHeight"
            ></paper-reader>
          </section>
        </div>
        <aside class="paint__tool" v-if="this.id==='owner'">
          <ul>
            <li @click="adjust($event,'pencil')">
              <img src="./pencil.png">
              <div class="slider__range--container pencil" :class="{active: pencilShow}">
                <input class="slider__vertical" type="range" min="1" max="6" v-model="pencilSize"/>
                <div class="colorpicker"></div>
              </div>
            </li>
            <li @click="adjust($event,'eraser')">
              <img src="./eraser.png">
              <div class="slider__range--container eraser" :class="{active: eraserShow}">
                <input class="slider__vertical" type="range" min="1" max="6" v-model="eraserSize"/>
              </div>
            </li>
            <li @click="clearCanvas">
              <img src="./clean.png">
            </li>
          </ul>
        </aside>
      </section>
    </main>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  import * as type from '@/store/mutation-types'
  import PaperWritter from '../paper/paper-writter.vue';
  import PaperReader from '../paper/paper-reader.vue';
  import serverPath from '@/server-path';
  export default {
    name: 'show-page',
    data () {
      return {
        socket: '',
        reader: '',
        pencilShow: false,
        eraserShow: false,
        circleShow: false,
        rectangleShow: false,
        widthDiff: '',
        pencilSize: 4,
        eraserSize: 4,
        drawType: 'pen',
        drawColor: null,
        roomId: 0,
        ownerData: '',
        hostData: '',
        answer: '',
        paperHeight: 0,
        paperWidth: 0
      }
    },
    mounted () {
      this.roomId = this.$route.query.id;this.initPaperBoard();
      this.$nextTick(() => {
        // 等待vuex数据更新
        let time = setInterval(() => {
          if (this.id !== '') {
            clearInterval(time);
            this.justify();
            this.initColorBoard();
          } 
        }, 200)
      })
    },
    watch: {
      //owner的画板数据改变实时传输
      // sendMessage (newValue) {
      //   console.log(newValue);
      //   this.socket.emit('message', JSON.stringify(newValue));
      // },
      // // host的画板数据实时接收
      // getMessage (newValue) {
      //   this.reader.message = newValue;
      //   this.reader.draw();
      // },
      // 改变笔刷大小
      pencilSize (newValue) {
        this.$refs['cursorPencil'].style.height = `${newValue * 10}px`;
        this.$refs['cursorPencil'].style.width = `${newValue * 10}px`;
      },
      // 改变橡皮大小
      eraserSize (newValue) {
        this.$refs['cursorEraser'].style.height = `${newValue * 10}px`;
        this.$refs['cursorEraser'].style.width = `${newValue * 10}px`;
      }
    },
    computed: {
      ...mapState({
        id: (state) => state.id,
        token: (state) => state.token
      })
    },
    methods: {
      clearCanvas () {
        this.$refs.paperWritter.clear();
      },
      // 初始化画板
      initColorBoard () {
        for (let em of $('.colorpicker')) {
          $(em).ClassyColor({
            color: '#A98C61',
            colorSpace: 'rgb',
            labels: true,
            staticComponents: true,
            displayColor: 'css',
          }).on('newcolor',(event,data)=>{
            this.drawColor = data.toString();
          });
        }
      },
      initPaperBoard () {
        let screenHeight = window.innerHeight;
        let screenWidth = window.innerWidth;
        this.paperHeight = 0.8 * screenHeight;
        this.paperWidth = 0.9 * screenWidth;
      },
      // 调整画笔和橡皮大小事件
      adjust (event, name) {
        let elt = event.target;
        while(elt.tagName.toLowerCase() !== 'body'){
          if(elt.className.indexOf('slider__range--container') !== -1){
            return;
          };
          elt = elt.parentNode;
        }
        switch (name) {
          case 'pencil':
            this.drawType = 'pen';
            this.pencilShow = !this.pencilShow;
            this.eraserShow = false;
            this.circleShow = false;
            this.rectangleShow = false;
            this.paint = true;
            break;
          case 'eraser':
            this.drawType = 'eraser';
            this.eraserShow = !this.eraserShow;
            this.pencilShow = false;
            this.circleShow = false;
            this.rectangleShow = false;
            this.paint = false;
            break;
        }
      },
      //鼠标跟随移动
      mouseFollow (event) {
        event.preventDefault();
        event.stopPropagation();
        this.widthDiff = (window.innerWidth - this.$refs['paint'].offsetWidth) / 2;
        if (this.widthDiff < 0) {
          this.widthDiff = 0;
        }
        let topX = event.clientY - 125;
        let leftX = event.clientX - this.widthDiff;
        if (this.drawType == 'pen' && this.id !== 'host') {
          let penHeight = this.$refs['cursorPencil'].height;
          this.$refs['cursorEraser'].style.display = 'none';
          this.$refs['cursorPencil'].style.display = 'block';
          this.$refs['cursorPencil'].style.top = `${topX - penHeight - 1}px`;
          this.$refs['cursorPencil'].style.left = `${leftX}px`;
          this.$refs['paintBoard'].style.cursor = 'none';
        } else if (this.drawType == 'eraser' && this.id !== 'host') {
          let eraHeight = this.$refs['cursorEraser'].height;
          this.$refs['cursorEraser'].style.display = 'block';
          this.$refs['cursorPencil'].style.display = 'none';
          this.$refs['cursorEraser'].style.top = `${topX - eraHeight - 2}px`;
          this.$refs['cursorEraser'].style.left = `${leftX}px`;
          this.$refs['paintBoard'].style.cursor = 'none';
        } else if(this.id !== 'host'){
          this.$refs['paintBoard'].style.cursor = 'pointer';
          this.$refs['cursorEraser'].style.display = 'none';
          this.$refs['cursorPencil'].style.display = 'none';
        }
      },
      // 向服务器发送数据
      sendDrawEvent2ServerUseSocket () {
        this.socket.emit('message',...arguments);
        //console.log(...arguments);
      },
      // 判断房主还是宾客
      justify () {
        let url = serverPath;;
        let socket = io.connect(url);
        this.socket = socket;
        if (this.id === 'owner') {
          //如果是房主就申请题目放到global.data里并且返回题目
          this.setSubject();
          socket.on('checkmsg', (data) => {
            if (data === 'success') {
              console.log('有人答对了！');
              this.setSubject();
            } else{
              console.log('有人答错了！');
            }
          });
        } else if (this.id === 'host') {
          this.getSubject();
          this.$refs['cursorEraser'].style.display = 'none';
          this.$refs['cursorPencil'].style.display = 'none';
          let that = this;
          socket.on('message', (data) => {
            if(that.$refs.paperReader) {
              that.$refs.paperReader.dispatch(data);
            }
          });
          socket.on('checkmsg', (data) => {
            if(data === 'success') {
              setTimeout(() => {
                this.getSubject();
              },200);
            }
          })
        }
      },
      getSubject () {
          let url = serverPath + '/subject/get/' + this.roomId;
          axios.get(url,{withCredentials:true}).then((res, req) => {
            console.log(res.data);
            if (res.data.errcode === 0) {
                this.hostData = res.data.des;
            } else {
              console.log('error');
            }
          });
      },
      setSubject () {
        let url = serverPath + '/subject/set/' + this.roomId;
        axios.get(url,{withCredentials:true}).then((res, req) => {
          console.log(res.data);
          if (res.data.errcode === 0) {
            this.ownerData = res.data.des + ":" + res.data.ans;
          } else {
            console.log('error');
          }
        });
      },
      checkAns () {
        let url = serverPath + '/subject/check/' + this.answer +"/" + this.roomId;
        axios.get(url,{withCredentials:true}).then((res, req) => {
          if (res.data.errcode === 0) {
            this.socket.emit('checkmsg',{'msg': 'success','token': document.cookie});
            this.answer = '';
            console.log("你答对了哦");          
          } else {
            this.socket.emit('checkmsg',{'msg': 'error','token': document.cookie});
            console.log("你答错了哦");
            this.answer = '';
          }
        });
      }
    },
    components:{
      'paper-reader':PaperReader,
      'paper-writter':PaperWritter,
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .show-page
  // 房间页样式文件
    button, input
      border: none
      outline: none
      background: none
      font-family: 'Open Sans', Helvetica, Arial, sans-serif
    button
      display: block
      margin: 0 auto
      width: 30vw
      height: 36px
      border-radius: 30px
      color: #fff
      font-size: 15px
      font-weight bold
      cursor: pointer
      padding 0
    a, input
      color: #fff
    #room
      &.container
        overflow: hidden
        position: relative
        background: #fff
      .header
        width: 100vw
        background: #d4af7a
        height: 70px
      .header__warp
        max-width: 1024px
        margin: 0 auto
        height: 100%
        position: relative
        span
          line-height: 70px
        & > span
          padding: 0 20px
          font-size: 1.5em
          color: #FAF7F1
      span
        &.header__warp--living
          font-size: .8em
          &::before
            content: ''
            position: relative
            background: green
            width: 10px
            height: 10px
            border-radius: 50%
            display: inline-block
            margin-right: 10px
        &.header__warp--stopping
          font-size: .8em
          &::before
            content: ''
            position: relative
            background: red
            width: 10px
            height: 10px
            border-radius: 50%
            display: inline-block
            margin-right: 10px
        &.header__warp--sharing
          float: right
          height: 40px
          width: 40px
          padding: 0
          border-radius: 50%
          position: absolute
          right: 0
          top: 50%
          transform: translate3d(0, -50%, 0)
          border: 2px solid #FAF7F1
          margin-right: 20px
          box-sizing border-box
          &:hover
            cursor: pointer
            background: rgba(204, 204, 204, 0.4)
            border-color: rgba(255, 255, 255, 1)
          img
            width: 60%
            height: 60%
            position: absolute
            top: 50%
            left: 50%
            transform: translate3d(-55%, -55%, 0)
      div
        .header__warp--dropdown
          transition: all .2s ease-in
          position: absolute
          z-index: 2
          background: white
          border-radius: 5px 5px 5px 5px
          right: 15px
          height: 200px
          width: 400px
          transform-origin 400px 0
          animation show .5s 
          @keyframes show
            0%
              transform scale(0)
            100%
              transform scale(1)
          &.share-show-leave-active
            transition transform .5s ease-in-out
          &.share-show-leave-active
            transform scale(0)
          .dropdown--cover
            width: 100%
            height: 100%
            border-radius: 5px 5px 5px 5px
            background: rgba(231, 210, 180, 0.5)
          &::before
            position: absolute
            right: 10px
            transform: translate3d(0, -100%, 0)
            content: ''
            border: 15px solid rgba(231, 210, 180, 0.5)
            border-color: transparent transparent rgba(231, 210, 180, 0.5) transparent
      .dropdown--container
        text-align: center
        position: absolute
        width: 400PX
        top: 50%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
        color: #C72
        .dropdown--token
          border: 2px solid white
          border-radius: 5px
          width: 60%
          margin: 19px auto
          line-height: 1.5em
          background: rgba(204, 204, 204, .5)
          color: white
          box-shadow: 0 0 5px #ccc
          box-sizing border-box
          font-weight bold
          #key
            width 100%
            text-align center
        .dropdown--copy
          box-shadow: 0 0 5px white
          background: #d4af7a
          width: 50%
          box-sizing border-box
      .paint
        margin 5px auto
        display: block
        position relative
        border-radius: 10px;

        box-shadow: 0 0 15px #ccc
        .paint-board
          cursor: none
          .read, .write
            display inline-block
            vertical-align top
          .read
            canvas
              margin-top 27px
        .paint__tool
          width: 50px
          background: white
          position: absolute
          right: 20px
          top: 20px
          -webkit-box-shadow: 0 0 15px #ccc
          box-shadow: 0 0 15px #ccc
          opacity: .87
          border-radius: 10px
          ul
            list-style: none
          li
            &:first-child
              border-bottom: 1px solid rgba(204, 204, 204, 0.8)
            &:hover
              cursor: pointer
              background: rgba(204, 204, 204, 0.2)
              img
                animation-duration: 800ms
                animation-name: jump
                animation-timing-function: ease-in-out
                animation-delay: 0
                animation-iteration-count: infinite
            width: 50px
            height: 50px
            img
              width: 30px
              height: 30px
              margin: 10px
              position: relative
              top: 0px;
    @keyframes jump
      33%
        top: 0px
      66%
        top: -8px
      100%
        top: 0px
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #room {
    .paint {
      .paint__tools--cursor {
        position: relative;
        img{
          position: absolute;
          top: 0;
          left: 0;
          display: none;
          height: 40px;
          width: 40px;
        }
      }
      .paint__tool {
        width: 50px;
        background: white;
        position: absolute;
        right: 20px;
        top: 20px;
        -webkit-box-shadow: 0 0 15px #ccc;
        box-shadow: 0 0 15px #ccc;
        opacity: .87;
        border-radius: 10px;
        ul {
          list-style: none;
        }
        li {
          position: relative;
          &:not(:last-child) {
            border-bottom: 1px solid rgba(204, 204, 204, 0.8);
          }
          &:hover {
            cursor: pointer;
            background: rgba(204, 204, 204, 0.2);
            img {
              animation-duration: 800ms;
              animation-name: jump;
              animation-timing-function: ease-in-out;
              animation-delay: 0; // animation-iteration-count: infinite;
            }
          }
          width: 50px;
          height: 50px;
          img {
            width: 30px;
            height: 30px;
            margin: 10px;
            position: relative;
            top: 0px;
          }
          .slider__range--container {
            position: absolute;
            border-radius: 15px;
            border: 2px solid transparent;
            top: 0px;
            left: -45px;
            height: 231px;
            width: 30px; // background: #DABA8C;
            display none
            .colorpicker {
              position: absolute;
              width: 30px;
              border-radius: 50%;
              height: 30px;
              background: rgba(169, 140, 97, 0.5);
              right: -1px;
              bottom: -7px;
              box-shadow: 0 0 25px #ccc;
              &.ClassyColor {
                font-size: 4px !important;
              }
            }
            &.active {
              display: block;
            }
            &::after {
              position: absolute;
              z-index: -1;
              right: -18px;
              top: 15px;
              content: '';
              border: 10px solid #d4af7a;
              border-color: transparent transparent transparent #d4af7a;
            }
            input[type=range] {
              position: absolute;
              left: -87px;
              top: 82px;
              transform: rotate(90deg);
              -webkit-appearance: none;
              width: 200px;
            }
            input[type=range]:focus {
              outline: none;
            }
            input[type=range]::-webkit-slider-runnable-track {
              width: 100%;
              height: 30px;
              cursor: pointer;
              box-shadow: 0 0 25px #ccc;
              background: #d4af7a;
              border-radius: 15px;
            }
            input[type=range]::-webkit-slider-thumb {
              box-shadow: 0px 0px 5px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
              border: 1.2px solid rgba(204, 204, 204, 0.57);
              height: 30px;
              width: 30px;
              border-radius: 15px;
              background: rgba(255, 255, 255, 0.5);
              cursor: pointer;
              -webkit-appearance: none;
            }
          }
        }
      }
    }
  }
  .guessBar{
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      .ownerSub {
        width: 100%;
        position: relative;
        span{
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          text-align: center;
          transform: translate(-50%,50%);
          font-size: 20px;
          color: #D4AF7A;
          font-weight: bold;
        }
      }
       .hostSub{
        height: 100%;
        width: 500px;
        margin: 0 auto;
        span{
          font-size: 20px;
          color: #D4AF7A;
          font-weight: bold;
        }
        input[type="button"]{
          color: #D4AF7A;
          border: 1px solid #D4AF7A;
          border-radius: 6px;
          width: 50px;
          height: 30px;
        }
        input[type="button"]:hover{
          color: #fff;
          background-color: #D4AF7A;
        }
        input[type="text"]{
          color: #000;
          border: 1px solid #ccc;
          border-radius: 10px;
          height: 30px;
        }
       }
    }
</style>
