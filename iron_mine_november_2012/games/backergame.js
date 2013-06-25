var BackerGame = function()
{
    var moneyReceived = 100;
    var moneyLost = 600;

    this.poked = function(data)
    {
    }

    this.rumbled = function(data)
    {
        ARIS.setItemCount(imm.ITEM_IDS[0], imm.money+moneyReceived); imv.displayNotice("You've gained "+moneyReceived+" cents!");
    }

    this.caved = function(data)
    {
        if(imm.money < moneyLost) imm.money = moneyLost;
        ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-moneyLost); 
        imv.displayFail("You've lost "+moneyLost+" cents!");
    }

// http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_POKED
// http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_RUMBLE&data=1
// http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_CAVE

    this.events = [imm.stationId+'_POKED',imm.stationId+'_RUMBLE',imm.stationId+'_CAVE'];
    this.callbacks = [this.poked, this.rumbled, this.caved];
}
