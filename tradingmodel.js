//ENUMS
var sceneLoading = 0;
var sceneIntro = 1;
var sceneTrade = 2;
var sceneSuccess = 3;
var scenes[sceneLoading,sceneIntro,sceneTrade,sceneSuccess];

var roleClerk = 0;
var roleHunter = 1;
var roleCrafter = 2;
var roles[roleClerk,roleHunter,roleCrafter];

var typePelt = 0;
var typeMeat = 1;
var typeLeather = 2;
var typeHideLacing = 3;
var typeGun = 4;
var typeCoat = 5;
var typeRice = 6;
var typeSugar = 7;
var typeSnowshoes = 8;
var typeMoccasins = 9;
var typeBeads = 10;
var typeBlanket = 11;
var types[typePelt,typeMeat,typeLeather,typeHideLacing,typeGun,typeCoat,typeRice,typeSugar,typeSnowshoes,typeMoccasins,typeBeads,typeBlanket];

//*These are the only sets of enumerators that correspond to legitimate ARIS ids
var levelIdA = 13;
var levelIdB = 14;
var levelIdC = 15;
var levelIds[levelIdA,levelIdB,levelIdC];

//TYPE DEFS
function PlayerDescription(role)
{
    this.role = role;
    this.roleId = -1;
    this.title = "";
    switch(role)
    {
        case roleClerk:   this.title = "Clerk";   this.roleId = 20; break;
        case roleHunter:  this.title = "Hunter";  this.roleId = 21; break;
        case roleCrafter: this.title = "Crafter"; this.roleId = 22; break;
        default: return null; break; //<- lol
    }
}

function ItemDescription(type)
{
    this.type = type;
    this.itemId = -1;
    this.webPageId = -1;
    this.owner = -1;
    this.generalName = "";
    this.specificName = "";
    this.imageFile = "";
    this.imageFileIcon = "";

    switch(type)
    {
        case typePelt:
            this.itemId = 1;
            this.webPageId = 757;
            this.owner = playerHunter;
            this.generalName = "Fur";
            this.specificName = "Beaver Pelt";
            this.imageFile = "images/beaverpelt96.png";
            this.imageFileIcon = "images/beaverpelt.png";
            break;
        case typeMeat:
            this.itemId = 2;
            this.webPageId = 758;
            this.owner = playerHunter;
            this.generalName = "Meat";
            this.specificName = "Deer Meat";
            this.imageFile = "images/deermeat96.png";
            this.imageFileIcon = "images/deermeat.png";
            break;
        case typeLeather:
            this.itemId = 3;
            this.webPageId = 759;
            this.owner = playerHunter;
            this.generalName = "Leather";
            this.specificName = "Leather";
            this.imageFile = "images/leather.png";
            this.imageFileIcon = "images/leather96.png";
            break;
        case typeHideLacing:
            this.itemId = 4;
            this.webPageId = 760;
            this.owner = playerHunter;
            this.generalName = "Lace";
            this.specificName = "Raw Hide Lacing";
            this.imageFile = "images/lace96.png";
            this.imageFileIcon = "images/lace.png";
            break;
        case typeGun:
            this.itemId = 5;
            this.webPageId = 761;
            this.owner = playerClerk;
            this.generalName = "Gun";
            this.specificName = "Gun";
            this.imageFile = "images/gun96.png";
            this.imageFileIcon = "images/gun.png";
            break;
        case typeCoat:
            this.itemId = 6;
            this.webPageId = 762;
            this.owner = playerClerk;
            this.generalName = "Coat";
            this.specificName = "Coat";
            this.imageFile = "images/coat96.png";
            this.imageFileIcon = "images/coat.png";
            break;
        case typeRice:
            this.itemId = 7;
            this.webPageId = 763;
            this.owner = playerCrafter;
            this.generalName = "Rice";
            this.specificName = "Wild Rice";
            this.imageFile = "images/wildrice96.png";
            this.imageFileIcon = "images/wildrice.png";
            break;
        case typeSugar:
            this.itemId = 8;
            this.webPageId = 764;
            this.owner = playerCrafter;
            this.generalName = "Sugar";
            this.specificName = "Maple Sugar";
            this.imageFile = "images/maplesugar96.png";
            this.imageFileIcon = "images/maplesugar.png";
            break;
        case typeSnowshoes:
            this.itemId = 9;
            this.webPageId = 765;
            this.owner = playerCrafter;
            this.generalName = "Snowshoes";
            this.specificName = "Snowshoes";
            this.imageFile = "images/snowshoe96.png";
            this.imageFileIcon = "images/snowshoe.png";
            break;
        case typeMoccasins:
            this.itemId = 10;
            this.webPageId = 766;
            this.owner = playerCrafter;
            this.generalName = "Moccasins";
            this.specificName = "Moccasins";
            this.imageFile = "images/moccasins96.png";
            this.imageFileIcon = "images/moccasins.png";
            break;
        case typeBeads:
            this.itemId = 11;
            this.webPageId = 767;
            this.owner = playerClerk;
            this.generalName = "Beads";
            this.specificName = "Beads";
            this.imageFile = "images/beads96.png";
            this.imageFileIcon = "images/beads.png";
            break;
        case typeBlanket:
            this.itemId = 12;
            this.webPageId = 768;
            this.owner = playerClerk;
            this.generalName = "Blanket";
            this.specificName = "Blanket";
            this.imageFile = "images/blanket96.png";
            this.imageFileIcon = "images/blanket.png";
            break;
        default:
            return null;
            break; //<- lol
    }
}

