var StrikeGame = function()
{
    var self = this; //JAVASCRIIIIIIPPPPPTTTTTTT!!!!!!!!

    var joinedPlayers = [];
    var timeTilStrike = 100;

    var getInfoForSelf = function()
    {
        var i = new Image();
        i.src = 'assets/spinner.gif';
        i.id = 'strike_you_portrait_image';
        document.getElementById('strike_you_portrait').appendChild(i);
        var handlePlayerBackpackReceipt = function(data)
        {
            if(!data || !(imm.playerPicURL = JSON.parse(data).data.backpacks[0].owner.player_pic_url))
                imm.playerPicURL = "http://arisgames.org/server/gamedata/0/npc.png";
            i.src = imm.playerPicURL;

            document.getElementById("strike_join_button").onclick = joinStrike;
        }
        var reqObj = {
                        "gameId":imm.gameId,
                        "playerArray":[imm.playerId],
                        "items":false,
                        "attributes":false,
                        "notes":false
                    };
        ARIS.callService("players.getPlayerBackpacksFromArray", handlePlayerBackpackReceipt, false, JSON.stringify(reqObj));
    }
    getInfoForSelf();

    var beatHeart = function()
    {
        pm.sendData("STRIKE_HEARTBEAT",JSON.stringify({"id":imm.playerId,"url":imm.playerPicURL,"timer":timeTilStrike}));
    }

    var joinStrike = function()
    {
        if(!imm.playerPicURL) return; //haven't yet gotten information about self
        beatHeart();
        document.getElementById('strike_join_button').style.display = "none";
        document.getElementById('strike_dont_button').style.display = "none";

        startTimer();
    }
    
    var strikeBeatRequested = function(data)
    {
        if(joinedPlayers[imm.playerId]) //if a member of the strike
            beatHeart();
    }

    var strikeBeatDetected = function(data)
    {
        console.log(data);
        var player = JSON.parse(data);
        if(player.timer < timeTilStrike) timeTilStrike = player.timer;
        if(joinedPlayers[player.id]) { joinedPlayers[player.id].heartbeat = 100; return; }

        console.log("new player");
        player.heartbeat = 100;
        player.image = new Image();
        player.image.onload = function() { console.log("loaded im"); player.image.onload = null; player.image.src = player.url; console.log("street");};
        player.image.src = 'assets/spinner.gif';
        player.image.className='strike_other_portrait';
        document.getElementById('strike_other_portraits').appendChild(player.image);

        joinedPlayers[player.id] = player;
        beatHeart(); //let the joiner know you are here
    }

    var strikeLeft = function(data)
    {
    }

    var c = document.getElementById('strike_timer');
    var startTimer = function()
    {
        c.context = c.getContext('2d');
        c.context.strokeStyle = 'black';
        c.context.beginPath();
        c.context.arc(c.width/2, c.width/2, (c.width/2)-2, 0, 2*Math.PI, false);
        c.context.lineWidth = 4;
        c.context.stroke();
        c.style.display = "block";

        setTimeout(timerTick, 200);
    };

    var timerTick = function()
    {
        c.context.clearRect(0,0,c.width,c.height);
        console.log(timeTilStrike);
        c.context.arc(c.width/2, c.width/2, (c.width/2)-2, 0, 2*Math.PI*(timeTilStrike/100), false);
        timeTilStrike--;

        if(timeTilStrike > 0) 
            setTimeout(timerTick, 200);
    }

    this.events = ['STRIKE_REQUEST_HEARTBEATS','STRIKE_HEARTBEAT','STRIKE_LEFT'];
    this.callbacks = [strikeBeatRequested,strikeBeatDetected,strikeLeft];
}
