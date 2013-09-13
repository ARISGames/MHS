var BackerGame = function()
{
    var self = this;

    var leftpoker = document.getElementById('backerPoleLeft');
    var rightpoker = document.getElementById('backerPoleRight');

    var moneyReceived = 100;
    var minMoneyReceived = 15;
    var maxMoneyReceived = 100;
    var moneyLost = 600;

    self.setup = function()
    {
        ARIS.setItemCount(imm.ITEM_ID_BACKER, 1);
        if(imm.ITEMS[imm.ITEM_ID_BACKER] > 0) imv.displayIntro();
        else                                  imv.displayVid();
    }

    function succeed()
    {
        imv.displayGuruWithMessage("I have a moustache! Hooray!");

        imv.successHUD();
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);
    }

    function fail()
    {
        imv.displayGuruWithMessage("I have a moustache! BOO!");

        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);
    }

    var leftVibeTime;
    var rightVibeTime;
    var poked = function(data)
    {
        imv.neutralHUD();
        if(data == 1) rightVibeTime = 100; vibeLeftPoker();
        if(data == 2) rightVibeTime = 100; vibeRightPoker();
    }

    function vibeLeftPoker()
    {
        
    }

    function vibeRightPoker()
    {

    }

    var rumbled = function(data)
    {
       succeed();
    }

    var caved = function(data)
    {
        fail();
    }

// http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_POKED
// http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_RUMBLE&data=1
// http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_CAVE

    this.events = [imm.stationId+'_POKED',imm.stationId+'_RUMBLE',imm.stationId+'_CAVE'];
    this.callbacks = [poked, rumbled, caved];
}
