var DynamiteGame = function()
{
    var self = this; //JAVASCRIIIIIIPPPPPTTTTTTT!!!!!!!!

    var STATE_LOAD_DYNAMITE = 0;
    var STATE_RUN = 1;
    var STATE_PRESS_PLUNGER = 2;
    var states = [STATE_LOAD_DYNAMITE, STATE_RUN, STATE_PRESS_PLUNGER];
    var currentState = STATE_LOAD_DYNAMITE;

    var moneyReceived = 100;
    var moneyLost = 200;

    var holesFilledFlags = [false,false,false,false,false,false];
    var allHolesFilled   = false;
    var allHolesEmpty    = false;
    var dynamiteHoles = [document.getElementById('dynamitehole1'),
                         document.getElementById('dynamitehole2'),
                         document.getElementById('dynamitehole3'),
                         document.getElementById('dynamitehole4'),
                         document.getElementById('dynamitehole5'),
                         document.getElementById('dynamitehole6'),
                         document.getElementById('dynamitehole7')];
    var dynamiteIndicator = document.getElementById('dynamiteindicator');

    this.updateDynamiteState = function(data)
    {
        holesFilledFlags = JSON.parse(data).state;
        allHolesFilled = true;
        allHolesEmpty = true;
        for(var i = 0; i < holesFilledFlags.length; i++)
        {
            if(!holesFilledFlags[i]) allHolesFilled = false;
            else                     allHolesEmpty  = false;
            dynamiteHoles[i].src = holesFilledFlags[i] ? 'assets/dynamite_red.png' : 'assets/dynamite_black.png';
        }

        if(currentState == STATE_LOAD_DYNAMITE && allHolesFilled)
        {
            currentState = STATE_RUN;
            dynamiteIndicator.src = 'assets/blaster_instruction_clear.png';
        }
    }

    var updateDynamiteSlotTrue = function(slot)
    {
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = holesFilledFlags[i];
        newHolesFilledFlags[slot-1] = true;
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
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = true;
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);

        dynamiteIndicator.src = 'assets/blaster_instruction_ready.png';
        currentState = STATE_PRESS_PLUNGER;
    }

    this.plungerPressed = function(data)
    {
        if(currentState != STATE_PRESS_PLUNGER)
        { 
            //trust this
            if(imm.money < moneyLost) imm.money = moneyLost; 
            ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-moneyLost);
            imv.displayNotice("You've gained "+moneyReceived+" cents!");
        }
        else
        {
            ARIS.setItemCount(imm.ITEM_IDS[0], imm.money+moneyReceived);
            imv.displayNotice("You've lost "+moneyLost+" cents!");
        }

        //Empty the dynamite
        var newHolesFilledFlags = [];
        for(var i = 0; i < holesFilledFlags.length; i++)
            newHolesFilledFlags[i] = false;
        var fakeData = "{\"state\":"+JSON.stringify(newHolesFilledFlags)+"}";
        self.updateDynamiteState(fakeData);

        currentState = STATE_LOAD_DYNAMITE;
        dynamiteIndicator.src = 'assets/blaster_instruction_load.png';
    }

    this.events = [imm.stationId+'_DYNAMITE_SLOT_1_CHANGED',imm.stationId+'_DYNAMITE_SLOT_2_CHANGED',imm.stationId+'_DYNAMITE_SLOT_3_CHANGED',imm.stationId+'_DYNAMITE_SLOT_4_CHANGED',imm.stationId+'_DYNAMITE_SLOT_5_CHANGED',imm.stationId+'_DYNAMITE_SLOT_6_CHANGED',imm.stationId+'_PLUNGER_READY',imm.stationId+'_PLUNGER_PRESSED'];
    this.callbacks = [this.updateDynamiteSlot1,this.updateDynamiteSlot2,this.updateDynamiteSlot3,this.updateDynamiteSlot4,this.updateDynamiteSlot5,this.updateDynamiteSlot6, this.plungerReady,this.plungerPressed];
}
