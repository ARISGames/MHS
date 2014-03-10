var StrikeGame = function()
{
    var self = this; //JAVASCRIIIIIIPPPPPTTTTTTT!!!!!!!!

    var joinedPlayers = [];
    var numJoinedPlayers = 0;
    var timeTilStrike = 400;
    var numStrikersToWin = 5;

    var getInfoForSelf = function()
    {
        var i = new Image();
        i.src = 'assets/spinner.gif';
        i.id = 'strike_you_portrait_image';
        document.getElementById('strike_you_portrait').appendChild(i);
        i.src = "http://qrcode.kaywa.com/img.php?s=5&d=6116";
        var handlePlayerBackpackReceipt = function(data)
        {
            if(!data || !(imm.playerPicURL = JSON.parse(data).data.backpacks[0].owner.player_pic_url))
                imm.playerPicURL = "http://arisgames.org/server/gamedata/0/npc.png";

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
        var player = JSON.parse(data);
        if(player.timer < timeTilStrike) timeTilStrike = player.timer;
        if(joinedPlayers[player.id]) { joinedPlayers[player.id].heartbeat = 100; return; } //they are already a member
        if(imm.playerId != player.id && !joinedPlayers[imm.playerId]) return; //I'm not yet a member, and the joining member isn't me

        player.heartbeat = 100;
        player.image = new Image();
        player.image.onload = function() { player.image.onload = null; player.image.src = player.url; };
        player.image.src = 'assets/spinner.gif';
        player.image.className='strike_other_portrait';
        document.getElementById('strike_other_portraits').appendChild(player.image);

        joinedPlayers[player.id] = player;
        numJoinedPlayers++;
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
        c.context.lineWidth = 4;
        c.context.beginPath();
        c.context.arc(c.width/2, c.width/2, (c.width/2)-2, 0, 2*Math.PI, false);
        c.context.stroke();
        c.style.display = "block";

        setTimeout(timerTick, 200);
    };

    var timerTick = function()
    {
        c.context.clearRect(0,0,c.width,c.height);
        c.context.beginPath();
        c.context.arc(c.width/2, c.width/2, (c.width/2)-2, 1.5*Math.PI, 2*Math.PI*(timeTilStrike/100)+1.5*Math.PI, false);
        c.context.stroke();
        timeTilStrike--;

        if(timeTilStrike > 0) 
            setTimeout(timerTick, 200);
        else
        {
            c.context.clearRect(0,0,c.width,c.height);
            if(numJoinedPlayers < numStrikersToWin)
            {
                imv.displayFail("The strike has failed!");
                ARIS.setItemCount(imm.ITEM_ID_STRIKE_FAIL, 1);
            }
            else
            {
                imv.displayNotice("The strike has succeeded!");
                ARIS.setItemCount(imm.ITEM_ID_STRIKE_SUCCEED, 1);
            }
        }
    }

    this.events = ['STRIKE_REQUEST_HEARTBEATS','STRIKE_HEARTBEAT','STRIKE_LEFT'];
    this.callbacks = [strikeBeatRequested,strikeBeatDetected,strikeLeft];
}
