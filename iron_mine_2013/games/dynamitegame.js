var DynamiteGame = function()
{
    var self = this; //JAVASCRIIIIIIPPPPPTTTTTTT!!!!!!!!

    //Load images
    var tmpDynamiteFilledHole = new Image();
    var tmpDynamiteLoadInstr  = new Image();
    var tmpDynamiteClearInstr = new Image();
    var tmpDynamiteBlastInstr = new Image();
    var tmpDynamiteExplosion  = new Image();
    var tmpDynamiteGreen      = new Image();
    var tmpDynamiteRed        = new Image();
    tmpDynamiteFilledHole.src = 'assets/dynamite_filled_hole.png';
    tmpDynamiteLoadInstr.src  = 'assets/dynamite_load_instr.png';
    tmpDynamiteClearInstr.src = 'assets/dynamite_clear_instr.png';
    tmpDynamiteBlastInstr.src = 'assets/dynamite_blast_instr.png';
    tmpDynamiteExplosion.src  = 'assets/explode.png';
    tmpDynamiteGreen.src      = 'assets/dynamite_green.png';
    tmpDynamiteRed.src        = 'assets/dynamite_red.png';
    //Won't do anything with these ^, this just brings them into memory

    var dynamiteExplosion    = document.getElementById('dynamiteexplosion');
    var dynamiteSticksImg    = document.getElementById('dynamitesticksimg');

    var STATE_LOAD_DYNAMITE = 0;
    var STATE_RUN = 1;
    var STATE_PRESS_PLUNGER = 2;
    var states = [STATE_LOAD_DYNAMITE, STATE_RUN, STATE_PRESS_PLUNGER];
    var currentState = STATE_LOAD_DYNAMITE;

    var minOreReceived = 3;
    var maxOreReceived = 10;
    var moneyLost = 200;

    var successCount = 1;
    var failCount    = 0;

    var holesFilledFlags = [false,false,false,false,false,false,false];
    var allHolesFilled   = false;
    var allHolesEmpty    = false;
    var dynamiteHoles = [document.createElement('img'),//<- hole '0' doesn't exist
        document.getElementById('dynamitehole1'),
        document.getElementById('dynamitehole2'),
        document.getElementById('dynamitehole3'),
        document.getElementById('dynamitehole4'),
        document.getElementById('dynamitehole5'),
        document.getElementById('dynamitehole6'),
        document.getElementById('dynamitehole7')];
    var dynamiteIndicator = document.getElementById('dynamiteindicator');

    self.setup = function()
    {
        if(imm.webPageId == imm.STATION_IDS[imm.STATION_TYPE_DYNAMITE][0])//debug
        {
            imv.dynamiteGame.className += " dynamite_left_bg";
            dynamiteHoles[1].style.top  = '97px';  dynamiteHoles[1].style.left = '5px';
            dynamiteHoles[2].style.top  = '53px';  dynamiteHoles[2].style.left = '50px';
            dynamiteHoles[3].style.top  = '113px'; dynamiteHoles[3].style.left = '96px';
            dynamiteHoles[4].style.top  = '94px';  dynamiteHoles[4].style.left = '180px';
            dynamiteHoles[5].style.top  = '53px';  dynamiteHoles[5].style.left = '220px';
            dynamiteHoles[6].style.top  = '111px'; dynamiteHoles[6].style.left = '270px';
        }
        else if(imm.webPageId == imm.STATION_IDS[imm.STATION_TYPE_DYNAMITE][1])
        {
            imv.dynamiteGame.className += " dynamite_right_bg";
            dynamiteHoles[1].style.top  = '52px';  dynamiteHoles[1].style.left = '20px';
            dynamiteHoles[2].style.top  = '116px'; dynamiteHoles[2].style.left = '67px';
            dynamiteHoles[3].style.top  = '51px';  dynamiteHoles[3].style.left = '96px';
            dynamiteHoles[4].style.top  = '60px';  dynamiteHoles[4].style.left = '188px';
            dynamiteHoles[5].style.top  = '133px'; dynamiteHoles[5].style.left = '225px';
            dynamiteHoles[6].style.top  = '63px';  dynamiteHoles[6].style.left = '265px';
        }
        else if(imm.webPageId == imm.STATION_IDS[imm.STATION_TYPE_DYNAMITE][2])
        {
            imv.dynamiteGame.className += " dynamite_left_bg";
            dynamiteHoles[1].style.top  = '97px';  dynamiteHoles[1].style.left = '5px';
            dynamiteHoles[2].style.top  = '53px';  dynamiteHoles[2].style.left = '50px';
            dynamiteHoles[3].style.top  = '113px'; dynamiteHoles[3].style.left = '96px';
            dynamiteHoles[4].style.top  = '94px';  dynamiteHoles[4].style.left = '180px';
            dynamiteHoles[5].style.top  = '53px';  dynamiteHoles[5].style.left = '220px';
            dynamiteHoles[6].style.top  = '111px'; dynamiteHoles[6].style.left = '270px';
        }

        ARIS.setItemCount(imm.ITEM_ID_MATTI, 1);

        if(imm.currentLevel == 1)
        {
            if(!imm.dynamite)
                imv.currentIntroTalk.innerHTML = "Hei, miten menee, I'm <b>Matti Pelto</b>- Looks like you're new to the mine. <b>Give the dynamite a try</b>- fill the slots, wait for the all-clear, push the plunger, repeat. Got it?<br />";
            else        
            {
                imv.currentIntroButton.onclick = function() { ARIS.exitToScanner("Scan something in the Iron Mine!"); };
                imv.currentIntroTalk.innerHTML = "Good work on the dynamite! If you haven't already, you should <b>check out the drills or the backer stations</b> to get a feel for <b>all the jobs in the mine</b>.";
            }
        }
        else if(imm.currentLevel == 2)
            imv.currentIntroTalk.innerHTML = "I see you've enjoyed <b>blasting for ore</b>. It has some <b>pretty big payouts</b>, but one worker goofin' off could blast too soon and <b>BOOM!</b>- we're left with the <b>medical bills</b>...";
        else imv.currentIntroTalk.innerHTML = "Here to <b>blast</b> for more ore? Well, don't let me get in your way!";
    }

    this.updateDynamiteState = function(data)
    {
        holesFilledFlags = JSON.parse(data).state;
        allHolesFilled = true;
        allHolesEmpty = true;
        for(var i = 1; i < holesFilledFlags.length; i++)
        {
            if(!holesFilledFlags[i]) allHolesFilled = false;
            else                     allHolesEmpty  = false;
            dynamiteHoles[i].style.display = holesFilledFlags[i] ? 'block' : 'none';
        }

        if(currentState == STATE_LOAD_DYNAMITE && allHolesFilled)
        {
            currentState = STATE_RUN;
            dynamiteIndicator.src = 'assets/dynamite_clear_instr.png';
        }
    }

    var updateDynamiteSlotTrue = function(slot)
    {
        imv.displayActivity();
        dynamiteExplosion.style.display = 'none';
        imv.neutralHUD();
        var newHolesFilledFlags = [];
        for(var i = 1; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[slot] = true;
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.updateDynamiteSlot1 = function(data) { updateDynamiteSlotTrue(1); }
    this.updateDynamiteSlot2 = function(data) { updateDynamiteSlotTrue(2); }
    this.updateDynamiteSlot3 = function(data) { updateDynamiteSlotTrue(3); }
    this.updateDynamiteSlot4 = function(data) { updateDynamiteSlotTrue(4); }
    this.updateDynamiteSlot5 = function(data) { updateDynamiteSlotTrue(5); }
    this.updateDynamiteSlot6 = function(data) { updateDynamiteSlotTrue(6); }

    this.plungerReady = function(data)
    {
        //Fill the dynamite
        imv.displayActivity();
        var newHolesFilledFlags = [];
        for(var i = 1; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = true;
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);

        dynamiteIndicator.src = 'assets/dynamite_blast_instr.png';
        currentState = STATE_PRESS_PLUNGER;
    }

    this.plungerPressed = function(data)
    {
        imv.displayActivity();
        if(currentState != STATE_PRESS_PLUNGER) fail();
        else                                    succeed();

        //Empty the dynamite
        var newHolesFilledFlags = [];
        for(var i = 1; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = false;
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);

        currentState = STATE_LOAD_DYNAMITE;
        dynamiteIndicator.src = 'assets/dynamite_load_instr.png';
    }

    function succeed()
    {
        imv.successHUD();
        var oreToReceive = minOreReceived + Math.round(Math.random()*(maxOreReceived-minOreReceived));

        dynamiteSticksImg.src = 'assets/dynamite_green.png';
        dynamiteExplosion.style.display = 'block';

        successCount++;
        checkGuru(true, oreToReceive);

        imv.displayMoneyDelta(oreToReceive);
        ARIS.setItemCount(imm.ITEM_ID_ORE, imm.ore+oreToReceive);
        if(imm.currentLevel != 1) ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+(oreToReceive*imm.oreWorth));
    }

    function fail()
    { 
        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost; 

        dynamiteSticksImg.src = 'assets/dynamite_red.png';
        dynamiteExplosion.style.display = 'block';

        imv.displayMoneyDelta(-1*moneyLost);
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);

        failCount++;
        checkGuru(false, -1*moneyLost);
    }

    function checkGuru(success, amount)
    {
        if(imm.currentLevel == 1)
        {
            if(success && successCount == 1) 
                imv.displayGuruWithMessage("Nice work, kid. Give it one more blast to <b>collect some more ore</b>- then consider yourself a qualified blaster.");
            else if(success && successCount == 2)
            {
                imv.currentGuruButton.onclick = function(){ARIS.exitToScanner("Scan something in the iron mine!");};
                imv.displayGuruWithMessage("Perfect. Now that you've mastered the <b>dynamite</b>, be sure to <b>check out the drill and the backer</b>.");
                ARIS.setItemCount(imm.ITEM_ID_DYNAMITE, 1);
            }
            else if(!success && failCount == 1)
                imv.displayGuruWithMessage("You blew up Sven. <b>Medical bills are expensive...</b> Next time give the guys a chance to clear the area and <b>wait until the light turns green</b>.");
        }
        else if(imm.currentLevel == 2)
        {
            if(success && successCount == 1) 
            {
                var moneyMade = amount*imm.oreWorth;
                imv.displayGuruWithMessage("That blast netted us <b>"+amount+" ore</b>! At <b>$0."+imm.oreWorth+" per ore</b>, that's <b>$"+((moneyMade-(moneyMade%100))/100)+'.'+(moneyMade%100 < 10 ? '0' : '')+(moneyMade%100)+"</b>. Keep it up!");
            }
            else if(!success && failCount == 1)
                imv.displayGuruWithMessage("Careful! First Sven, and now his cousin?! You can't afford to keep <b>paying these medical expenses</b>! You'll never make your day's wage if you keep <b>setting yourself back</b> like this...");
        }
    }

    this.events = [imm.stationId+'_DYNAMITE_SLOT_1_CHANGED',imm.stationId+'_DYNAMITE_SLOT_2_CHANGED',imm.stationId+'_DYNAMITE_SLOT_3_CHANGED',imm.stationId+'_DYNAMITE_SLOT_4_CHANGED',imm.stationId+'_DYNAMITE_SLOT_5_CHANGED',imm.stationId+'_DYNAMITE_SLOT_6_CHANGED',imm.stationId+'_PLUNGER_READY',imm.stationId+'_PLUNGER_PRESSED'];
    this.callbacks = [this.updateDynamiteSlot1,this.updateDynamiteSlot2,this.updateDynamiteSlot3,this.updateDynamiteSlot4,this.updateDynamiteSlot5,this.updateDynamiteSlot6, this.plungerReady,this.plungerPressed];
}
