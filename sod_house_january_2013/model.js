var debug = true;

//ENUMS
var sceneEnumLoading = 0;
var sceneEnumContent = 1;
var sceneEnums=[sceneEnumLoading,sceneEnumContent];

var itemEnumFood = 0;
var itemEnumHealth = 1;
var itemEnumHeat = 2;
var itemEnumChore = 3;
var itemEnums=[itemEnumFood, itemEnumHealth, itemEnumHeat, itemEnumChore];

function Item(itemEnum)
{
    if(debug) console.log('Item('+itemEnum+')');
    this.itemEnum = itemEnum;
    this.itemId = -1;
    this.name = "";
    this.qty = 0; //This is the only 'would-be-non-static' variable of this object...
    this.delta = 0;
    this.goal = 0;

    switch(itemEnum)
    {
        case itemEnumFood:
            this.itemId = 17221;
            this.name = "food";
            break;
        case itemEnumHealth:
            this.itemId = 17224;
            this.name = "health";
            break;
        case itemEnumHeat:
            this.itemId = 17225;
            this.name = "heat";
            break;
        case itemEnumChore:
            this.itemId = 17246;
            this.name = "chore";
            break;
        default:
            return null;
            break; //<- lol
    }
}

//REFERENCES
var itemFood = new Item(itemEnumFood);
var itemHealth = new Item(itemEnumHealth);
var itemHeat = new Item(itemEnumHeat);
var itemChore = new Item(itemEnumChore);
var items=[itemFood, itemHealth, itemHeat, itemChore];

//GAME DATA
var gameId = 0; 
var playerId = 0;
var webPageId = 0;
var showGoal = 0;
var showChores = 0;

//MODEL ACCESSORS
function itemForItemId(id)
{
    if(debug) console.log('itemForItemId('+id+')');
    for(var i in items)
        if(items[i].itemId == id) return items[i];
    return null;
}
