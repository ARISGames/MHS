var debug = true;

//ENUMS
var sceneIdLoading = 0;
var sceneIdSplash = 1;
var sceneIdRole = 2;
var sceneIdIntro = 3;
var sceneIdTrade = 4;
var sceneIdSuccess = 5;
var sceneIds=[sceneIdLoading,sceneIdSplash,sceneIdRole,sceneIdIntro,sceneIdTrade,sceneIdSuccess];

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
var levelObjectIdA = 26;
var levelObjectIdB = 27;
var levelObjectIdC = 28;
var levelObjectIdMaster = 29;
var levelObjectIds=[levelObjectIdA,levelObjectIdB,levelObjectIdC,levelObjectIdMaster];
var levelCompleteObjectIdA = 38;
var levelCompleteObjectIdB = 39;
var levelCompleteObjectIdC = 40;
var levelCompleteObjectIds=[levelCompleteObjectIdA,levelCompleteObjectIdB,levelCompleteObjectIdC];

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
            this.roleObjectId = 24; 
            this.imageName = "clerk.png";
            break;
        case roleIdHunter:  
            this.title = "Hunter";  
            this.roleObjectId = 23; 
            this.imageName = "hunter.png";
            break;
        case roleIdCrafter: 
            this.title = "Crafter"; 
            this.roleObjectId = 25; 
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
            this.itemId = 10;
            this.webPageId = 1140;
            this.owner = playerHunter;
            this.name = "Beaver Pelt";
            this.imageName = "beaverpelt.png";
            break;
        case typeIdDriedmeat:
            this.itemId = 11;
            this.webPageId = 1141;
            this.owner = playerHunter;
            this.name = "Dried Meat";
            this.imageName = "driedmeat.png";
            break;
        case typeIdWildrice:
            this.itemId = 20;
            this.webPageId = 1150;
            this.owner = playerCrafter;
            this.name = "Wild Rice";
            this.imageName = "wildrice.png";
            break;
        case typeIdMaplesugar:
            this.itemId = 15;
            this.webPageId = 1144;
            this.owner = playerCrafter;
            this.name = "Maple Sugar";
            this.imageName = "maplesugar.png";
            break;
        case typeIdSnowshoes:
            this.itemId = 17;
            this.webPageId = 1145;
            this.owner = playerCrafter;
            this.name = "Snowshoes";
            this.imageName = "snowshoes.png";
            break;
        case typeIdMoccasins:
            this.itemId = 16;
            this.webPageId = 1146;
            this.owner = playerCrafter;
            this.name = "Moccasins";
            this.imageName = "moccasins.png";
            break;
        case typeIdBeads:
            this.itemId = 9;
            this.webPageId = 1139;
            this.owner = playerClerk;
            this.name = "Beads";
            this.imageName = "beads.png";
            break;
        case typeIdFabric:
            this.itemId = 12;
            this.webPageId = 1142;
            this.owner = playerClerk;
            this.name = "Fabric";
            this.imageName = "fabric.png";
            break;
        case typeIdIrontrap:
            this.itemId = 18;
            this.webPageId = 1149;
            this.owner = playerClerk;
            this.name = "Iron Trap";
            this.imageName = "irontrap.png";
            break;
        case typeIdBonetools:
            this.itemId = 19;
            this.webPageId = 1147;
            this.owner = playerHunter;
            this.name = "Bone Tools";
            this.imageName = "bonetools.png";
            break;
        case typeIdKettle:
            this.itemId = 13;
            this.webPageId = 1148;
            this.owner = playerClerk;
            this.name = "Kettle";
            this.imageName = "kettle.png";
            break;
        case typeIdLetter:
            this.itemId = 14;
            this.webPageId = 1143;
            this.owner = playerHunter;
            this.name = "Letter";
            this.imageName = "letter.png";
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
    this.selected = false;
    this.meaningful = false;
}
function Player()
{
    if(debug) console.log('Player()');
    var self = this;
    this.description = null;
    this.level = -1;
    this.levelComplete = -1;
    this.inventory = [];
    this.inventoryCells = [];
    this.givenItems = [];
    this.neededItems = [];

    this.construct = function(playerDescription)
    {
    if(debug) console.log('Player.construct('+playerDescription+')');
        if(!(self.description = playerDescription)) return null; //not a valid player type
        switch(playerDescription.roleId)
        {
            case roleIdClerk:
                switch(self.level)
                {
                    case 0:
                        self.givenItems = [typeFabric,typeFabric,typeFabric,typeFabric];
                        self.neededItems = [new Item(typeIdBeaverpelt)];
                        break;
                    case 1:
                        self.givenItems = [typeIrontrap,typeFabric,typeBeads,typeKettle];
                        self.neededItems = [new Item(typeIdLetter),new Item(typeIdBeaverpelt),new Item(typeIdSnowshoes),new Item(typeIdMaplesugar)];
                        break;
                    case 2:
                        self.givenItems = [];
                        self.neededItems = [];
                        break;
                }
                break;
            case roleIdHunter:
                switch(self.level)
                {
                    case 0:
                        self.givenItems = [typeBeaverpelt,typeBeaverpelt,typeBeaverpelt,typeBeaverpelt];
                        self.neededItems = [new Item(typeIdFabric)];
                        break;
                    case 1:
                        self.givenItems = [typeLetter,typeBeaverpelt,typeDriedmeat,typeBonetools];
                        self.neededItems = [new Item(typeIdIrontrap),new Item(typeIdFabric),new Item(typeIdWildrice),new Item(typeIdMoccasins)];
                        break;
                    case 2:
                        self.givenItems = [];
                        self.neededItems = [];
                        break;
                }
                break;
            case roleIdCrafter:
                switch(self.level)
                {
                    case 0://Crafter should not exist in level 0
                        self.givenItems = [];
                        self.neededItems = [];
                        break;
                    case 1:
                        self.givenItems = [typeWildrice, typeMocasins, typeSnowshoes, typeKettle];
                        self.neededItems = [new Item(typeIdBeads), new Item(typeIdKettle), new Item(typeIdDriedmeat), new Item(typeIdBonetools)];
                        break;
                    case 2:
                        self.givenItems = [];
                        self.neededItems = [];
                        break;
                }
                break;
        }
        return self;
    }
    
    this.hasItem = function(typeId)
    {
        if(debug) console.log('hasItem('+typeId+')');
        for(var i in self.inventory)
            if(self.inventory[i].description.typeId == typeId) return self.inventory[i];
        return null;
    }
    this.getItemQtyInInventory = function(typeId)
    {
        if(debug) console.log('getItemQtyInInventory('+typeId+')');
        var qty = 0;
        for(var i = 0; i < self.inventory.length; i++)
        {
            if(self.inventory[i].description.typeId == typeId) qty++;
        }
        return qty;
    }
    this.addItemToInventory = function(typeId,qty)
    {
        if(debug) console.log('addItemToInventory('+typeId+','+qty+')');
        var item;
        for(var i = 0; i < qty; i++)
        {
            if(item = new Item(typeId)) 
            {
                self.inventory.push(item);
                self.inventoryCells.push(generateInventoryCell(item));
            }
            else return null;
        }
        return item;
    }
    this.completelyRemoveItemFromInventory = function(typeId)
    {
        if(debug) console.log('completelyRemoveItemFromInventory('+typeId+')');
        var item = null;
        for(var i = 0; i < self.inventory.length; i++)
        {
            if(self.inventory[i].description.typeId == typeId && (item = self.inventory[i]))
            {
                self.inventory.splice(i,1);
                self.inventoryCells.splice(i,1);
                i--;
            }
        }
        return item;
    }
    this.removeItemFromInventory = function(typeId,qty)
    {
        if(debug) console.log('removeItemFromInventory('+typeId+','+qty+')');
        var item;
        for(var i = 0; i < self.inventory.length && qty > 0; i++)
        {
            if(self.inventory[i].description.typeId == typeId && (item = self.inventory[i]))
            {
                self.inventory.splice(i,1);
                self.inventoryCells.splice(i,1);
                i--;
                qty--;
            }
        }
        return item;
    }
    this.setItemQtyInInventory = function(typeId,qty)
    {
        if(debug) console.log('setItemQtyInInventory('+typeId+','+qty+')');
        var currentQty = self.getItemQtyInInventory(typeId);
        if(qty < currentQty)
            return self.removeItemFromInventory(typeId,currentQty-qty);
        else if(qty > currentQty)
            return self.addItemToInventory(typeId,qty-currentQty);
    }
    this.hasAllNeededItems = function()
    {
        if(debug) console.log('hasAllNeededItems()');
        var item;
        for(var i = 0; i < self.neededItems.length; i++)
        {
            if(!self.neededItems[i].selected)
                return false;
        }
        return true;
    }
    this.markMeaningfulInventoryContents = function()
    {
        for(var i = 0; i < self.inventory.length; i++)
            self.inventory[i].meaningful = false;
        for(var i = 0; i < self.neededItems.length; i++)
            self.neededItems[i].selected = false;
        for(var i = 0; i < self.inventory.length; i++)
        {
            for(var j = 0; j < self.neededItems.length; j++)
            {
                if(self.inventory[i].description.itemId == self.neededItems[j].description.itemId && !self.inventory[i].meaningful && !self.neededItems[j].selected)
                {
                    self.inventory[i].meaningful = true;
                    self.neededItems[j].selected = true;
                }
            }
        }
        self.syncCellsWithData();
    }
    this.syncCellsWithData = function()
    {
        for(var i = 0; i < self.inventory[i].length; i++)
        {
            self.inventoryCells[i] = generateInventoryCell(self.inventory[i]);
        }
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
function levelForLevelCompleteObjectId(id)
{
    if(debug) console.log('levelForLevelCompleteObjectId('+id+')');
    for(var i in levelCompleteObjectIds)
        if(levelCompleteObjectIds[i] == id) return i;
    return -1;
}


//HTML Factories(not actual 'factories', but still) (also, probably doesn't belong in 'model', but I didn't really know where else to put it...)

function generateInventoryCell(item)
{
    var invCell = document.createElement('div');
    invCell.drawSelf = function()
    {
        invCell.innerHTML = "";
        var invBG = document.createElement('img');
        invBG.setAttribute('class', 'inventorybg');
        var invIconBG = document.createElement('img');
        invIconBG.setAttribute('class','inventoryiconbg');
        var invIconFGBox = document.createElement('div'); //Just something to allow th inner icon to be centered
        invIconFGBox.setAttribute('class','inventoryiconfgbox');
        var invIconFG = document.createElement('img');
        invIconFG.setAttribute('class','inventoryiconfg');
        var invTitle = document.createElement('div');
        invTitle.setAttribute('class','inventorytitle gotham');
        var invDescription = document.createElement('div');
        invDescription.setAttribute('class','inventorydescription gotham');
    
        if(item.selected)
        {
            invCell.setAttribute('class','selectedinventorycell inventorycell');
            invIconBG.setAttribute('src','images/core/icon_background_down.png');
            invBG.setAttribute('src','images/core/cell_background_down.png');
        }
        else
        {
            if(item.meaningful)
            {
                invCell.setAttribute('class','meaningfulinventorycell inventorycell');
                invIconBG.setAttribute('src','images/core/icon_background_good.png');
                invBG.setAttribute('src','images/core/cell_background_good.png');
            }
            else
            {
                invCell.setAttribute('class','inventorycell');
                invIconBG.setAttribute('src','images/core/icon_background.png');
                invBG.setAttribute('src','images/core/cell_background.png');
            }
        }
        invIconFG.setAttribute('src','images/objects/icons/'+item.description.imageName);
        invTitle.innerHTML = item.description.name;
        invDescription.innerHTML = item.description.name
        invCell.appendChild(invBG);
        invCell.appendChild(invIconBG);
        invCell.appendChild(invIconFGBox);
        invIconFGBox.appendChild(invIconFG);
        invCell.appendChild(invTitle);
        invCell.appendChild(invDescription)
    }
    invCell.drawSelf();

    invCell.onclick = function(e) { item.selected = !item.selected; invCell.drawSelf(); constructBumpString(); };

    return invCell;
}
            
