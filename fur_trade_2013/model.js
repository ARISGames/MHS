var roleEnumClerk  = 0;
var roleEnumHunter = 1;
var roleEnums=[roleEnumClerk,roleEnumHunter];

var itemEnumNull      = 0;
var itemEnumPelt      = 1;
var itemEnumGun       = 2;
var itemEnumBeads     = 3;
var itemEnumBlanket   = 4;
var itemEnumKettle    = 5;
var itemEnumGunpowder = 6;
var itemEnumMBalls    = 7;
var itemEnumAxeHead   = 8;
var itemEnumPlume     = 9;
var itemEnumHoe       = 10;
var itemEnumFabric    = 11;
var itemEnumSpear     = 12;
var itemEnumKnife     = 13;
var itemEnums = [itemEnumNull, itemEnumPelt, itemEnumGun, itemEnumBeads, itemEnumBlanket, itemEnumKettle, itemEnumGunpowder, itemEnumMBalls, itemEnumAxeHead, itemEnumPlume, itemEnumHoe, itemEnumFabric, itemEnumSpear, itemEnumKnife];

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
    self.qty = 0;

    switch(itemEnum)
    {
        case itemEnumNull:
            self.webPageId = 3731;
            break;
        case itemEnumPelt:
            self.itemId = 47029;
            self.webPageId = 3718;
            self.owner = roleHunter;
            self.peltCost = 1;
            self.name = "Beaver Pelt";
            self.imageName = "pelt.png";
            break;
        case itemEnumGun:
            self.itemId = 47030;
            self.webPageId = 3720;
            self.owner = roleClerk;
            self.peltCost = 10;
            self.name = "Gun";
            self.imageName = "gun.jpg";
            break;
        case itemEnumBeads:
            self.itemId = 47035;
            self.webPageId = 3726;
            self.owner = roleClerk;
            self.peltCost = 3;
            self.name = "Bead";
            self.imageName = "beads.jpg";
            break;
        case itemEnumBlanket:
            self.itemId = 47032;
            self.webPageId = 3715;
            self.owner = roleClerk;
            self.peltCost = 4;
            self.name = "Blanket";
            self.imageName = "blanket.jpg";
            break;
        case itemEnumKettle:
            self.itemId = 47038;
            self.webPageId = 3723;
            self.owner = roleClerk;
            self.peltCost = 5;
            self.name = "Kettle";
            self.imageName = "kettle.jpg";
            break;
        case itemEnumGunpowder:
            self.itemId = 49584;
            self.webPageId = 3974;
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Gunpowder";
            self.imageName = "gunpowder.jpg";
            break;
        case itemEnumMBalls:
            self.itemId = 49586;
            self.webPageId = 3975;
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Musket Balls";
            self.imageName = "bullets.jpg";
            break;
        case itemEnumAxeHead:
            self.itemId = 49587;
            self.webPageId = 3977;
            self.owner = roleClerk;
            self.peltCost = 2;
            self.name = "Axe Head";
            self.imageName = "axehead.jpg";
            break;
        case itemEnumPlume:
            self.itemId = 49589;
            self.webPageId = 3978;
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Plume";
            self.imageName = "plume.jpg";
            break;
        case itemEnumHoe:
            self.itemId = 50181;
            self.webPageId = 3997;
            self.owner = roleClerk;
            self.peltCost = 2;
            self.name = "Hoe";
            self.imageName = "hoe.jpg";
            break;
        case itemEnumFabric:
            self.itemId = 50184;
            self.webPageId = 3999;
            self.owner = roleClerk;
            self.peltCost = 3;
            self.name = "Fabric";
            self.imageName = "fabric.jpg";
            break;
        case itemEnumSpear:
            self.itemId = 50187;
            self.webPageId = 4001;
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Muskrat Spear";
            self.imageName = "spear.jpg";
            break;
        case itemEnumKnife:
            self.itemId = 50188;
            self.webPageId = 4002;
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Knife";
            self.imageName = "knife.jpg";
            break;
        default:
            return null;
            break; //<- lol
    }
}

var roleClerk  = new Role(roleEnumClerk);
var roleHunter = new Role(roleEnumHunter);
var roles = [roleClerk, roleHunter];

var itemNull      = new Item(itemEnumNull);
var itemPelt      = new Item(itemEnumPelt);
var itemGun       = new Item(itemEnumGun);
var itemBeads     = new Item(itemEnumBeads);
var itemBlanket   = new Item(itemEnumBlanket);
var itemKettle    = new Item(itemEnumKettle);
var itemGunpowder = new Item(itemEnumGunpowder);
var itemMBalls    = new Item(itemEnumMBalls);
var itemAxeHead   = new Item(itemEnumAxeHead);
var itemPlume     = new Item(itemEnumPlume);
var itemHoe       = new Item(itemEnumHoe);
var itemFabric    = new Item(itemEnumFabric);
var itemSpear     = new Item(itemEnumSpear);
var itemKnife     = new Item(itemEnumKnife);
var items = [itemNull, itemPelt, itemGun, itemBeads, itemBlanket, itemKettle, itemGunpowder, itemMBalls, itemAxeHead, itemPlume, itemHoe, itemFabric, itemSpear, itemKnife];

var FurTradeModel = function()
{
    var self = this;

    self.gameId = 0; 
    self.player = {};
    self.webPageId = 0;
    self.webPageItem = null;
    self.webPageOwner = null;

    self.currentLevel = 1;
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

        ARIS.didReceivePlayer = function(player)
        {
            //alert(player.playerId);
            //alert(player.username);
            //alert(player.displayname);
            self.player = player;
            if(self.currentRole == roleClerk) self.player.role = "clerk";
            if(self.currentRole == roleHunter) self.player.role = "hunter";
        }

        var params = ARIS.parseURLParams(document.URL);
        self.gameId = parseInt(params.gameId);
        self.player.playerId = parseInt(params.playerId);
        self.webPageId = parseInt(params.webPageId);
        self.webPageItem = self.itemForWebPageId(self.webPageId);
        self.webPageRole = self.webPageItem.owner;

        ARIS.getPlayer();
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
    self.qtyNonPeltItems = function()
    {
        var qty = 0;
        for(var i in items)
            if(items[i] != itemPelt) qty += items[i].qty;
        return qty;
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
        self.currentLevel = 0; //newly assigned role, so override current level
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

