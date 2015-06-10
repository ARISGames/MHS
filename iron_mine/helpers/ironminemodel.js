var webPageId = itemId = function(number) { return number; };

var IronMineModel = function()
{
    var self = this; //ugh, javascript...

    //Constants
    //  Station Types
    self.STATION_TYPE_DRILL = 0;
    self.STATION_TYPE_DYNAMITE = 1;
    self.STATION_TYPE_BACKER = 2;
    self.STATION_TYPE_STRIKE = 3;

    //  Station Category->Id relations
    self.STATION_IDS = {};
    self.STATION_IDS[self.STATION_TYPE_DRILL]    = [webPageId(6926),webPageId(6866),webPageId(6869),webPageId(6872),webPageId(6875)]; //All webpage/station Id's of type 'drill'
    self.STATION_IDS[self.STATION_TYPE_DYNAMITE] = [webPageId(6929),webPageId(6878),webPageId(6881)]; //All webpage/station Id's of type 'dynamite'
    self.STATION_IDS[self.STATION_TYPE_BACKER]   = [webPageId(6932),webPageId(6884)]; //All webpage/station Id's of type 'backer'
    self.STATION_IDS[self.STATION_TYPE_STRIKE]   = [webPageId(6935),webPageId(6923)]; //All webpage/station Id's of type 'strike'

	// Half of these numbers get replaced so the new game can talk to the v1 station IDS (which corresponded to the v1 game objects)
	// Left value: New v2 web page, right: v1 web page (and Pusher channel ID)
	self.PUSHER_ID_MAP = {};

	// Drills
	self.PUSHER_ID_MAP[webPageId(6926)] = 3545;
	self.PUSHER_ID_MAP[webPageId(6866)] = 1151;
	self.PUSHER_ID_MAP[webPageId(6869)] = 1152;
	self.PUSHER_ID_MAP[webPageId(6872)] = 1153;
	self.PUSHER_ID_MAP[webPageId(6875)] = 1154;

	// Dynamite
	self.PUSHER_ID_MAP[webPageId(6929)] = 3548;
	self.PUSHER_ID_MAP[webPageId(6878)] = 1155;
	self.PUSHER_ID_MAP[webPageId(6881)] = 1156;

	// Backer
	self.PUSHER_ID_MAP[webPageId(6932)] = 3555;
	self.PUSHER_ID_MAP[webPageId(6884)] = 1160;

	// Strike
	self.PUSHER_ID_MAP[webPageId(6935)] = 3556;
	self.PUSHER_ID_MAP[webPageId(6923)] = 3031;


    //  Station Id->Category relations (populated with above info)
    self.STATION_TYPES = {};
    for(var i in self.STATION_IDS[self.STATION_TYPE_DRILL])    self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_DRILL][i]]    = self.STATION_TYPE_DRILL;
    for(var i in self.STATION_IDS[self.STATION_TYPE_DYNAMITE]) self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_DYNAMITE][i]] = self.STATION_TYPE_DYNAMITE;
    for(var i in self.STATION_IDS[self.STATION_TYPE_BACKER])   self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_BACKER][i]]   = self.STATION_TYPE_BACKER;
    for(var i in self.STATION_IDS[self.STATION_TYPE_STRIKE])   self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_STRIKE][i]]   = self.STATION_TYPE_STRIKE;

    self.LEVEL_IDS =   [itemId(37577),itemId(37580),itemId(37583)];
    self.LEVEL_GOALS = [200, 200, 1000];

    self.ITEM_ID_MONEY    = itemId(37586);
    self.ITEM_ID_ORE      = itemId(37973); self.oreWorth = 10;
    self.ITEM_ID_DRILL    = itemId(37709);
    self.ITEM_ID_ANTON    = itemId(37772);
    self.ITEM_ID_DYNAMITE = itemId(37784);
    self.ITEM_ID_MATTI    = itemId(37775);
    self.ITEM_ID_BACKER   = itemId(37844);
    self.ITEM_ID_MIKE     = itemId(37778);
    self.ITEM_ID_STRIKE   = itemId(37586);
    self.ITEM_ID_STRIKE_FAIL    = itemId(37586);
    self.ITEM_ID_STRIKE_SUCCEED = itemId(37586);
    self.ITEM_IDS = [self.ITEM_ID_MONEY, self.ITEM_ID_ORE, self.ITEM_ID_DRILL, self.ITEM_ID_ANTON, self.ITEM_ID_DYNAMITE, self.ITEM_ID_MATTI, self.ITEM_ID_BACKER, self.ITEM_ID_MIKE, self.ITEM_ID_STRIKE, self.ITEM_ID_STRIKE_FAIL, self.ITEM_ID_STRIKE_SUCCEED];

    //From URL
    self.gameId;
    self.playerId;
    self.webPageId;

    //State
    self.stationType;//One of STATION_TYPE_ enums
    self.stationId;//Same as webPageId, but more functionally named (identifies one drill from another...)

    //Personal
    self.currentLevel = 1;
    self.money = 0;
    self.ore   = 0;
    self.drill    = false;
    self.dynamite = false;
    self.backer   = false;

    self.loadStateFromARIS = function()
    {
        var bogusEndOfQueueId = 99999999; //Used to flag the end of the queue

        //Override to handle ARIS responses
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == bogusEndOfQueueId)
            {
                if(self.currentLevel == 1)
                    imv.haveDisplay.innerHTML = "Ore:"+self.ore;
                else if(self.currentLevel == 2)
                {
                    imv.haveDisplay.innerHTML = '$'+((self.money-(self.money%100))/100)+'.'+(self.money%100 < 10 ? '0' : '')+(self.money%100);
                    imv.wantDisplay.innerHTML = '&nbsp;&nbsp;GOAL: $'+((self.LEVEL_GOALS[self.currentLevel-1]-(self.LEVEL_GOALS[self.currentLevel-1]%100))/100)+'.'+(self.LEVEL_GOALS[self.currentLevel-1]%100 < 10 ? '0' : '')+(self.LEVEL_GOALS[self.currentLevel-1]%100);
                }
                initGame(self.stationType); //All requests have completed; ARIS state is known. Init games.
            }

            if(qty > 0)
            {
                for(var i in self.LEVEL_IDS)
                    if(updatedItemId == self.LEVEL_IDS[i] && i+1 >= self.currentLevel) self.currentLevel = parseInt(i)+2;
                switch(updatedItemId)
                {
                    case self.ITEM_ID_MONEY: self.money = qty; break;
                    case self.ITEM_ID_ORE:   self.ore   = qty; break;
                    case self.ITEM_ID_DRILL:    self.drill    = true; break;
                    case self.ITEM_ID_DYNAMITE: self.dynamite = true; break;
                    case self.ITEM_ID_BACKER:   self.backer   = true; break;
                }
            }
        }

        var params = ARIS.parseURLParams(document.URL);
        self.gameId    = parseInt(params.gameId);
        self.playerId  = parseInt(params.playerId);
        self.webPageId = parseInt(params.webPageId);

        self.stationType = self.STATION_TYPES[self.webPageId];
        self.stationId   = self.PUSHER_ID_MAP[self.webPageId];

        for(var i in self.ITEM_IDS)  ARIS.getItemCount(self.ITEM_IDS[i]);
        for(var i in self.LEVEL_IDS) ARIS.getItemCount(self.LEVEL_IDS[i]);

        //On dequeue of this ID, we will know that all prior enqueued information has been recieved.
        ARIS.getItemCount(bogusEndOfQueueId); 
    }
}
