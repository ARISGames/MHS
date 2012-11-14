var DynamiteGame = function()
{
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
    var dynamiteInstructions = document.getElementById('dynamiteinstructions');
    var countdownStatus = document.getElementById('countdown');
    var countdownCount = 10;

    function countDown()
    {
        countdownStatus.innerHTML += countdownCount+"...";
        if(countdownCount != 0)
        {
            countdownCount--;
            setTimeout(countDown, 1000);
        }
        else
        {
            countdownStatus.innerHTML = '';
            countdownCount = 10;
            currentState = STATE_EMPTY_DYNAMITE;
            dynamiteInstructions.innerHTML = 'Empty Dynamite';
            if(allHolesFilled)
                ARIS.setItemCount(imm.ITEM_IDS[0], imm.money+15);
            else
                ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-15);
        }
    }
    
    this.updateDynamiteState = function(data)
    {
        holesFilledFlags = JSON.parse(data).state;
        allHolesFilled = true;
        allHolesEmpty = true;
        for(var i = 0; i < holesFilledFlags.length; i++)
        {
            if(!holesFilledFlags[i]) allHolesFilled = false;
            else allHolesEmpty = false;
            dynamiteHoles[i].innerHTML = holesFilledFlags[i] ? 'x' : 'o';
        }

        if(allHolesFilled && currentState != STATE_EMPTY_DYNAMITE)
        {
            currentState = STATE_PRESS_PLUNGER;
            dynamiteInstructions.innerHTML = 'Press Plunger!';
        }
        else
        {
            if(currentState != STATE_RUN)
            {
                if(allHolesEmpty || currentState != STATE_EMPTY_DYNAMITE)
                {
                    currentState = STATE_LOAD_DYNAMITE;
                    dynamiteInstructions.innerHTML = 'Load Dynamite';
                }
            }
        }
    }

    this.plungerPressed = function(data)
    {
        if(currentState != STATE_PRESS_PLUNGER)
        {
            if(allHolesEmpty)
            {
                currentState = STATE_LOAD_DYNAMITE;
                dynamiteInstructions.innerHTML = 'Load Dynamite!';
            }
            else
            {
                currentState = STATE_EMPTY_DYNAMITE;
                dynamiteInstructions.innerHTML = 'Empty Dynamite';
            }
            ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-15);
        }
        else
        {
            currentState = STATE_RUN;
            dynamiteInstructions.innerHTML = 'RUN!';
            countDown();
        }
    }

    this.events = [imm.stationId+'_DYNAMITE_STATE_CHANGED',imm.stationId+'_PLUNGER_PRESSED'];
    this.callbacks = [this.updateDynamiteState, this.plungerPressed];
}
