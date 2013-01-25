var IronMineModel = function()
{
    //Note-
    //The reason things are of the form:
    //var a = x; this.a = 1;
    //is because I want these variables to be public, but like the convenience of accessing them as local variables as well.
    //**MUST BE CAREFUL NOT TO DO THIS WITH PRIMITIVES THAT CHANGE!**
    
    var self = this; //ugh, javascript...
    
    //Constants
    //  Station Types
    var STATION_TYPE_DRILL = 0;     this.STATION_TYPE_DRILL = STATION_TYPE_DRILL;
    var STATION_TYPE_DYNAMITE = 1;  this.STATION_TYPE_DYNAMITE = STATION_TYPE_DYNAMITE;
    var STATION_TYPE_BACKER = 2;    this.STATION_TYPE_BACKER = STATION_TYPE_BACKER;
    
    //  Station Category->Id relations
    var STATION_IDS = [];
    STATION_IDS[STATION_TYPE_DRILL] = [1151,1152,1153,1154]; //All webpage/station Id's of type 'drill'
    STATION_IDS[STATION_TYPE_DYNAMITE] = [1155,1156]; //All webpage/station Id's of type 'dynamite'
    STATION_IDS[STATION_TYPE_BACKER] = [1160]; //All webpage/station Id's of type 'backer'
    this.STATION_IDS = STATION_IDS;
    
    //  Station Id->Category relations (populated with above info)
    var STATION_TYPES = [];
    for(var i in STATION_IDS[STATION_TYPE_DRILL])    STATION_TYPES[STATION_IDS[STATION_TYPE_DRILL][i]] = STATION_TYPE_DRILL;
    for(var i in STATION_IDS[STATION_TYPE_DYNAMITE]) STATION_TYPES[STATION_IDS[STATION_TYPE_DYNAMITE][i]] = STATION_TYPE_DYNAMITE;
    for(var i in STATION_IDS[STATION_TYPE_BACKER])   STATION_TYPES[STATION_IDS[STATION_TYPE_BACKER][i]] = STATION_TYPE_BACKER;
    this.STATION_TYPES = STATION_TYPES;

    var LEVEL_IDS = [17247,17248,17249,17250]; this.LEVEL_IDS = LEVEL_IDS;
    var LEVEL_COMPLETE_IDS = [17269,17270,17271]; this.LEVEL_COMPLETE_IDS = LEVEL_COMPLETE_IDS;
    var LEVEL_GOALS = [100, 200, 300]; this.LEVEL_GOALS = LEVEL_GOALS;
    var ITEM_IDS = [17251];  this.ITEM_IDS = ITEM_IDS;
    
    //From URL
    this.gameId;
    this.playerId;
    this.webPageId;
    
    //State
    this.stationType;//One of STATION_TYPE_ enums
    this.stationId;//Same as webPageId, but more functionally named (identifies one drill from another...)
    
    //Personal
    this.currentLevel = 0;
    this.completeLevel = 0;
    this.money = 0;
    
    this.loadStateFromARIS = function()
    {
        var bogusEndOfQueueId = 99999999; //Used to flag the end of the queue

        //Override to handle ARIS responses
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == bogusEndOfQueueId)
            {
                if(self.currentLevel <= self.completeLevel) { ARIS.setItemCount(LEVEL_IDS[self.completeLevel],1); self.currentLevel = self.completeLevel+1; }
                if(self.currentLevel < 4)
                    imv.wantDisplay.innerHTML = 'GOAL: $'+((LEVEL_GOALS[self.currentLevel-1]-(LEVEL_GOALS[self.currentLevel-1]%100))/100)+'.'+(LEVEL_GOALS[self.currentLevel-1]%100 < 10 ? '0' : '')+(LEVEL_GOALS[self.currentLevel-1]%100);
                else
                    self.wantDisplay = "";
                initGame(self.stationType); //All requests have completed; ARIS state is known. Init games.
            }

            for(var i in LEVEL_IDS)
                if(qty > 0 && updatedItemId == LEVEL_IDS[i] && i >= self.currentLevel) self.currentLevel = parseInt(i)+1;
            for(var i in LEVEL_COMPLETE_IDS)
                if(qty > 0 && updatedItemId == LEVEL_COMPLETE_IDS[i] && i >= self.completeLevel) self.completeLevel = parseInt(i)+1;
            for(var i in ITEM_IDS)
                if(qty > 0 && updatedItemId == ITEM_IDS[i])
                {
                    self.money = qty;
                    //Formats money as '$x.xx' for all edge cases
                    imv.haveDisplay.innerHTML = '$'+((self.money-(self.money%100))/100)+'.'+(self.money%100 < 10 ? '0' : '')+(self.money%100);
                }
        }
    
        var params = ARIS.parseURLParams(document.URL);
        self.gameId = parseInt(params.gameId);
        self.playerId = parseInt(params.playerId);
        self.webPageId = parseInt(params.webPageId);
    
        self.stationId = self.webPageId;
        self.stationType = STATION_TYPES[self.stationId];
    
        for(var i in ITEM_IDS)
            ARIS.getItemCount(ITEM_IDS[i]);
        for(var i in LEVEL_IDS)
            ARIS.getItemCount(LEVEL_IDS[i]);
        for(var i in LEVEL_COMPLETE_IDS)
            ARIS.getItemCount(LEVEL_COMPLETE_IDS[i]);
            
        //On dequeue of this ID, we will know that all prior enqueued information has been recieved.
        ARIS.getItemCount(bogusEndOfQueueId); 
    }
}
