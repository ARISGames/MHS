var BackerGame = function()
{
    var self = this;

    var rocks      = document.getElementById('backerrocks');
    var leftpoker  = document.getElementById('backerpoleleft');
    var rightpoker = document.getElementById('backerpoleright');

    var moneyReceived = 100;
    var minMoneyReceived = 15;
    var maxMoneyReceived = 100;
    var moneyLost = 600;

    var successQuips = [
    "Success!"
    ];
    var mixQuips = [
    "OK!"
    ];
    var failQuips = [
    "Fail!"
    ];
    var successCount = 0;
    var failCount    = 0;

    self.setup = function()
    {
        ARIS.setItemCount(imm.ITEM_ID_BACKER, 1);
        if(imm.ITEMS[imm.ITEM_ID_BACKER] > 0) imv.displayIntro();
        else                                  imv.displayVid();
    }

    function succeed()
    {
        successCount++;
        checkGuru();

        imv.successHUD();
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);
    }

    function fail()
    {
        failCount++;
        checkGuru();

        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);
    }

    function checkGuru()
    {
        if((failCount+successCount) != 0 && (failCount+successCount)%3 == 0)
        {
                 if(failCount    == 0) imv.displayGuruWithMessage(successQuips[0]);
            else if(successCount == 0) imv.displayGuruWithMessage(failQuips[0]);
            else                       imv.displayGuruWithMessage(mixQuips[0]);
        }
    }

    var leftVibeTime  = 0;
    var rightVibeTime = 0;
    var poked = function(data)
    {
        imv.neutralHUD();
        rocks.src = 'assets/backer_rocks_safe.png';
        if(data == 1) { var alreadyVibing = (leftVibeTime  != 0); leftVibeTime  = 20; if(!alreadyVibing) vibeLeftPoker();  }
        if(data == 2) { var alreadyVibing = (rightVibeTime != 0); rightVibeTime = 20; if(!alreadyVibing) vibeRightPoker(); }
    }

    function vibeLeftPoker()
    {
        leftpoker.style.top  = ((Math.random()*10)-5)+'px';
        leftpoker.style.left = ((Math.random()*10)-5)+'px';
        leftVibeTime--;
        if(leftVibeTime > 0) setTimeout(vibeLeftPoker,10); 
        else
        {
            leftpoker.style.top  = '0px';
            leftpoker.style.left = '0px';
        }
    }

    function vibeRightPoker()
    {
        rightpoker.style.top  = ((Math.random()*10)-5)+'px';
        rightpoker.style.left = ((Math.random()*10)-5)+'px';
        rightVibeTime--;
        if(rightVibeTime > 0) setTimeout(vibeRightPoker,10); 
        else
        {
            rightpoker.style.top  = '0px';
            rightpoker.style.left = '0px';
        }
    }

    var rumbled = function(data)
    {
        rocks.src = 'assets/backer_rocks_danger.png';
        succeed();
    }

    var caved = function(data)
    {
        rocks.src = 'assets/backer_rocks_danger.png';
        fail();
    }

    // http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_POKED
    // http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_RUMBLE&data=1
    // http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_CAVE

    this.events = [imm.stationId+'_POKED',imm.stationId+'_RUMBLE',imm.stationId+'_CAVE'];
    this.callbacks = [poked, rumbled, caved];
}
