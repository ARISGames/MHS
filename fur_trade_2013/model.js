var roleEnumClerk  = 0;
var roleEnumHunter = 1;
var roleEnums=[roleEnumClerk,roleEnumHunter];

var itemEnumNull     = 0;
var itemEnumPelt     = 1;
var itemEnumApproval = 2;
var itemEnumTrap     = 3;
var itemEnumBeads    = 4;
var itemEnumFabric   = 5;
var itemEnumKettle   = 6;
var itemEnums = [itemEnumNull, itemEnumPelt, itemEnumApproval, itemEnumTrap, itemEnumBeads, itemEnumFabric, itemEnumKettle];

//*These are the only sets of enumerators that correspond to legitimate ARIS ids
var levelId1 = 47022;
var levelId2 = 47023;
var levelIds=[levelId1,levelId2];

//TYPE DEFS
function Role(roleEnum)
{
    this.roleEnum = roleEnum;
    this.roleId = -1;
    this.title = "";
    this.imageName = "";
    switch(roleEnum)
    {
        case roleEnumClerk:   
            this.title = "Clerk";   
            this.roleId = 47026; 
            this.imageName = "clerk.png";
            break;
        case roleEnumHunter:  
            this.title = "Hunter";  
            this.roleId = 47027; 
            this.imageName = "hunter.png";
            break;
        default: 
            return null; 
            break; //<- lol
    }
}

var roleClerk  = new Role(roleEnumClerk);
var roleHunter = new Role(roleEnumHunter);
var roles = [roleClerk,roleHunter];

function Item(itemEnum)
{
    this.itemEnum = itemEnum;
    this.itemId = -1;
    this.webPageId = -1;
    this.owner = null;
    this.name = "";
    this.imageName = "";
    this.peltCost = 0;
    this.approvalWorth = 0;
    this.qty = 0; //This is the only 'would-be-non-static' variable of this object...

    switch(itemEnum)
    {
        case itemEnumNull:
            this.webPageId = 3731;
            break;
        case itemEnumPelt:
            this.itemId = 47029;
            this.webPageId = 3718;
            this.owner = roleHunter;
            this.name = "Beaver Pelt";
            this.imageName = "pelt.png";
            break;
        case itemEnumApproval:
            this.itemId = 47041;
            this.webPageId = -1; //no webpage
            this.owner = roleHunter;
            this.name = "Approval";
            this.imageName = "none.png"; //no image
            break;
        case itemEnumTrap:
            this.itemId = 47030;
            this.webPageId = 3720;
            this.owner = roleClerk;
            this.peltCost = 4;
            this.approvalWorth = 8;
            this.name = "Trap";
            this.imageName = "gun.png";
            break;
        case itemEnumBeads:
            this.itemId = 47035;
            this.webPageId = 3726;
            this.owner = roleClerk;
            this.peltCost = 1;
            this.approvalWorth = 1;
            this.name = "Bead";
            this.imageName = "beads.png";
            break;
        case itemEnumFabric:
            this.itemId = 47032;
            this.webPageId = 3715;
            this.owner = roleClerk;
            this.peltCost = 2;
            this.approvalWorth = 5;
            this.name = "Fabric";
            this.imageName = "fabric.png";
            break;
        case itemEnumKettle:
            this.itemId = 47038;
            this.webPageId = 3723;
            this.owner = roleClerk;
            this.peltCost = 3;
            this.approvalWorth = 2;
            this.name = "Kettle";
            this.imageName = "kettle.png";
            break;
        default:
            return null;
            break; //<- lol
    }
}

//REFERENCES
var itemNull     = new Item(itemEnumNull);
var itemPelt     = new Item(itemEnumPelt);
var itemApproval = new Item(itemEnumApproval);
var itemTrap     = new Item(itemEnumTrap);
var itemBeads    = new Item(itemEnumBeads);
var itemFabric   = new Item(itemEnumFabric);
var itemKettle   = new Item(itemEnumKettle);
var items = [itemNull, itemPelt, itemApproval, itemTrap, itemBeads, itemFabric, itemKettle];

function loadStateFromARIS()
{
    var bogusEndOfQueueId = 99999999; //Used to flag the end of the queue

    //Override to handle ARIS responses
    ARIS.didUpdateItemQty = function(updatedItemId, qty)
    {
        if(updatedItemId == bogusEndOfQueueId)
            stateReceived();

        var o;
        if     (o = itemForItemId(updatedItemId))                                     setItemQtyInInventory(o.itemEnum, qty);
        else if(qty > 0 && (o = levelForLevelId(updatedItemId)) && o >= currentLevel) currentLevel = o+1;
        else if(qty > 0 && (o = roleForRoleId(updatedItemId)))                        currentRole = o;
    };

    var params = ARIS.parseURLParams(document.URL);
    gameId    = parseInt(params.gameId);
    playerId  = parseInt(params.playerId);
    webPageId = parseInt(params.webPageId);
    webPageItem = itemForWebPageId(webPageId);
    webPageRole = webPageItem.owner;

    for(var i in items)    ARIS.getItemCount(items[i].itemId);
    for(var i in levelIds) ARIS.getItemCount(levelIds[i]);
    for(var i in roles)    ARIS.getItemCount(roles[i].roleId);
    ARIS.getItemCount(bogusEndOfQueueId); //Enqueued to signal the queue to 'get state' has sufficiently advanced
}

