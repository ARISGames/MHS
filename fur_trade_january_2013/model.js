var debug = true;

//ENUMS
var sceneEnumLoading = 0;
var sceneEnumItemGet = 1;
var sceneEnumIntro = 2;
var sceneEnumChooseRole = 3;
var sceneEnumRoleGet = 4;
var sceneEnumSuccess = 5;
var sceneEnums=[sceneEnumLoading,sceneEnumItemGet,sceneEnumIntro,sceneEnumChooseRole,sceneEnumRoleGet,sceneEnumSuccess];

var roleEnumClerk = 0;
var roleEnumHunter = 1;
var roleEnums=[roleEnumClerk,roleEnumHunter];

var itemEnumFisher = 0;
var itemEnumRaccoon = 1;
var itemEnumMarten = 2;
var itemEnumMink = 3;
var itemEnumMuskrat = 4;
var itemEnumWolf = 5;
var itemEnumOtter = 6;
var itemEnumRedFox = 7;
var itemEnumHempTwine = 8;
var itemEnumBeads = 9;
var itemEnumScissors = 10;
var itemEnumKettle = 11;
var itemEnumAxeHead = 12;
var itemEnumIronHoe = 13;
var itemEnumBeaver = 14;
var itemEnumFabric = 15;
var itemEnums = [itemEnumFisher,itemEnumRaccoon,itemEnumMarten,itemEnumMink,itemEnumMuskrat,itemEnumWolf,itemEnumOtter,itemEnumRedFox,itemEnumHempTwine,itemEnumBeads,itemEnumScissors,itemEnumKettle,itemEnumAxeHead,itemEnumIronHoe,itemEnumBeaver, itemEnumFabric];

//*These are the only sets of enumerators that correspond to legitimate ARIS ids
var levelId1 = 17242;
var levelId2 = 17243;
var levelId3 = 17244;
var levelIdMaster = 17245;
var levelIds=[levelId1,levelId2,levelId3,levelIdMaster];

//TYPE DEFS
function Role(roleEnum)
{
    if(debug) console.log('Role('+roleEnum+')');
    this.roleEnum = roleEnum;
    this.roleId = -1;
    this.title = "";
    this.imageName = "";
    switch(roleEnum)
    {
        case roleEnumClerk:   
            this.title = "Clerk";   
            this.roleId = 17240; 
            this.imageName = "clerk.png";
            break;
        case roleEnumHunter:  
            this.title = "Hunter";  
            this.roleId = 17226; 
            this.imageName = "hunter.png";
            break;
        default: 
            return null; 
            break; //<- lol
    }
}

var roleClerk = new Role(roleEnumClerk);
var roleHunter = new Role(roleEnumHunter);
var roles=[roleClerk,roleHunter];

