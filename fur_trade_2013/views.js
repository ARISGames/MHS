    currentRoleView     = null;
    currentVidView      = null;
    currentVidFileView  = null;
    currentIntroView    = null;
    currentGetView      = null;
    currentTradeView    = null;
    currentGuruView     = null;
    currentGuruTalkView = null;

    clerkRoleView     = document.getElementById('clerkrole');
    clerkVidView      = document.getElementById('clerkvid');
    clerkVidFileView  = document.getElementById('clerkvidfile');
    clerkIntroView    = document.getElementById('clerkintro');
    clerkGetView      = document.getElementById('clerkGet');
    clerkTradeView    = document.getElementById('clerkTrade');
    clerkGuruView     = document.getElementById('clerkguru');
    clerkGuruTalkView = document.getElementById('clerkgurutalk');

    hunterRoleView     = document.getElementById('hunterrole');
    hunterVidView      = document.getElementById('huntervid');
    hunterVidFileView  = document.getElementById('huntervidfile');
    hunterIntroView    = document.getElementById('hunterintro');
    hunterGetView      = document.getElementById('hunterGet');
    hunterTradeView    = document.getElementById('hunterTrade');
    hunterGuruView     = document.getElementById('hunterguru');
    hunterGuruTalkView = document.getElementById('huntergurutalk');

    roleViews     = [clerkRoleView,     hunterRoleView];
    vidViews      = [clerkVidView,      hunterVidView];
    vidFileViews  = [clerkVidFileView,  hunterVidFileView];
    introViews    = [clerkIntroView,    hunterIntroView];
    getViews      = [clerkGetView,      hunterGetView];
    tradeViews    = [clerkTradeView,    hunterTradeView];
    guruViews     = [clerkGuruView,     hunterGuruView];
    guruTalkViews = [clerkGuruTalkView, hunterGuruTalkView];

    //These 'views' are injected into the current game
    var moneydelta = document.createElement('div');
    moneydelta.setAttribute('id','moneydelta');
    moneydelta.fade = 0; //0-960
    moneydelta.delta = 0;

    var hud = document.createElement('div');
    hud.setAttribute('id','hud');
    var haveDisplay = document.createElement('div');
    haveDisplay.setAttribute('id','havedisplay');
    haveDisplay.innerHTML = '$0.00';
    var wantDisplay = document.createElement('div');
    wantDisplay.setAttribute('id','wantdisplay');
    wantDisplay.innerHTML = '&nbsp;&nbsp;GOAL: $0.00';
    hud.appendChild(haveDisplay);
    hud.appendChild(wantDisplay);
    hud.appendChild(moneydelta);

    function failHUD()    { haveDisplay.style.color = "#C42032"; }
    function neutralHUD() { haveDisplay.style.color = "#EDB11F"; }
    function successHUD() { haveDisplay.style.color = "#009344"; }

    function displayRole(role)
    {
        document.getElementById('loading').style.display = 'none';

        if(currentRoleView)  currentRoleView.style.display  = 'none';
        if(currentVidView)   currentVidView.style.display   = 'none';
        if(currentIntroView) currentIntroView.style.display = 'none';
        if(currentGetView)   currentGetView.style.display   = 'none';
        if(currentTradeView) currentTradeView.style.display = 'none';
        if(currentGuruView)  currentGuruView.style.display  = 'none';

        currentRoleView     = roleViews[role];
        currentVidView      = vidViews[role];
        currentVidFileView  = vidFileViews[role];
        currentIntroView    = introViews[role];
        currentGetView      = getViews[role];
        currentTradeView    = tradeViews[role];
        currentGuruView     = guruViews[role]; currentGuruView.progress = 50;
        currentGuruTalkView = guruTalkViews[role];

        currentRoleView.style.display = 'block';
        currentGetView.appendChild(hud);
        currentTradeView.appendChild(hud);
    }

    function displayVid()
    {
        if(currentVidView)     currentVidView.style.display   = 'block';
        if(currentVidFileView) currentVidFileView.play();
        if(currentIntroView)   currentIntroView.style.display = 'none';
        if(currentGetView)     currentGetView.style.display   = 'none';
        if(currentTradeView)   currentTradeView.style.display = 'none';
        if(currentGuruView)    currentGuruView.style.display  = 'none';
    }

    function displayIntro()
    {
        if(currentVidView)     currentVidView.style.display   = 'none';
        if(currentVidFileView) currentVidFileView.pause();
        if(currentIntroView)   currentIntroView.style.display = 'block';
        if(currentGetView)     currentGetView.style.display   = 'none';
        if(currentTradeView)   currentTradeView.style.display = 'none';
        if(currentGuruView)    currentGuruView.style.display  = 'none';
    }

    function displayGet()
    {
        if(currentVidView)     currentVidView.style.display   = 'none';
        if(currentVidFileView) currentVidFileView.pause();
        if(currentIntroView)   currentIntroView.style.display = 'none';
        if(currentGetView)     currentGetView.style.display   = 'block';
        if(currentTradeView)   currentTradeView.style.display = 'none';
        if(currentGuruView)    currentGuruView.style.display  = 'none';
    }

    function displayTrade()
    {
        if(currentVidView)     currentVidView.style.display   = 'none';
        if(currentVidFileView) currentVidFileView.pause();
        if(currentIntroView)   currentIntroView.style.display = 'none';
        if(currentGetView)     currentGetView.style.display   = 'none';
        if(currentTradeView)   currentTradeView.style.display = 'block';
        if(currentGuruView)    currentGuruView.style.display  = 'none';
    }

    function displayGuruWithMessage(message)
    {
        currentGuruView.style.display = 'block';
        currentGuruTalkView.innerHTML = message;

        var alreadyTicking = (currentGuruView.progress != 50);
        currentGuruView.progress = 0;
        if(!alreadyTicking) tickdisplayguru();
    }

    function tickdisplayguru()
    {
        currentGuruView.progress++;
        currentGuruView.style.top = (10*(50-currentGuruView.progress))+'px';
        if(currentGuruView.progress < 50)
            setTimeout(tickdisplayguru, 10);
        else
            setTimeout(function(){hideGuru();}, 6000);
    }

    function hideGuru()
    {
        if(currentGuruView)
        {
            var alreadyTicking = (currentGuruView.progress != 50);
            currentGuruView.progress = 0;
            if(!alreadyTicking) tickhideguru();
        }
    }
    
    function tickhideguru()
    {
        currentGuruView.progress++;
        currentGuruView.style.top = (10*currentGuruView.progress)+'px';
        if(currentGuruView.progress < 50)
            setTimeout(tickhideguru,10);
        else
            currentGuruView.style.display = 'none';
    }

    function displayMoneyDelta(delta)
    {
        if(delta == 0) return;

        
        if(delta > 0) moneydelta.style.color = "#009344";
        else          moneydelta.style.color = "#C42032";
        moneydelta.delta = delta;

        if(delta < 0) delta *= -1;//so we can parse it to text without worrying about - signs
        moneydelta.innerHTML = (moneydelta.delta > 0 ? '+$' : '-$')+((delta-(delta%100))/100)+'.'+(delta%100 < 10 ? '0' : '')+(delta%100);
        var alreadyTicking = (moneydelta.fade != 0);
        moneydelta.fade = 960;
        moneydelta.style.display = 'block';
        if(!alreadyTicking) tickmoneydelta();
    }

    function tickmoneydelta()
    {
        if(moneydelta.delta > 0)
        {
            moneydelta.style.color = "rgba(0,147,68,"+(moneydelta.fade/960)+")";
            moneydelta.style.top = (200-1/8*(960-moneydelta.fade))+'px';
        }
        else
        {
            moneydelta.style.color = "rgba(196,32,50,"+(moneydelta.fade/960)+")";
            moneydelta.style.top = (200+1/8*(960-moneydelta.fade))+'px';
        }

        moneydelta.fade--;
        if(moneydelta.fade > 0)
            setTimeout(tickmoneydelta, 10);
        else
        {
            moneydelta.style.color = 'rgba(255,255,255,0.0)';
            moneydelta.style.display = 'none';
        }
    }