//REFERENCES
var itemPelt = new ItemDescription(typePelt);
var itemMeat = new ItemDescription(typeMeat);
var itemLeather = new ItemDescription(typeLeather);
var itemHideLacing = new ItemDescription(typeHideLacing);
var itemGun = new ItemDescription(typeGun);
var itemCoat = new ItemDescription(typeCoat);
var itemRice = new ItemDescription(typeRice);
var itemSugar = new ItemDescription(typeSugar);
var itemSnowshoes = new ItemDescription(typeSnowshoes);
var itemMoccasins = new ItemDescription(typeMoccasins);
var itemBeads = new ItemDescription(typeBeads);
var itemBlanket = new ItemDescription(typeBlanket);
var items[itemPelt,itemMeat,itemLeather,itemHideLacing,itemGun,itemCoat,itemRice,itemSugar,itemSnowshoes,itemMoccasins,itemBeads,itemBlanket];

var playerClerk = new PlayerDescription(roleClerk);
var playerHunter = new PlayerDescription(roleHunter);
var playerCrafter = new PlayerDescription(roleCrafter);
var players[playerClerk,playerHunter,playerCrafter];

function Item(type)
{
    if(!this.description = items[type]) return null; //not a valid item type
    this.qty = 1;
    this.selected = 0;
}
function Player()
{
    this.description = null;
    this.role = -1; //used only temporarily until description is correctly constructed
    this.level = -1;
    this.inventory = [];
    this.givenItems = [];
    this.neededItems = [];

    this.construct = function()
    {
        if(!this.description = players[this.role]) return null; //not a valid player type
        switch(this.role)
        {
            case roleClerk:
                switch(level)
                {
                    case 0:
                        this.givenItems = [itemGun];
                        this.neededItems = [itemPelt];
                        break;
                    case 1:
                        this.givenItems = [itemGun, itemCoat, itemBeads, itemBlanket];
                        this.neededItems = [itemPelt, itemMeat, itemSnowshoes, itemMoccasins];
                        break;
                    case 2:
                        this.givenItems = [];
                        this.neededItems = [];
                        break;
                }
                break;
            case roleHunter:
                switch(level)
                {
                    case 0:
                        this.givenItems = [itemPelt];
                        this.neededItems = [itemGun];
                        break;
                    case 1:
                        this.givenItems = [itemPelt, itemMeat, itemLeather, itemHideLacing];
                        this.neededItems = [itemGun, itemCoat, itemRice, itemSugar];
                        break;
                    case 2:
                        this.givenItems = [];
                        this.neededItems = [];
                        break;
                }
                break;
            case roleCrafter:
                switch(level)
                {
                    case 0://Crafter should not exist in level 0
                        this.givenItems = [];
                        this.neededItems = [];
                        break;
                    case 1:
                        this.givenItems = [itemRice, itemSugar, itemSnowshoes, itemMoccasins];
                        this.neededItems = [itemLeather, itemHideLacing, itemBeads, itemBlanket];
                        break;
                    case 2:
                        this.givenItems = [];
                        this.neededItems = [];
                        break;
                }
                break;
        }
    }
    
    this.hasItem = function(type)
    {
        for(i in this.inventory)
            if(this.inventory[i].description.type == type) return this.inventory[i];
        return null;
    }
    this.addItemToInventory = function(type,qty)
    {
        var item;
        if(item = this.hasItem(type))
            item.qty+=qty; 
        else
        {
            if(item = new Item(type)) this.inventory.push(item);
            else return null;
        }
        return item;
    }
    this.completelyRemoveItemFromInventory = function(type)
    {
        var item = null;
        for(i in this.inventory)
            if(this.inventory[i].description.type == type && item = this.inventory[i]) this.inventory.splice(i,1);
        return item;
    }
    this.removeItemFromInventory = function(type,qty)
    {
        var item;
        if(item = this.hasItem(type))
        {
            item.qty-=qty; 
            if(item.qty <= 0)
                item = this.completelyRemoveItemFromInventory(type);
            return item;
        }
        return null;
    }
    this.setItemQtyInInventory = function(type,qty)
    {
        if(qty <= 0)
            this.completelyRemoveItemFromInventory(type);
        else
        {
            var item;
            if(!(item = this.hasItem(type)))
            {
                if(item = new Item(type)) this.inventory.push(item);
                else return null;
            }
            item.qty = qty;
            return item;
        }
        return null;
    }
    this.hasAllNeededItems = function()
    {
        for(i in this.neededItems)
        {
            if(!this.hasItem(this.neededItems[i].type))
                return false;
        }
        return true;
    }
}

//GAME DATA
var gameId; 
var playerId;
var webPageId;

//VARIABLES
var player;

//MODEL ACCESSORS
function itemDescriptionForItemId(id)
{
    for(i in items)
        if(items[i].itemId == id) return items[i];
    return null;
}
function itemDescriptionForWebPageId(id)
{
    for(i in items)
        if(items[i].webPageId == id) return items[i];
    return null;
}
function playerDescriptionForRoleId(id)
{
    for(i in players)
        if(players[i].roleId == id) return players[i];
    return null;
}
function levelForLevelId(id)
{
    for(i in levelIds)
        if(levelIds[i] == id) return i;
    return null;
}
