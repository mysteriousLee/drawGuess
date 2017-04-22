var express = require('express');
var sio		= require('socket.io');
var app     = express();
var server  = app.listen(3000 ,function(error){
    if(error) return console.log(error);
    console.log('OK');
});

global.IO = sio.listen(server);
global.IO.on('connection', function(socket){
    console.log(socket.request.headers);
});

app.use('/',(req,res)=>res.send('hello'));


var xhr =new XMLHttpRequest();
xhr.withCredentials =true;
xhr.open('GET','http://127.0.0.1:4000/token/create');
xhr.send();
xhr.addEventListener('load',function(){
    console.log(JSON.parse(this.responseText));
});



var socket =io('http://127.0.0.1:4000');
socket.emit('message','abc');









var token ='QR0K-PHPP-AWNK-TDBY';
var xhr =new XMLHttpRequest();
xhr.withCredentials =true;
xhr.open('GET','http://127.0.0.1:4000/websocket/connect/'+token);
xhr.send();
xhr.addEventListener('load',function(){
    console.log(JSON.parse(this.responseText));
});
var socket =io('http://127.0.0.1:4000');
socket.on('message',function(msg){
    alert(msg);
});

