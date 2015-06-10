var SodHouseModel = function()
{
    var self = this;

    self.game_id = 0; 
    self.player = {};
    self.web_page_id = 0;

    self.currentLevel = 1;

    self.loadStateFromARIS = function(callback)
    {
        var bogusEndOfQueueId = 99999999; //Used to flag the end of the queue

        //Override to handle ARIS responses
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == bogusEndOfQueueId)
                callback();
        };

        ARIS.didReceivePlayer = function(player)
        {
            self.player = player;
        }

        var params = ARIS.parseURLParams(document.URL);
        self.game_id = parseInt(params.game_id);
        self.player.playerId = parseInt(params.playerId);
        self.web_page_id = parseInt(params.web_page_id);

        ARIS.getPlayer();
        ARIS.getItemCount(bogusEndOfQueueId); //Enqueued to signal the queue to 'get state' has sufficiently advanced
    }

	// FIXME dead?
    self.sendRequest = function(fn, callback)
    {
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET","http://arisgames.org/server/json.php/v1."+fn,true); 
        xmlhttp.onreadystatechange = function()
        {
            if(xmlhttp.readyState == 4&& xmlhttp.status == 200)
                callback(JSON.parse(xmlhttp.responseText).data);
        }
        xmlhttp.send();
    }
}

