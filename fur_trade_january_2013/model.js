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

var itemEnumBeaverpelt = 0;
var itemEnumDriedmeat = 1;
var itemEnumWildrice = 2;
var itemEnumMaplesugar = 3;
var itemEnumSnowshoes = 4;
var itemEnumMoccasins = 5;
var itemEnumBeads = 6;
var itemEnumFabric = 7;
var itemEnumIrontrap = 8;
var itemEnumBonetools = 9;
var itemEnumKettle = 10;
var itemEnumLetter = 11;
var itemEnums=[itemEnumBeaverpelt, itemEnumDriedmeat, itemEnumWildrice, itemEnumMaplesugar, itemEnumSnowshoes, itemEnumMoccasins, itemEnumBeads, itemEnumFabric, itemEnumIrontrap, itemEnumBonetools, itemEnumKettle, itemEnumLetter];

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
        case itemEnumBeaverpelt:
            this.itemId = 17228;
            this.webPageId = 1313;
            this.owner = roleHunter;
            this.name = "Beaver Pelt";
            this.imageName = "beaverpelt.png";
            break;
        case itemEnumDriedmeat:
            this.itemId = 17229;
            this.webPageId = 1141;
            this.owner = roleHunter;
            this.name = "Dried Meat";
            this.imageName = "driedmeat.png";
            break;
        case itemEnumWildrice:
            this.itemId = 17238;
            this.webPageId = 1150;
            this.owner = roleClerk;
            this.name = "Wild Rice";
            this.imageName = "wildrice.png";
            break;
        case itemEnumMaplesugar:
            this.itemId = 17233;
            this.webPageId = 1144;
            this.owner = roleClerk;
            this.name = "Maple Sugar";
            this.imageName = "maplesugar.png";
            break;
        case itemEnumSnowshoes:
            this.itemId = 17235;
            this.webPageId = 1145;
            this.owner = roleClerk;
            this.name = "Snowshoes";
            this.imageName = "snowshoes.png";
            break;
        case itemEnumMoccasins:
            this.itemId = 17234;
            this.webPageId = 1146;
            this.owner = roleClerk;
            this.name = "Moccasins";
            this.imageName = "moccasins.png";
            break;
        case itemEnumBeads:
            this.itemId = 17227;
            this.webPageId = 1139;
            this.owner = roleClerk;
            this.name = "Beads";
            this.imageName = "beads.png";
            break;
        case itemEnumFabric:
            this.itemId = 17230;
            this.webPageId = 1314;
            this.owner = roleClerk;
            this.name = "Fabric";
            this.imageName = "fabric.png";
            break;
        case itemEnumIrontrap:
            this.itemId = 17236;
            this.webPageId = 1149;
            this.owner = roleClerk;
            this.name = "Iron Trap";
            this.imageName = "irontrap.png";
            break;
        case itemEnumBonetools:
            this.itemId = 17237;
            this.webPageId = 1147;
            this.owner = roleHunter;
            this.name = "Bone Tools";
            this.imageName = "bonetools.png";
            break;
        case itemEnumKettle:
            this.itemId = 17231;
            this.webPageId = 1148;
            this.owner = roleClerk;
            this.name = "Kettle";
            this.imageName = "kettle.png";
            break;
        case itemEnumLetter:
            this.itemId = 17232;
            this.webPageId = 1143;
            this.owner = roleHunter;
            this.name = "Letter";
            this.imageName = "letter.png";
            break;
        default:
            return null;
            break; //<- lol
    }
}

//REFERENCES
var itemBeaverpelt = new Item(itemEnumBeaverpelt);
var itemDriedmeat = new Item(itemEnumDriedmeat);
var itemWildrice = new Item(itemEnumWildrice);
var itemMaplesugar = new Item(itemEnumMaplesugar);
var itemSnowshoes = new Item(itemEnumSnowshoes);
var itemMoccasins = new Item(itemEnumMoccasins);
var itemBeads = new Item(itemEnumBeads);
var itemFabric = new Item(itemEnumFabric);
var itemIrontrap = new Item(itemEnumIrontrap);
var itemBonetools = new Item(itemEnumBonetools);
var itemKettle = new Item(itemEnumKettle);
var itemLetter = new Item(itemEnumLetter);
var items=[itemBeaverpelt, itemDriedmeat, itemWildrice, itemMaplesugar, itemSnowshoes, itemMoccasins, itemBeads, itemFabric, itemIrontrap, itemBonetools, itemKettle, itemLetter];

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
function hasAllNeededItems()
{
    if(debug) console.log('hasAllNeededItems()');
    if(!currentRole) return;
    switch(currentRole.roleEnum)
    {
        case roleEnumHunter:
            if(currentLevel == 1 && items[itemEnumBeaverpelt].qty >= 3) return true;
            else if(currentLevel == 2 && items[itemEnumFabric].qty >= 3) return true;
            else if(currentLevel == 3 && items[itemEnumFabric].qty >= 10) return true;
            return false;
            break;
        case roleEnumClerk:
            if(currentLevel == 1 && items[itemEnumFabric].qty >= 3) return true;
            else if(currentLevel == 2 && items[itemEnumBeaverpelt].qty >= 3) return true;
            else if(currentLevel == 3 && items[itemEnumBeaverpelt].qty >= 10) return true;
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