function hasItem(itemEnum)
{
    if(items[itemEnum].qty > 0)
        return items[itemEnum];
    return null;
}
function getItemQtyInInventory(itemEnum)
{
    return items[itemEnum].qty;
}
function addItemToInventory(itemEnum,qty)
{
    items[itemEnum].qty += qty;
    return items[itemEnum];
}
function completelyRemoveItemFromInventory(itemEnum)
{
    items[itemEnum].qty = 0;
    return items[itemEnum];
}
function removeItemFromInventory(itemEnum,qty)
{
    items[itemEnum].qty -= qty;
    if(items[itemEnum].qty < 0) items[itemEnum].qty = 0;
    return items[itemEnum];
}
function setItemQtyInInventory(itemEnum,qty)
{
    items[itemEnum].qty = qty;
    return items[itemEnum];
}
function qtyOfItemFromOwner(roleEnum)
{
    var qty = 0;
    for(var i = 0; i < items.length; i++)
    {
        if(items[i].owner.roleEnum == roleEnum)
        {
            qty+=items[i].qty;
        }
    }
    return qty;
}
function setRole(roleEnum)
{
    switch(roleEnum)
    {
        case roleEnumClerk:
            ARIS.setItemCount(roleHunter.roleId,0);
            ARIS.setItemCount(roleClerk.roleId,1);
            ARIS.setItemCount(itemPelt.itemId,10); //clerk also gets 10 beaver pelts
            currentRole = roleClerk;
            break;
        case roleEnumHunter:
            ARIS.setItemCount(roleClerk.roleId,0);
            ARIS.setItemCount(roleHunter.roleId,1);
            currentRole = roleHunter;
            break;
    }

    incrementSecretLocationCount(); //because a role was assigned, tell global state to next assign other role
}

//GAME DATA
var gameId = 0; 
var playerId = 0;
var webPageId = 0;
var webPageItem = null;
var webPageOwner = null;

//VARIABLES
var currentLevel = 1;
var currentRole = null;

//MODEL ACCESSORS
function itemForItemId(id)
{
    for(var i in items)
        if(items[i].itemId == id) return items[i];
    return null;
}
function itemForWebPageId(id)
{
    for(var i in items)
        if(items[i].webPageId == id) return items[i];
    return null;
}
function roleForRoleId(id)
{
    for(var i in roles)
        if(roles[i].roleId == id) return roles[i];
    return null;
}
function levelForLevelId(id)
{
    for(var i in levelIds)
        if(levelIds[i] == id) return parseInt(i)+1; //returns 1 for level 1 (not 0 indexed)
    return 0; //returns 0 for no level
}
function levelIdForLevel(i)
{
    if(i == 0) return 0;
    return levelIds[i-1];
}

//ARIS ACCESS HACK
function getNextRole()
{
    getSecretLocation();
}

function incrementSecretLocationCount()
{
    // players.dropItem(gameId=5252,playerId=0,itemId=46645,lat=0.0,lon=0.0,qty=1);
    // http://arisgames.org/server/json.php/v1.players.dropItem/5252/0/46645/0/0/1
    // {"data":false,"returnCode":0,"returnCodeDescription":null}
    sendRequest("players.dropItem/5252/0/46645/0/0/1",function(data){});
}

function decrementSecretLocationCount()
{
    // players.pickupItemFromLocation(gameId=5252,playerId=0,itemId=46645,locationId=339410,qty=1);
    // http://arisgames.org/server/json.php/v1.players.pickupItemFromLocation/5252/0/46645/339410/1
    // {"data":true,"returnCode":0,"returnCodeDescription":null}
    sendRequest("players.pickupItemFromLocation/5252/0/46645/339410/1",function(data){});
}

function getSecretLocation()
{
    // locations.getLocation(gameId=5252,locationId=339410);
    // http://arisgames.org/server/json.php/v1.locations.getLocation/5252/339410
    // {"data":{"location_id":"339410","game_id":"5252","name":"PHILS ITEM- DO NOT TOUCH","description":"","latitude":"0","longitude":"0","error":"0","type":"Item","type_id":"46645","icon_media_id":"0","item_qty":"1","hidden":"","force_view":"","allow_quick_travel":"","wiggle":"0","show_title":"0","spawnstamp":"2013-10-03 19:37:46"},"returnCode":0,"returnCodeDescription":null}
    sendRequest("locations.getLocation/5252/339410",gotSecretLocation);
}

function gotSecretLocation(data)
{
    //Only set role client side- if they abort before the video we want them to be assigned again
    if(data.item_qty%2 == 0) currentRole = roleHunter;
    else                     currentRole = roleClerk;

    roleWasLocallySet();
}

function sendRequest(fn, callback)
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
