var roleEnumClerk  = 0;
var roleEnumHunter = 1;
var roleEnums=[roleEnumClerk,roleEnumHunter];

var itemEnumNull     = 0;
var itemEnumApproval = 1;
var itemEnumPelt     = 2;
var itemEnumTrap     = 3;
var itemEnumBeads    = 4;
var itemEnumFabric   = 5;
var itemEnumKettle   = 6;
var itemEnums = [itemEnumNull, itemEnumApproval, itemEnumPelt, itemEnumTrap, itemEnumBeads, itemEnumFabric, itemEnumKettle];

//*These are the only sets of enumerators that correspond to legitimate ARIS ids
var levelId1 = 47022;
var levelId2 = 47023;
var levelIds=[levelId1,levelId2];

var Role = function(roleEnum)
{
    var self = this;
    self.roleEnum = roleEnum;
    self.roleId = -1;
    self.title = "";
    self.imageName = "";
    switch(roleEnum)
    {
        case roleEnumClerk:   
            self.title = "Clerk";   
            self.roleId = 47026; 
            self.imageName = "clerk.png";
            break;
        case roleEnumHunter:  
            self.title = "Hunter";  
            self.roleId = 47027; 
            self.imageName = "hunter.png";
            break;
        default: 
            return null; 
            break; //<- lol
    }
}

var Item = function(itemEnum)
{
    var self = this;
    self.itemEnum = itemEnum;
    self.itemId = -1;
    self.webPageId = -1;
    self.owner = null;
    self.name = "";
    self.imageName = "";
    self.peltCost = 0;
    self.approvalWorth = 0;
    self.qty = 0;

    switch(itemEnum)
    {
        case itemEnumNull:
            self.webPageId = 3731;
            break;
        case itemEnumApproval:
            self.itemId = 47041;
            self.approvalWorth = 1;
            break;
        case itemEnumPelt:
            self.itemId = 47029;
            self.webPageId = 3718;
            self.owner = roleHunter;
            self.peltCost = 1;
            self.name = "Beaver Pelt";
            self.imageName = "pelt.png";
            break;
        case itemEnumTrap:
            self.itemId = 47030;
            self.webPageId = 3720;
            self.owner = roleClerk;
            self.peltCost = 4;
            self.approvalWorth = 8;
            self.name = "Trap";
            self.imageName = "gun.png";
            break;
        case itemEnumBeads:
            self.itemId = 47035;
            self.webPageId = 3726;
            self.owner = roleClerk;
            self.peltCost = 1;
            self.approvalWorth = 1;
            self.name = "Bead";
            self.imageName = "beads.png";
            break;
        case itemEnumFabric:
            self.itemId = 47032;
            self.webPageId = 3715;
            self.owner = roleClerk;
            self.peltCost = 2;
            self.approvalWorth = 5;
            self.name = "Fabric";
            self.imageName = "fabric.png";
            break;
        case itemEnumKettle:
            self.itemId = 47038;
            self.webPageId = 3723;
            self.owner = roleClerk;
            self.peltCost = 3;
            self.approvalWorth = 2;
            self.name = "Kettle";
            self.imageName = "kettle.png";
            break;
        default:
            return null;
            break; //<- lol
    }
}

var roleClerk  = new Role(roleEnumClerk);
var roleHunter = new Role(roleEnumHunter);
var roles = [roleClerk, roleHunter];

var itemNull     = new Item(itemEnumNull);
var itemApproval = new Item(itemEnumApproval);
var itemPelt     = new Item(itemEnumPelt);
var itemTrap     = new Item(itemEnumTrap);
var itemBeads    = new Item(itemEnumBeads);
var itemFabric   = new Item(itemEnumFabric);
var itemKettle   = new Item(itemEnumKettle);
var items = [itemNull, itemApproval, itemPelt, itemTrap, itemBeads, itemFabric, itemKettle];