function Item(itemEnum)
{
    if(debug) console.log('Item('+itemEnum+')');
    this.itemEnum = itemEnum;
    this.itemId = -1;
    this.webPageId = -1;
    this.owner = null;
    this.name = "";
    this.imageName = "";
    this.qty = 0; //This is the only 'would-be-non-static' variable of this object...

    switch(itemEnum)
    {
        case itemEnumFisher:
            this.itemId = 19349;
            this.webPageId = 1367;
            this.owner = roleHunter;
            this.name = "Fisher Pelt";
            this.imageName = "fisherpelt.png";
            break;
        case itemEnumRaccoon:
            this.itemId = 19350;
            this.webPageId = 1358;
            this.owner = roleHunter;
            this.name = "Raccoon Pelt";
            this.imageName = "raccoonpelt.png";
            break;
        case itemEnumMarten:
            this.itemId = 19348;
            this.webPageId = 1366;
            this.owner = roleHunter;
            this.name = "Marten Pelt";
            this.imageName = "martenpelt.png";
            break;
        case itemEnumMink:
            this.itemId = 19351;
            this.webPageId = 1359;
            this.owner = roleHunter;
            this.name = "Mink Pelt";
            this.imageName = "minkpelt.png";
            break;
        case itemEnumMuskrat:
            this.itemId = 19353;
            this.webPageId = 1364;
            this.owner = roleHunter;
            this.name = "Muskrat Pelt";
            this.imageName = "muskratpelt.png";
            break;
        case itemEnumWolf:
            this.itemId = 19354;
            this.webPageId = 1369;
            this.owner = roleHunter;
            this.name = "Wolf Pelt";
            this.imageName = "wolfpelt.png";
            break;
        case itemEnumOtter:
            this.itemId = 19355;
            this.webPageId = 1365;
            this.owner = roleHunter;
            this.name = "Otter Pelt";
            this.imageName = "otterpelt.png";
            break;
        case itemEnumRedFox:
            this.itemId = 19356;
            this.webPageId = 1360;
            this.owner = roleHunter;
            this.name = "Red Fox Pelt";
            this.imageName = "redfoxpelt.png";
            break;
        case itemEnumHempTwine:
            this.itemId = 19357;
            this.webPageId = 1356;
            this.owner = roleClerk;
            this.name = "Hemp Twine";
            this.imageName = "hemptwine.png";
            break;
        case itemEnumBeads:
            this.itemId = 19358;
            this.webPageId = 1361;
            this.owner = roleClerk;
            this.name = "Beads";
            this.imageName = "beads.png";
            break;
        case itemEnumScissors:
            this.itemId = 19359;
            this.webPageId = 1362;
            this.owner = roleClerk;
            this.name = "Scissors";
            this.imageName = "scissors.png";
            break;
        case itemEnumKettle:
            this.itemId = 19360;
            this.webPageId = 1357;
            this.owner = roleClerk;
            this.name = "Kettle";
            this.imageName = "kettle.png";
            break;
        case itemEnumAxeHead:
            this.itemId = 19361;
            this.webPageId = 1368;
            this.owner = roleClerk;
            this.name = "Axe Head";
            this.imageName = "axehead.png";
            break;
        case itemEnumIronHoe:
            this.itemId = 19352;
            this.webPageId = 1363;
            this.owner = roleClerk;
            this.name = "Iron Hoe";
            this.imageName = "ironhoe.png";
            break;
        case itemEnumBeaver:
            this.itemId = 19432;
            this.webPageId = 1371;
            this.owner = roleHunter;
            this.name = "Beaver Pelt";
            this.imageName = "beaverpelt.png";
            break;
        case itemEnumFabric:
            this.itemId = 19433;
            this.webPageId = 1372;
            this.owner = roleClerk;
            this.name = "Blanket";
            this.imageName = "fabric.png";
            break;
        default:
            return null;
            break; //<- lol
    }
}

//REFERENCES
var itemFisher = new Item(itemEnumFisher);
var itemRaccoon = new Item(itemEnumRaccoon);
var itemMarten = new Item(itemEnumMarten);
var itemMink = new Item(itemEnumMink);
var itemMuskrat = new Item(itemEnumMuskrat);
var itemWolf = new Item(itemEnumWolf);
var itemOtter = new Item(itemEnumOtter);
var itemRedFox = new Item(itemEnumRedFox);
var itemHempTwine = new Item(itemEnumHempTwine);
var itemBeads = new Item(itemEnumBeads);
var itemScissors = new Item(itemEnumScissors);
var itemKettle = new Item(itemEnumKettle);
var itemAxeHead = new Item(itemEnumAxeHead);
var itemIronHoe = new Item(itemEnumIronHoe);
var itemAxeHead = new Item(itemEnumAxeHead);
var itemIronHoe = new Item(itemEnumIronHoe);
var itemBeaver = new Item(itemEnumBeaver);
var itemFabric = new Item(itemEnumFabric);
var items = [itemFisher,itemRaccoon,itemMarten,itemMink,itemMuskrat,itemWolf,itemOtter,itemRedFox,itemHempTwine,itemBeads,itemScissors,itemKettle,itemAxeHead,itemIronHoe, itemBeaver, itemFabric];

