var debug = true;

//ENUMS
var sceneIdLoading = 0;
var sceneIdSplash = 1;
var sceneIdVerify = 2;
var sceneIdRole = 3;
var sceneIdIntro = 4;
var sceneIdTrade = 5;
var sceneIdSuccess = 6;
var sceneIds=[sceneIdLoading,sceneIdSplash,sceneIdVerify,sceneIdRole,sceneIdIntro,sceneIdTrade,sceneIdSuccess];

var roleIdClerk = 0;
var roleIdHunter = 1;
var roleIdCrafter = 2;
var roleIds=[roleIdClerk,roleIdHunter,roleIdCrafter];

var typeIdBeaverpelt = 0;
var typeIdDriedmeat = 1;
var typeIdWildrice = 2;
var typeIdMaplesugar = 3;
var typeIdSnowshoes = 4;
var typeIdMoccasins = 5;
var typeIdBeads = 6;
var typeIdFabric = 7;
var typeIdIrontrap = 8;
var typeIdBonetools = 9;
var typeIdKettle = 10;
var typeIdLetter = 11;
var typeIds=[typeIdBeaverpelt, typeIdDriedmeat, typeIdWildrice, typeIdMaplesugar, typeIdSnowshoes, typeIdMoccasins, typeIdBeads, typeIdFabric, typeIdIrontrap, typeIdBonetools, typeIdKettle, typeIdLetter];

//*These are the only sets of enumerators that correspond to legitimate ARIS ids
var levelObjectIdA = 13;
var levelObjectIdB = 14;
var levelObjectIdC = 15;
var levelObjectIdMaster = 19;
var levelObjectIds=[levelObjectIdA,levelObjectIdB,levelObjectIdC,levelObjectIdMaster];

//TYPE DEFS
function PlayerDescription(roleId)
{
    if(debug) console.log('PlayerDescription('+roleId+')');
    this.roleId = roleId;
    this.roleObjectId = -1;
    this.title = "";
    this.imageName = "";
    switch(roleId)
    {
        case roleIdClerk:   
            this.title = "Clerk";   
            this.roleObjectId = 18; 
            this.imageName = "clerk.png";
            break;
        case roleIdHunter:  
            this.title = "Hunter";  
            this.roleObjectId = 16; 
            this.imageName = "hunter.png";
            break;
        case roleIdCrafter: 
            this.title = "Crafter"; 
            this.roleObjectId = 17; 
            this.imageName = "crafter.png";
            break;
        default: 
            return null; 
            break; //<- lol
    }
}

var playerClerk = new PlayerDescription(roleIdClerk);
var playerHunter = new PlayerDescription(roleIdHunter);
var playerCrafter = new PlayerDescription(roleIdCrafter);
var players=[playerClerk,playerHunter,playerCrafter];

function ItemDescription(typeId)
{
    if(debug) console.log('ItemDescription('+typeId+')');
    this.typeId = typeId;
    this.itemId = -1;
    this.webPageId = -1;
    this.owner = null;
    this.name = "";
    this.imageName = "";

    switch(typeId)
    {
        case typeIdBeaverpelt:
            this.itemId = 1;
            this.webPageId = 757;
            this.owner = playerHunter;
            this.name = "Beaver Pelt";
            this.imageName = "beaverpelt.png";
            break;
        case typeIdDriedmeat:
            this.itemId = 2;
            this.webPageId = 758;
            this.owner = playerHunter;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdWildrice:
            this.itemId = 3;
            this.webPageId = 759;
            this.owner = playerHunter;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdMaplesugar:
            this.itemId = 4;
            this.webPageId = 760;
            this.owner = playerHunter;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdSnowshoes:
            this.itemId = 5;
            this.webPageId = 761;
            this.owner = playerClerk;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdMoccasins:
            this.itemId = 6;
            this.webPageId = 762;
            this.owner = playerClerk;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdBeads:
            this.itemId = 7;
            this.webPageId = 763;
            this.owner = playerCrafter;
            this.name = "Beads";
            this.imageName = "beads.png";
            break;
        case typeIdFabric:
            this.itemId = 10;
            this.webPageId = 766;
            this.owner = playerCrafter;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdIrontrap:
            this.itemId = 9;
            this.webPageId = 765;
            this.owner = playerCrafter;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdBonetools:
            this.itemId = 8;
            this.webPageId = 764;
            this.owner = playerCrafter;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdKettle:
            this.itemId = 11;
            this.webPageId = 767;
            this.owner = playerClerk;
            this.name = "";
            this.imageName = "";
            break;
        case typeIdLetter:
            this.itemId = 12;
            this.webPageId = 768;
            this.owner = playerClerk;
            this.name = "";
            this.imageName = "";
            break;
        default:
            return null;
            break; //<- lol
    }
}

//REFERENCES
var typeBeaverpelt = new ItemDescription(typeIdBeaverpelt);
var typeDriedmeat = new ItemDescription(typeIdDriedmeat);
var typeWildrice = new ItemDescription(typeIdWildrice);
var typeMaplesugar = new ItemDescription(typeIdMaplesugar);
var typeSnowshoes = new ItemDescription(typeIdSnowshoes);
var typeMoccasins = new ItemDescription(typeIdMoccasins);
var typeBeads = new ItemDescription(typeIdBeads);
var typeFabric = new ItemDescription(typeIdFabric);
var typeLetter = new ItemDescription(typeIdLetter);
var typeKettle = new ItemDescription(typeIdKettle);
var typeBonetools = new ItemDescription(typeIdBonetools);
var typeIrontrap = new ItemDescription(typeIdIrontrap);
var types=[typeBeaverpelt, typeDriedmeat, typeWildrice, typeMaplesugar, typeSnowshoes, typeMoccasins, typeBeads, typeFabric, typeLetter, typeKettle, typeBonetools, typeIrontrap];

