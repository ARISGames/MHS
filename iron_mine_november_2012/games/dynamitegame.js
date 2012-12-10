var DynamiteGame = function()
{
    var self = this; //JAVASCRIIIIIIPPPPPTTTTTTT!!!!!!!!

    var STATE_LOAD_DYNAMITE = 0;
    var STATE_PRESS_PLUNGER = 1;
    var STATE_RUN = 2;
    var STATE_EMPTY_DYNAMITE = 3;
    var states = [STATE_LOAD_DYNAMITE, STATE_PRESS_PLUNGER, STATE_RUN, STATE_EMPTY_DYNAMITE];
    var currentState = STATE_LOAD_DYNAMITE;

    var holesFilledFlags = [false,false,false,false,false,false];
    var allHolesFilled = false;
    var allHolesEmpty = false;
    var dynamiteHoles = [document.getElementById('dynamitehole1'),
                         document.getElementById('dynamitehole2'),
                         document.getElementById('dynamitehole3'),
                         document.getElementById('dynamitehole4'),
                         document.getElementById('dynamitehole5'),
                         document.getElementById('dynamitehole6'),
                         document.getElementById('dynamitehole7')];
    var dynamiteIndicator = document.getElementById('dynamiteindicator');
    var countdownCount = 5;

    function countDown()
    {
        if(currentState == STATE_RUN)
        {
            dynamiteIndicator.src = 'assets/clock_'+countdownCount+'.png';
            if(countdownCount != 0)
            {
                countdownCount--;
                setTimeout(countDown, 1000);
            }
            else
            {
                currentState = STATE_PRESS_PLUNGER;
                dynamiteIndicator.src = 'assets/push_blaster.png';
            }
        }
    }
    
    this.updateDynamiteState = function(data)
    {
        holesFilledFlags = JSON.parse(data).state;
        allHolesFilled = true;
        allHolesEmpty = true;
        countdownCount = 5;
        for(var i = 0; i < holesFilledFlags.length; i++)
        {
            if(!holesFilledFlags[i]) allHolesFilled = false;
            else allHolesEmpty = false;
            dynamiteHoles[i].src = holesFilledFlags[i] ? 'assets/dynamite_red.png' : 'assets/dynamite_black.png';
        }

        if(allHolesFilled && currentState != STATE_EMPTY_DYNAMITE && currentState != STATE_RUN)
        {
            currentState = STATE_RUN;
            countDown();
        }
        else
        {
            if(currentState != STATE_RUN)
            {
                if(allHolesEmpty || currentState != STATE_EMPTY_DYNAMITE)
                {
                    currentState = STATE_LOAD_DYNAMITE;
                    dynamiteIndicator.src = 'assets/load_dynamite.png';
                }
            }
        }
    }

    this.updateDynamiteSlot1 = function(data)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[0] = (data == "true" ? true : false);
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.updateDynamiteSlot2 = function(data)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[1] = (data == "true" ? true : false);
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.updateDynamiteSlot3 = function(data)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[2] = (data == "true" ? true : false);
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.updateDynamiteSlot4 = function(data)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[3] = (data == "true" ? true : false);
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.updateDynamiteSlot5 = function(data)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[4] = (data == "true" ? true : false);
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.updateDynamiteSlot6 = function(data)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[5] = (data == "true" ? true : false);
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);
    }

    this.plungerPressed = function(data)
    {
        if(currentState != STATE_PRESS_PLUNGER)
        {
            ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-20);
        }
        else
        {
            currentState = STATE_EMPTY_DYNAMITE;
            if(countdownCount == 0 && allHolesFilled)
                ARIS.setItemCount(imm.ITEM_IDS[0], imm.money+20);
            else
                ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-20);
        }
    }

    //this.events = [imm.stationId+'_DYNAMITE_STATE_CHANGED',imm.stationId+'_PLUNGER_PRESSED'];
    //this.callbacks = [this.updateDynamiteState, this.plungerPressed];
    this.events = [imm.stationId+'_DYNAMITE_SLOT_1_CHANGED',imm.stationId+'_DYNAMITE_SLOT_2_CHANGED',imm.stationId+'_DYNAMITE_SLOT_3_CHANGED',imm.stationId+'_DYNAMITE_SLOT_4_CHANGED',imm.stationId+'_DYNAMITE_SLOT_5_CHANGED',imm.stationId+'_DYNAMITE_SLOT_6_CHANGED',imm.stationId+'_PLUNGER_PRESSED'];
    this.callbacks = [this.updateDynamiteSlot1,this.updateDynamiteSlot2,this.updateDynamiteSlot3,this.updateDynamiteSlot4,this.updateDynamiteSlot5,this.updateDynamiteSlot6, this.plungerPressed];
}
