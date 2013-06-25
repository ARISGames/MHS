var StrikeGame = function()
{
    var self = this; //JAVASCRIIIIIIPPPPPTTTTTTT!!!!!!!!

    this.handlePlayerBackpackReceipt = function(data)
    {
        console.log(data);
        if(!data || !(imm.playerPicURL = JSON.parse(data).data.backpacks[0].owner.player_pic_url))
            imm.playerPicURL = "http://arisgames.org/server/gamedata/0/npc.png";
        document.getElementById('strike_main_portrait').src = imm.playerPicURL;

        pm.sendData(imm.playerPicURL);
    }
    var reqObj = {
                    "gameId":imm.gameId,
                    "playerArray":[imm.playerId],
                    "items":false,
                    "attributes":false,
                    "notes":false
                };
    ARIS.callService("players.getPlayerBackpacksFromArray", this.handlePlayerBackpackReceipt, false, JSON.stringify(reqObj));

    this.joinStrike = function(data)
    {
        var i = new Image();
        i.src = data;
        document.getElementById('strike_joined_portraits').appendChild(i);
    }

    this.leaveStrike = function()
    {
    }


    this.events = ['STRIKE_JOINED','STRIKE_LEFT'];
    this.callbacks = [this.joinStrike,this.leaveStrike];
}