function Item(typeId)
{
    if(debug) console.log('Item('+typeId+')');
    if(!(this.description = types[typeId])) return null; //not a valid item type
    this.selected = 0;
}
function Player()
{
    if(debug) console.log('Player()');
    this.description = null;
    this.level = -1;
    this.inventory = [];
    this.givenItems = [];
    this.neededItems = [];

    this.construct = function(playerDescription)
    {
    if(debug) console.log('Player.construct('+playerDescription+')');
        if(!(this.description = playerDescription)) return null; //not a valid player type
        switch(playerDescription.roleId)
        {
            case roleIdClerk:
                switch(this.level)
                {
                    case 0:
                        this.givenItems = [typeBeads,typeBeads,typeBeads,typeBeads];
                        this.neededItems = [new Item(typeIdBeaverpelt)];
                        break;
                    case 1:
                        this.givenItems = [typeBeads,typeBeads,typeBeads,typeBeads];
                        this.neededItems = [new Item(typeIdBeaverpelt)];
                        break;
                    case 2:
                        this.givenItems = [];
                        this.neededItems = [];
                        break;
                }
                break;
            case roleIdHunter:
                switch(this.level)
                {
                    case 0:
                        this.givenItems = [typeBeaverpelt,typeBeaverpelt,typeBeaverpelt,typeBeaverpelt];
                        this.neededItems = [new Item(typeIdBeads)];
                        break;
                    case 1:
                        this.givenItems = [typeBeaverpelt,typeBeaverpelt,typeBeaverpelt,typeBeaverpelt];
                        this.neededItems = [new Item(typeIdBeads)];
                        break;
                    case 2:
                        this.givenItems = [];
                        this.neededItems = [];
                        break;
                }
                break;
            case roleIdCrafter:
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
    
    this.hasItem = function(typeId)
    {
        if(debug) console.log('hasItem('+typeId+')');
        for(var i in this.inventory)
            if(this.inventory[i].description.typeId == typeId) return this.inventory[i];
        return null;
    }
    this.getItemQtyInInventory = function(typeId)
    {
        if(debug) console.log('getItemQtyInInventory('+typeId+')');
        var qty = 0;
        for(var i = 0; i < this.inventory.length; i++)
        {
            if(this.inventory[i].description.typeId == typeId) qty++;
        }
        return qty;
    }
    this.addItemToInventory = function(typeId,qty)
    {
        if(debug) console.log('addItemToInventory('+typeId+','+qty+')');
        var item;
        for(var i = 0; i < qty; i++)
        {
            if(item = new Item(typeId)) this.inventory.push(item);
            else return null;
        }
        return item;
    }
    this.completelyRemoveItemFromInventory = function(typeId)
    {
        if(debug) console.log('completelyRemoveItemFromInventory('+typeId+')');
        var item = null;
        for(var i = 0; i < this.inventory.lengthl; i++)
        {
            if(this.inventory[i].description.typeId == typeId && (item = this.inventory[i]))
                this.inventory.splice(i,1);
        }
        return item;
    }
    this.removeItemFromInventory = function(typeId,qty)
    {
        if(debug) console.log('removeItemFromInventory('+typeId+','+qty+')');
        var item;
        for(var i = 0; i < this.inventory.length && qty > 0; i++)
        {
            if(this.inventory[i].description.typeId == typeId && (item = this.inventory[i]))
            {
                this.inventory.splice(i,1);
                qty--;
            }
        }
        return item;
    }
    this.setItemQtyInInventory = function(typeId,qty)
    {
        if(debug) console.log('setItemQtyInInventory('+typeId+','+qty+')');
        var currentQty = this.getItemQtyInInventory(typeId);
        if(qty < currentQty)
            return this.removeItemFromInventory(typeId,currentQty-qty);
        else if(qty > currentQty)
            return this.addItemToInventory(typeId,qty-currentQty);
    }
    this.hasAllNeededItems = function()
    {
        if(debug) console.log('hasAllNeededItems()');
        var item;
        for(var i in this.neededItems)
        {
            if(!this.hasItem(this.neededItems[i].typeId))
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
    if(debug) console.log('itemDescriptionForItemId('+id+')');
    for(var i in types)
        if(types[i].itemId == id) return types[i];
    return null;
}
function itemDescriptionForWebPageId(id)
{
    if(debug) console.log('itemDescriptionForWebPageId('+id+')');
    for(var i in types)
        if(types[i].webPageId == id) return types[i];
    return null;
}
function playerDescriptionForRoleObjectId(id)
{
    if(debug) console.log('playerDescriptionForRoleObjectId('+id+')');
    for(var i in players)
        if(players[i].roleObjectId == id) return players[i];
    return null;
}
function levelForLevelObjectId(id)
{
    if(debug) console.log('levelForLevelObjectId('+id+')');
    for(var i in levelObjectIds)
        if(levelObjectIds[i] == id) return i;
    return -1;
}
