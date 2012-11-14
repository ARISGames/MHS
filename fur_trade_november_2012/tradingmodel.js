//ENUMS
var sceneLoading = 0;
var sceneVerify = 1;
var sceneIntro = 2;
var sceneTrade = 3;
var sceneSuccess = 4;
var scenes=[sceneLoading,sceneVerify,sceneIntro,sceneTrade,sceneSuccess];

var roleClerk = 0;
var roleHunter = 1;
var roleCrafter = 2;
var roles=[roleClerk,roleHunter,roleCrafter];

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
var types=[typePelt,typeMeat,typeLeather,typeHideLacing,typeGun,typeCoat,typeRice,typeSugar,typeSnowshoes,typeMoccasins,typeBeads,typeBlanket];

//*These are the only sets of enumerators that correspond to legitimate ARIS ids
var levelIdA = 13;
var levelIdB = 14;
var levelIdC = 15;
var levelIdMaster = 19;
var levelIds=[levelIdA,levelIdB,levelIdC,levelIdMaster];

//TYPE DEFS
function PlayerDescription(role)
{
    this.role = role;
    this.roleId = -1;
    this.title = "";
    this.imageFile = "";
    this.introText = "";
    switch(role)
    {
        case roleClerk:   
            this.title = "Clerk";   
            this.roleId = 18; 
            this.imageFile = "images/clerk.jpg";
            this.introText = "You's a Clerk!";
            break;
        case roleHunter:  
            this.title = "Hunter";  
            this.roleId = 16; 
            this.imageFile = "images/hunter.jpg";
            this.introText = "You's a Hunter!";
            break;
        case roleCrafter: 
            this.title = "Crafter"; 
            this.roleId = 17; 
            this.imageFile = "images/crafter.jpg";
            this.introText = "You's a Crafter!";
            break;
        default: 
            return null; 
            break; //<- lol
    }
}

var playerClerk = new PlayerDescription(roleClerk);
var playerHunter = new PlayerDescription(roleHunter);
var playerCrafter = new PlayerDescription(roleCrafter);
var players=[playerClerk,playerHunter,playerCrafter];

function ItemDescription(type)
{
    this.type = type;
    this.itemId = -1;
    this.webPageId = -1;
    this.owner = null;
    this.generalName = "";
    this.specificName = "";
    this.imageFile = "";
    this.imageFileIcon = "";
    this.introText = "";
    this.helperText = "";

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
            this.introText = "Beaver Pelts were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeMeat:
            this.itemId = 2;
            this.webPageId = 758;
            this.owner = playerHunter;
            this.generalName = "Meat";
            this.specificName = "Deer Meat";
            this.imageFile = "images/deermeat96.png";
            this.imageFileIcon = "images/deermeat.png";
            this.introText = "Deer Meat was blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeLeather:
            this.itemId = 3;
            this.webPageId = 759;
            this.owner = playerHunter;
            this.generalName = "Leather";
            this.specificName = "Leather";
            this.imageFile = "images/leather.png";
            this.imageFileIcon = "images/leather96.png";
            this.introText = "Leather was blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeHideLacing:
            this.itemId = 4;
            this.webPageId = 760;
            this.owner = playerHunter;
            this.generalName = "Lace";
            this.specificName = "Raw Hide Lacing";
            this.imageFile = "images/lace96.png";
            this.imageFileIcon = "images/lace.png";
            this.introText = "Raw Hide Lacing was blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeGun:
            this.itemId = 5;
            this.webPageId = 761;
            this.owner = playerClerk;
            this.generalName = "Gun";
            this.specificName = "Gun";
            this.imageFile = "images/gun96.png";
            this.imageFileIcon = "images/gun.png";
            this.introText = "Guns were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeCoat:
            this.itemId = 6;
            this.webPageId = 762;
            this.owner = playerClerk;
            this.generalName = "Coat";
            this.specificName = "Coat";
            this.imageFile = "images/coat96.png";
            this.imageFileIcon = "images/coat.png";
            this.introText = "Coats were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeRice:
            this.itemId = 7;
            this.webPageId = 763;
            this.owner = playerCrafter;
            this.generalName = "Rice";
            this.specificName = "Wild Rice";
            this.imageFile = "images/wildrice96.png";
            this.imageFileIcon = "images/wildrice.png";
            this.introText = "Wild Rice was blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeSugar:
            this.itemId = 10;
            this.webPageId = 766;
            this.owner = playerCrafter;
            this.generalName = "Sugar";
            this.specificName = "Maple Sugar";
            this.imageFile = "images/maplesugar96.png";
            this.imageFileIcon = "images/maplesugar.png";
            this.introText = "Maple Sugar was blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeSnowshoes:
            this.itemId = 9;
            this.webPageId = 765;
            this.owner = playerCrafter;
            this.generalName = "Snowshoes";
            this.specificName = "Snowshoes";
            this.imageFile = "images/snowshoe96.png";
            this.imageFileIcon = "images/snowshoe.png";
            this.introText = "Snowshoes were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeMoccasins:
            this.itemId = 8;
            this.webPageId = 764;
            this.owner = playerCrafter;
            this.generalName = "Moccasins";
            this.specificName = "Moccasins";
            this.imageFile = "images/moccasins96.png";
            this.imageFileIcon = "images/moccasins.png";
            this.introText = "Moccasins were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeBeads:
            this.itemId = 11;
            this.webPageId = 767;
            this.owner = playerClerk;
            this.generalName = "Beads";
            this.specificName = "Beads";
            this.imageFile = "images/beads96.png";
            this.imageFileIcon = "images/beads.png";
            this.introText = "Beads were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
            break;
        case typeBlanket:
            this.itemId = 12;
            this.webPageId = 768;
            this.owner = playerClerk;
            this.generalName = "Blanket";
            this.specificName = "Blanket";
            this.imageFile = "images/blanket96.png";
            this.imageFileIcon = "images/blanket.png";
            this.introText = "Blankets were blah...";
            this.helperText = "It looks like you need "+this.generalName+". You should go find a "+this.owner.title+".";
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
var items=[itemPelt,itemMeat,itemLeather,itemHideLacing,itemGun,itemCoat,itemRice,itemSugar,itemSnowshoes,itemMoccasins,itemBeads,itemBlanket];

function Item(type)
{
    if(!(this.description = items[type])) return null; //not a valid item type
    this.qty = 1;
    this.selected = 0;
}
function Player()
{
    this.description = null;
    this.level = -1;
    this.inventory = [];
    this.givenItems = [];
    this.neededItems = [];

    this.construct = function(playerDescription)
    {
        if(!(this.description = playerDescription)) return null; //not a valid player type
        switch(playerDescription.role)
        {
            case roleClerk:
                switch(this.level)
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
                switch(this.level)
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
                switch(this.level)
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
        return this;
    }
    
    this.hasItem = function(type)
    {
        for(var i in this.inventory)
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
        for(var i in this.inventory)
            if(this.inventory[i].description.type == type && (item = this.inventory[i]))
                this.inventory.splice(i,1);
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
            return this.completelyRemoveItemFromInventory(type);
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
        var item;
        for(var i in this.neededItems)
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
    for(var i in items)
        if(items[i].itemId == id) return items[i];
    return null;
}
function itemDescriptionForWebPageId(id)
{
    for(var i in items)
        if(items[i].webPageId == id) return items[i];
    return null;
}
function playerDescriptionForRoleId(id)
{
    for(var i in players)
        if(players[i].roleId == id) return players[i];
    return null;
}
function levelForLevelId(id)
{
    for(var i in levelIds)
        if(levelIds[i] == id) return i;
    return -1;
}
