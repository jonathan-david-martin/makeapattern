/**
 * Created by jonathanmar on 12/25/16.
 */

var hostname = '0.0.0.0';
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
app.use(express.static(__dirname));

var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

//var io = require('socket.io')({
//    transports  : [ 'websocket' ]
//});

//io(server);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

var players = [];

var player = function(x,y,angle,socketid){
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.socketid = socketid;
    
}

//placeholder - this function will just loop through players looking for a matching socket id
var idLookup = function(id,playersArray){
    
}


io.on('connection', function(socket) {
    //console.log('connection');
    //console.log('here is the socket id:' + socket.id);
    
    socket.on('phaser create function initiated', function(msg){
        
        newplayer = new player(400,100,0,socket.id);
        players.push(newplayer);
        io.emit('server knows phaser create initiated', players);
        //console.log(players);
        
    });

    socket.on('left', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].x -= 5;
                players[i].angle = 180;
            }
        }
        io.emit('update',players);
    });

    socket.on('right', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].x += 5;
                players[i].angle = 0;
            }
        }
        io.emit('update',players);
    });

    socket.on('up', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].y -= 5;
                players[i].angle = 270;
            }
        }
        io.emit('update',players);
    });

    socket.on('down', function(msg){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == msg){
                players[i].y += 5;
                players[i].angle = 90;
            }
        }
        io.emit('update',players);
    });

    socket.on('disconnect',function(){
        for(i=0;i<players.length;i++){
            if(players[i].socketid == socket.id){
                players[i].x = -999;
                players[i].y = -999;
            }
        }
        var disconnectedUsers = 0;
        for(i=0;i<players.length;i++){
            if(players[i].x == -999){
                disconnectedUsers++;
            }

        }
        if(disconnectedUsers == players.length){
            //console.log("players.length:" + players.length + " disconnected users:" + disconnectedUsers)
            players = [];
        }
        io.emit('update',players);

    });



});




server.listen(port, hostname, function(){
    console.log('listening on ' + hostname + ':' + port);
});