function hasItem(itemEnum)
{
    if(debug) console.log('hasItem('+itemEnum+')');
    if(items[itemEnum].qty > 0)
        return items[itemEnum];
    return null;
}
function getItemQtyInInventory(itemEnum)
{
    if(debug) console.log('getItemQtyInInventory('+itemEnum+')');
    return items[itemEnum].qty;
}
function addItemToInventory(itemEnum,qty)
{
    if(debug) console.log('addItemToInventory('+itemEnum+','+qty+')');
    items[itemEnum].qty += qty;
    return items[itemEnum];
}
function completelyRemoveItemFromInventory(itemEnum)
{
    if(debug) console.log('completelyRemoveItemFromInventory('+itemEnum+')');
    items[itemEnum].qty = 0;
    return items[itemEnum];
}
function removeItemFromInventory(itemEnum,qty)
{
    if(debug) console.log('removeItemFromInventory('+itemEnum+','+qty+')');
    items[itemEnum].qty -= qty;
    if(items[itemEnum].qty > 0) items[itemEnum].qty = 0;
    return items[itemEnum];
}
function setItemQtyInInventory(itemEnum,qty)
{
    if(debug) console.log('setItemQtyInInventory('+itemEnum+','+qty+')');
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
function hasAllNeededItems()
{
    if(debug) console.log('hasAllNeededItems()');
    if(!currentRole) return;

    var hunterItems = qtyOfItemFromOwner(roleEnumHunter);
    var clerkItems = qtyOfItemFromOwner(roleEnumClerk);
    switch(currentRole.roleEnum)
    {
        case roleEnumHunter:
            if(currentLevel == 1 && hunterItems.qty >= 3) return true;
            else if(currentLevel == 2 && clerkItems.qty >= 3) return true;
            else if(currentLevel == 3 && clerkItems.qty >= 10) return true;
            return false;
            break;
        case roleEnumClerk:
            if(currentLevel == 1 && clerkItems.qty >= 3) return true;
            else if(currentLevel == 2 && hunterItems.qty >= 3) return true;
            else if(currentLevel == 3 && hunterItems.qty >= 10) return true;
            return false;
            break;
    }
    return false;
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
var currentInventory = [];

//MODEL ACCESSORS
function itemForItemId(id)
{
    if(debug) console.log('itemForItemId('+id+')');
    for(var i in items)
        if(items[i].itemId == id) return items[i];
    return null;
}
function itemForWebPageId(id)
{
    if(debug) console.log('itemForWebPageId('+id+')');
    for(var i in items)
        if(items[i].webPageId == id) return items[i];
    return null;
}
function roleForRoleId(id)
{
    if(debug) console.log('roleForRoleId('+id+')');
    for(var i in roles)
        if(roles[i].roleId == id) return roles[i];
    return null;
}
function levelForLevelId(id)
{
    if(debug) console.log('levelForLevelId('+id+')');
    for(var i in levelIds)
        if(levelIds[i] == id) return i+1; //returns 1 for level 1 (not 0 indexed)
    return 0; //returns 0 for no level
}

//ARIS ACCESS HACK
function incrementSecretLocationCount()
{
// players.dropItem(gameId=5252,playerId=0,itemId=46645,lat=0.0,lon=0.0,qty=1);
// http://arisgames.org/server/json.php/v1.players.dropItem/5252/0/46645/0/0/1
// {"data":false,"returnCode":0,"returnCodeDescription":null}
    sendRequest("players.dropItem/5252/0/46645/0/0/1",function(data){});
}

function decrementSecretLocationCount()
{
// players.pickupItemFromLocation(gameId=5252,playerId=0,itemId=46645,locationId=337479,qty=1);
// http://arisgames.org/server/json.php/v1.players.pickupItemFromLocation/5252/0/46645/337479/1
// {"data":true,"returnCode":0,"returnCodeDescription":null}
    sendRequest("players.pickupItemFromLocation/5252/0/46645/337479/1",function(data){});
}

function getSecretLocation()
{
// locations.getLocation(gameId=5252,locationId=337479);
// http://arisgames.org/server/json.php/v1.locations.getLocation/5252/337479
// {"data":{"location_id":"337479","game_id":"5252","name":"PHILS ITEM- DO NOT TOUCH","description":"","latitude":"0","longitude":"0","error":"0","type":"Item","type_id":"46645","icon_media_id":"0","item_qty":"1","hidden":"","force_view":"","allow_quick_travel":"","wiggle":"0","show_title":"0","spawnstamp":"2013-10-03 19:37:46"},"returnCode":0,"returnCodeDescription":null}
    sendRequest("locations.getLocation/5252/337479",gotSecretLocation);
}

function gotSecretLocation(data)
{
    //Yes, I know calling those functions directly from here is ridiculous.
    if(data.item_qty%2 == 0) setRoleButtonClicked(roleEnumHunter);
    else                     setRoleButtonClicked(roleEnumClerk);

    if(data.item_qty > 1) decrementSecretLocationCount();
    else                  incrementSecretLocationCount();
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