var FurTradeModel = function()
{
    var self = this;

    self.gameId = 0; 
    self.playerId = 0;
    self.webPageId = 0;
    self.webPageItem = null;
    self.webPageOwner = null;

    self.currentLevel = 0;
    self.currentRole = null;

    self.loadStateFromARIS = function(callback)
    {
        var bogusEndOfQueueId = 99999999; //Used to flag the end of the queue

        //Override to handle ARIS responses
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == bogusEndOfQueueId)
                callback();

            var o;
            if     (o = self.itemForItemId(updatedItemId))                                          o.qty = qty;
            else if(qty > 0 && (o = self.levelForLevelId(updatedItemId)) && o >= self.currentLevel) self.currentLevel = o+1;
            else if(qty > 0 && (o = self.roleForRoleId(updatedItemId)))                             self.currentRole = o;
        };

        var params = ARIS.parseURLParams(document.URL);
        self.gameId    = parseInt(params.gameId);
        self.playerId  = parseInt(params.playerId);
        self.webPageId = parseInt(params.webPageId);
        self.webPageItem = self.itemForWebPageId(self.webPageId);
        self.webPageRole = self.webPageItem.owner;

        for(var i in items)    ARIS.getItemCount(items[i].itemId);
        for(var i in levelIds) ARIS.getItemCount(levelIds[i]);
        for(var i in roles)    ARIS.getItemCount(roles[i].roleId);
        ARIS.getItemCount(bogusEndOfQueueId); //Enqueued to signal the queue to 'get state' has sufficiently advanced
    }

    self.itemForItemId = function(id)
    {
        for(var i in items)
            if(items[i].itemId == id) return items[i];
        return null;
    }
    self.itemForWebPageId = function(id)
    {
        for(var i in items)
            if(items[i].webPageId == id) return items[i];
        return null;
    }
    self.roleForRoleId = function(id)
    {
        for(var i in roles)
            if(roles[i].roleId == id) return roles[i];
        return null;
    }
    self.levelForLevelId = function(id)
    {
        for(var i in levelIds)
            if(levelIds[i] == id) return parseInt(i)+1; //returns 1 for level 1 (not 0 indexed)
        return 0; //returns 0 for no level
    }
    self.levelIdForLevel = function(i)
    {
        if(i == 0) return 0;
        return levelIds[i-1];
    }

    //ARIS ACCESS HACK
    var requestRoleCallback; //pseudo global state to hold callback
    self.requestNewRole = function(callback)
    {
        requestRoleCallback = callback;
        getSecretLocation();
    }
    var incrementSecretLocationCount = function()
    {
        // players.dropItem(gameId=5252,playerId=0,itemId=46645,lat=0.0,lon=0.0,qty=1);
        // http://arisgames.org/server/json.php/v1.players.dropItem/5252/0/46645/0/0/1
        // {"data":false,"returnCode":0,"returnCodeDescription":null}
        self.sendRequest("players.dropItem/5252/0/46645/0/0/1",function(data){});
    }
    var decrementSecretLocationCount = function()
    {
        // players.pickupItemFromLocation(gameId=5252,playerId=0,itemId=46645,locationId=339410,qty=1);
        // http://arisgames.org/server/json.php/v1.players.pickupItemFromLocation/5252/0/46645/339410/1
        // {"data":true,"returnCode":0,"returnCodeDescription":null}
        self.sendRequest("players.pickupItemFromLocation/5252/0/46645/339410/1",function(data){});
    }
    var getSecretLocation = function()
    {
        // locations.getLocation(gameId=5252,locationId=339410);
        // http://arisgames.org/server/json.php/v1.locations.getLocation/5252/339410
        // {"data":{"location_id":"339410","game_id":"5252","name":"PHILS ITEM- DO NOT TOUCH","description":"","latitude":"0","longitude":"0","error":"0","type":"Item","type_id":"46645","icon_media_id":"0","item_qty":"1","hidden":"","force_view":"","allow_quick_travel":"","wiggle":"0","show_title":"0","spawnstamp":"2013-10-03 19:37:46"},"returnCode":0,"returnCodeDescription":null}
        self.sendRequest("locations.getLocation/5252/339410",gotSecretLocation);
    }
    var gotSecretLocation = function(data)
    {
        if(data.item_qty%2 == 0)
        {
            self.currentRole = roleClerk;
            decrementSecretLocationCount();
        }
        else
        {
            self.currentRole = roleHunter;
            incrementSecretLocationCount();
        }

        requestRoleCallback();
    }

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

