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
    self.STATION_IDS[self.STATION_TYPE_DRILL]    = [webPageId(6681),webPageId(6621),webPageId(6624),webPageId(6627),webPageId(6630)]; //All webpage/station Id's of type 'drill'
    self.STATION_IDS[self.STATION_TYPE_DYNAMITE] = [webPageId(6684),webPageId(6633),webPageId(6636)]; //All webpage/station Id's of type 'dynamite'
    self.STATION_IDS[self.STATION_TYPE_BACKER]   = [webPageId(6687),webPageId(6639)]; //All webpage/station Id's of type 'backer'
    self.STATION_IDS[self.STATION_TYPE_STRIKE]   = [webPageId(6690),webPageId(6678)]; //All webpage/station Id's of type 'strike'

	// Half of these numbers get replaced so the new game can talk to the v1 station IDS (which corresponded to the v1 game objects)
	// Left value: New v2 web page, right: v1 web page (and Pusher channel ID)
	self.PUSHER_ID_MAP = {};

	// Drills
	self.PUSHER_ID_MAP[webPageId(6681)] = 3545;
	self.PUSHER_ID_MAP[webPageId(6621)] = 1151;
	self.PUSHER_ID_MAP[webPageId(6624)] = 1152;
	self.PUSHER_ID_MAP[webPageId(6627)] = 1153;
	self.PUSHER_ID_MAP[webPageId(6630)] = 1154;

	// Dynamite
	self.PUSHER_ID_MAP[webPageId(6684)] = 3548;
	self.PUSHER_ID_MAP[webPageId(6633)] = 1155;
	self.PUSHER_ID_MAP[webPageId(6636)] = 1156;

	// Backer
	self.PUSHER_ID_MAP[webPageId(6687)] = 3555;
	self.PUSHER_ID_MAP[webPageId(6639)] = 1160;

	// Strike
	self.PUSHER_ID_MAP[webPageId(6690)] = 3556;
	self.PUSHER_ID_MAP[webPageId(6678)] = 3031;


    //  Station Id->Category relations (populated with above info)
    self.STATION_TYPES = {};
    for(var i in self.STATION_IDS[self.STATION_TYPE_DRILL])    self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_DRILL][i]]    = self.STATION_TYPE_DRILL;
    for(var i in self.STATION_IDS[self.STATION_TYPE_DYNAMITE]) self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_DYNAMITE][i]] = self.STATION_TYPE_DYNAMITE;
    for(var i in self.STATION_IDS[self.STATION_TYPE_BACKER])   self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_BACKER][i]]   = self.STATION_TYPE_BACKER;
    for(var i in self.STATION_IDS[self.STATION_TYPE_STRIKE])   self.STATION_TYPES[self.STATION_IDS[self.STATION_TYPE_STRIKE][i]]   = self.STATION_TYPE_STRIKE;

    self.LEVEL_IDS =   [itemId(36618),itemId(36621),itemId(36624)];
    self.LEVEL_GOALS = [200, 200, 1000];

    self.ITEM_ID_MONEY    = itemId(36627);
    self.ITEM_ID_ORE      = itemId(37014); self.oreWorth = 10;
    self.ITEM_ID_DRILL    = itemId(36750);
    self.ITEM_ID_ANTON    = itemId(36813);
    self.ITEM_ID_DYNAMITE = itemId(36825);
    self.ITEM_ID_MATTI    = itemId(36816);
    self.ITEM_ID_BACKER   = itemId(36885);
    self.ITEM_ID_MIKE     = itemId(36819);
    self.ITEM_ID_STRIKE   = itemId(36627);
    self.ITEM_ID_STRIKE_FAIL    = itemId(36627);
    self.ITEM_ID_STRIKE_SUCCEED = itemId(36627);
    self.ITEM_IDS = [self.ITEM_ID_MONEY, self.ITEM_ID_ORE, self.ITEM_ID_DRILL, self.ITEM_ID_ANTON, self.ITEM_ID_DYNAMITE, self.ITEM_ID_MATTI, self.ITEM_ID_BACKER, self.ITEM_ID_MIKE, self.ITEM_ID_STRIKE, self.ITEM_ID_STRIKE_FAIL, self.ITEM_ID_STRIKE_SUCCEED];

    //From URL
    self.game_id;
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
        self.game_id    = parseInt(params.game_id);
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
