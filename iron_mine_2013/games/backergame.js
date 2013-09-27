var BackerGame = function()
{
    var self = this;

    var rocks         = document.getElementById('backerrocks');
    var leftpoker     = document.getElementById('backerpoleleft');
    var leftpokerimg  = document.getElementById('backerpoleleftimage');
    var rightpoker    = document.getElementById('backerpoleright');
    var rightpokerimg = document.getElementById('backerpolerightimage');

    var rock1 = document.getElementById('backerrock1');
    var rock2 = document.getElementById('backerrock2');
    var rock3 = document.getElementById('backerrock3');
    var rock4 = document.getElementById('backerrock4');
    var rock5 = document.getElementById('backerrock5');
    var rock6 = document.getElementById('backerrock6');
    var rock7 = document.getElementById('backerrock7');
    var rock8 = document.getElementById('backerrock8');

    var moneyReceived = 100;
    var minMoneyReceived = 8;
    var maxMoneyReceived = 100;
    var littleMoneyReceived = 10;
    var littleMinMoneyReceived = 2;
    var littleMaxMoneyReceived = 10;
    var moneyLost = 600;

    var lastReceivedMoney = 0;
    var successCount = 0;
    var failCount    = 0;

    self.setup = function()
    {
        ARIS.setItemCount(imm.ITEM_ID_BACKER, 1);
        ARIS.setItemCount(imm.ITEM_ID_MIKE, 1);
    }

    function succeed()
    {
        imv.successHUD();
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        leftpokerimg.src  = 'assets/backer_pole_left_green.png';
        rightpokerimg.src = 'assets/backer_pole_right_green.png';

        lastReceivedMoney = moneyToReceive;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);

        successCount++;
        checkGuru(true);
    }

    function fail()
    {
        flingRocks();

        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;

        leftpokerimg.src  = 'assets/backer_pole_left_red.png';
        rightpokerimg.src = 'assets/backer_pole_right_red.png';
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);

        failCount++;
        checkGuru(false);
    }

    function checkGuru(success)
    {
        if(imm.currentLevel == 1)
        {
            if(success && successCount == 1)
                imv.displayGuruWithMessage(
                    "You found a weak spot and got out just in time. Let's try not to die..."
                );
            if(!success && failCount == 1)
                imv.displayGuruWithMessage(
                    "Are you okay? Looks like you lost your leg in the cave-in. I bet that fake leg was expensive!"
                );
        }
        else if(imm.currentLevel == 2)
        {
            if(success && successCount == 1) 
            {
                if(lastReceivedMoney < 33)
                    imv.displayGuruWithMessage(
                        "Ya done good work there but since there's only a little ore, there's only a little pay."
                    );
                else
                    imv.displayGuruWithMessage(
                        "AHA! That's what I'm talkin' about! There's a lotta ore here, that means PAY DAY!"
                    );
            }
            else if(!success && failCount == 1)
                imv.displayGuruWithMessage(
                    "Kid, you're gonna hurt yourself that way! Make sure you look for the GREEN light."
                );
            else if(success && lastReceivedMoney < 33)
                imv.displayGuruWithMessage(
                    "You know what they say... no ore, no pay. The company only pays for the ore we find, no matter if it kills us for 10 hours."
                );
        }
    }

    var leftVibeTime  = 0;
    var rightVibeTime = 0;
    var poked = function(data)
    {
        imv.neutralHUD();

        var moneyToReceive = littleMinMoneyReceived + Math.round(Math.random()*(littleMaxMoneyReceived-littleMinMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = littleMoneyReceived;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);

        rocks.src = 'assets/backer_rocks_safe.png';
        if(data == 1) { var alreadyVibing = (leftVibeTime  != 0); leftVibeTime  = 60; if(!alreadyVibing) vibeLeftPoker();  }
        if(data == 2) { var alreadyVibing = (rightVibeTime != 0); rightVibeTime = 60; if(!alreadyVibing) vibeRightPoker(); }
    }

    function vibeLeftPoker()
    {
        leftVibeTime--;
        if(leftVibeTime > 30) //going up
            leftpoker.style.top = (-2*(60-leftVibeTime))+'px';
        else                 //going down
            leftpoker.style.top = (-2*     leftVibeTime)+'px';
        if(leftVibeTime > 0) setTimeout(vibeLeftPoker,10); 
        else
        {
            leftpoker.style.top  = '0px';
            leftpoker.style.left = '0px';
        }
    }

    function vibeRightPoker()
    {
        rightVibeTime--;
        if(rightVibeTime > 30) //going up
            rightpoker.style.top = (-2*(60-rightVibeTime))+'px';
        else                 //going down
            rightpoker.style.top = (-2*     rightVibeTime)+'px';
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
        if(data == 1) { var alreadyVibing = (leftVibeTime  != 0); leftVibeTime  = 60; if(!alreadyVibing) vibeLeftPoker();  }
        if(data == 2) { var alreadyVibing = (rightVibeTime != 0); rightVibeTime = 60; if(!alreadyVibing) vibeRightPoker(); }
        succeed();
    }

    var caved = function(data)
    {
        rocks.src = 'assets/backer_rocks_danger.png';
        if(data == 1) { var alreadyVibing = (leftVibeTime  != 0); leftVibeTime  = 60; if(!alreadyVibing) vibeLeftPoker();  }
        if(data == 2) { var alreadyVibing = (rightVibeTime != 0); rightVibeTime = 60; if(!alreadyVibing) vibeRightPoker(); }
        fail();
    }

    function randomW() { return Math.random()*320-40; }
    function randomH() { return Math.random()*508-40; }
    function flingRocks()
    {
        rock1.startx = randomW(); rock1.starty = randomH(); rock1.endx = randomW(); rock1.endy = randomH(); rock1.style.display = 'block';
        rock2.startx = randomW(); rock2.starty = randomH(); rock2.endx = randomW(); rock2.endy = randomH(); rock2.style.display = 'block';
        rock3.startx = randomW(); rock3.starty = randomH(); rock3.endx = randomW(); rock3.endy = randomH(); rock3.style.display = 'block';
        rock4.startx = randomW(); rock4.starty = randomH(); rock4.endx = randomW(); rock4.endy = randomH(); rock4.style.display = 'block';
        rock5.startx = randomW(); rock5.starty = randomH(); rock5.endx = randomW(); rock5.endy = randomH(); rock5.style.display = 'block';
        rock6.startx = randomW(); rock6.starty = randomH(); rock6.endx = randomW(); rock6.endy = randomH(); rock6.style.display = 'block';
        rock7.startx = randomW(); rock7.starty = randomH(); rock7.endx = randomW(); rock7.endy = randomH(); rock7.style.display = 'block';
        rock8.startx = randomW(); rock8.starty = randomH(); rock8.endx = randomW(); rock8.endy = randomH(); rock8.style.display = 'block';

        flingFade = 0;
        tickRockFling();
    }

    var flingFade = 0;
    function tickRockFling()
    {
        rock1.style.top  = (rock1.starty+((rock1.endy-rock1.starty)*(flingFade/100)))+'px'; rock1.style.left = (rock1.startx+((rock1.endx-rock1.startx)*(flingFade/100)))+'px'; rock1.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock2.style.top  = (rock2.starty+((rock2.endy-rock2.starty)*(flingFade/100)))+'px'; rock2.style.left = (rock2.startx+((rock2.endx-rock2.startx)*(flingFade/100)))+'px'; rock2.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock3.style.top  = (rock3.starty+((rock3.endy-rock3.starty)*(flingFade/100)))+'px'; rock3.style.left = (rock3.startx+((rock3.endx-rock3.startx)*(flingFade/100)))+'px'; rock3.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock4.style.top  = (rock4.starty+((rock4.endy-rock4.starty)*(flingFade/100)))+'px'; rock4.style.left = (rock4.startx+((rock4.endx-rock4.startx)*(flingFade/100)))+'px'; rock4.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock5.style.top  = (rock5.starty+((rock5.endy-rock5.starty)*(flingFade/100)))+'px'; rock5.style.left = (rock5.startx+((rock5.endx-rock5.startx)*(flingFade/100)))+'px'; rock5.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock6.style.top  = (rock6.starty+((rock6.endy-rock6.starty)*(flingFade/100)))+'px'; rock6.style.left = (rock6.startx+((rock6.endx-rock6.startx)*(flingFade/100)))+'px'; rock6.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock7.style.top  = (rock7.starty+((rock7.endy-rock7.starty)*(flingFade/100)))+'px'; rock7.style.left = (rock7.startx+((rock7.endx-rock7.startx)*(flingFade/100)))+'px'; rock7.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;
        rock8.style.top  = (rock8.starty+((rock8.endy-rock8.starty)*(flingFade/100)))+'px'; rock8.style.left = (rock8.startx+((rock8.endx-rock8.startx)*(flingFade/100)))+'px'; rock8.style.opacity = (((-1*Math.abs(flingFade-50))+50)*2)/100;

        flingFade++;
        if(flingFade >= 100) endFlingRocks();
        else setTimeout(tickRockFling, 10);
    }

    function endFlingRocks()
    {
        rock1.style.display = 'none';
        rock2.style.display = 'none';
        rock3.style.display = 'none';
        rock4.style.display = 'none';
        rock5.style.display = 'none';
        rock6.style.display = 'none';
        rock7.style.display = 'none';
        rock8.style.display = 'none';
    }

    // http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_POKED
    // http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_RUMBLE&data=1
    // http://dev.arisgames.org/server/events/send.php?channel=private-default-channel&event=1160_CAVE

    this.events = [imm.stationId+'_POKED',imm.stationId+'_RUMBLE',imm.stationId+'_CAVE'];
    this.callbacks = [poked, rumbled, caved];
}

