var itemId = web_page_id = locationId = game_id = function(id){return id;};

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
var levelId1 = itemId(36987);
var levelId2 = itemId(36990);
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
            self.roleId = itemId(36993);
            self.imageName = "clerk.png";
            break;
        case roleEnumHunter:
            self.title = "Hunter";
            self.roleId = itemId(36996);
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
    self.web_page_id = -1;
    self.owner = null;
    self.name = "";
    self.singular = "";
    self.plural = "";
    self.imageName = "";
    self.peltCost = 0;
    self.qty = 0;

    switch(itemEnum)
    {
        case itemEnumNull:
            self.web_page_id = web_page_id(6708);
            break;
        case itemEnumPelt:
            self.itemId = itemId(36999);
            self.web_page_id = web_page_id(6696);
            self.owner = roleHunter;
            self.peltCost = 1;
            self.name = "Beaver Pelt";
            self.singular = "Beaver Pelt";
            self.plural = "Beaver Pelts";
            self.imageName = "pelt.png";
            break;
        case itemEnumGun:
            self.itemId = itemId(37002);
            self.web_page_id = web_page_id(6699);
            self.owner = roleClerk;
            self.peltCost = 11;
            self.name = "Gun";
            self.singular = "Gun";
            self.plural = "Guns";
            self.imageName = "gun.png";
            break;
        case itemEnumBeads:
            self.itemId = itemId(37008);
            self.web_page_id = web_page_id(6705);
            self.owner = roleClerk;
            self.peltCost = 3;
            self.name = "Beads";
            self.singular = "Bag of Beads";
            self.plural = "Bags of Beads";
            self.imageName = "beads.png";
            break;
        case itemEnumBlanket:
            self.itemId = itemId(37005);
            self.web_page_id = web_page_id(6693);
            self.owner = roleClerk;
            self.peltCost = 4;
            self.name = "Blanket";
            self.singular = "Blanket";
            self.plural = "Blankets";
            self.imageName = "blanket.png";
            break;
        case itemEnumKettle:
            self.itemId = itemId(37011);
            self.web_page_id = web_page_id(6702);
            self.owner = roleClerk;
            self.peltCost = 5;
            self.name = "Kettle";
            self.singular = "Kettle";
            self.plural = "Kettles";
            self.imageName = "kettle.png";
            break;
        case itemEnumGunpowder:
            self.itemId = itemId(37017);
            self.web_page_id = web_page_id(6714);
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Gunpowder";
            self.singular = "Bag of Gunpowder";
            self.plural = "Bags of Gunpowder";
            self.imageName = "gunpowder.png";
            break;
        case itemEnumMBalls:
            self.itemId = itemId(37020);
            self.web_page_id = web_page_id(6717);
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Musket Balls";
            self.singular = "Bag of Musket Balls";
            self.plural = "Bags of Musket Balls";
            self.imageName = "musketballs.png";
            break;
        case itemEnumAxeHead:
            self.itemId = itemId(37023);
            self.web_page_id = web_page_id(6720);
            self.owner = roleClerk;
            self.peltCost = 2;
            self.name = "Axe Head";
            self.singular = "Axe Head";
            self.plural = "Axe Heads";
            self.imageName = "axe.png";
            break;
        case itemEnumPlume:
            self.itemId = itemId(37026);
            self.web_page_id = web_page_id(6723);
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Plume";
            self.singular = "Plume";
            self.plural = "Plumes";
            self.imageName = "plume.png";
            break;
        case itemEnumHoe:
            self.itemId = itemId(37029);
            self.web_page_id = web_page_id(6726);
            self.owner = roleClerk;
            self.peltCost = 2;
            self.name = "Hoe";
            self.singular = "Hoe";
            self.plural = "Hoes";
            self.imageName = "hoe.png";
            break;
        case itemEnumFabric:
            self.itemId = itemId(37032);
            self.web_page_id = web_page_id(6729);
            self.owner = roleClerk;
            self.peltCost = 3;
            self.name = "Fabric";
            self.singular = "Sheet of Fabric";
            self.plural = "Sheets of Fabric";
            self.imageName = "fabric.png";
            break;
        case itemEnumSpear:
            self.itemId = itemId(37038);
            self.web_page_id = web_page_id(6732);
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Muskrat Spear";
            self.singular = "Muskrat Spear";
            self.plural = "Muskrat Spears";
            self.imageName = "spear.png";
            break;
        case itemEnumKnife:
            self.itemId = itemId(37041);
            self.web_page_id = web_page_id(6735);
            self.owner = roleClerk;
            self.peltCost = 1;
            self.name = "Knife";
            self.singular = "Knife";
            self.plural = "Knives";
            self.imageName = "knife.png";
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

    self.game_id = 0;
    self.player = {};
    self.web_page_id = 0;
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
            else if(qty > 0 && (o = self.roleForRoleId(updatedItemId)))
            {
                self.currentRole = o;
                if(self.player)
                {
                    if(self.currentRole == roleClerk) self.player.role = "clerk";
                    if(self.currentRole == roleHunter) self.player.role = "hunter";
                }
            }
        };

        ARIS.didReceivePlayer = function(player)
        {
            //alert(player.playerId);
            //alert(player.username);
            //alert(player.display_name);
            self.player = player;
            if(self.currentRole == roleClerk) self.player.role = "clerk";
            if(self.currentRole == roleHunter) self.player.role = "hunter";
            self.player.availability = "available";
        }

        var params = ARIS.parseURLParams(document.URL);
        self.game_id = parseInt(params.game_id);
        self.player.playerId = parseInt(params.playerId);
        self.web_page_id = parseInt(params.web_page_id);
        self.webPageItem = self.itemForWebPageId(self.web_page_id);
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
            if(items[i].web_page_id == id) return items[i];
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
		self.sendRequest("instances.giveQtyToInstance", {instance_id: 584996, qty: 1});
    }
    var decrementSecretLocationCount = function()
    {
		self.sendRequest("instances.takeQtyFromInstance", {instance_id: 584996, qty: 1});
    }
    var getSecretLocation = function()
    {
		self.sendRequest("instances.getInstance", {instance_id: 584996}, gotSecretLocation);
    }
    var gotSecretLocation = function(data)
    {
        self.currentLevel = 0; //newly assigned role, so override current level
        if(parseInt(data.qty)%2 == 0)
        {
            self.currentRole = roleClerk;
            if(self.player) self.player.role = "clerk";
            incrementSecretLocationCount();
        }
        else
        {
            self.currentRole = roleHunter;
            if(self.player) self.player.role = "hunter";
            decrementSecretLocationCount();
        }

        requestRoleCallback();
    }

	// v2 api interface
	self.sendRequest = function(fn, params, callback)
    {
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",server_path+"/json.php/v2."+fn,true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function()
        {
            if(callback && xmlhttp.readyState == 4 && xmlhttp.status == 200)
			{
                callback(JSON.parse(xmlhttp.responseText).data);
			}
        }
        xmlhttp.send(JSON.stringify(params));
    }
}

