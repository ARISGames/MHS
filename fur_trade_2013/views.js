    var currentRoleView     = null;
    var currentVidView      = null;
    var currentVidFileView  = null;
    var currentIntroView    = null;
    var currentGetView      = null;
    var currentTradeView    = null;
    var currentGuruView     = null;
    var currentGuruTalkView = null;

    var clerkRoleView;
    var clerkVidView;
    var clerkVidFileView;
    var clerkIntroView;
    var clerkGetView;
    var clerkTradeView;
    var clerkGuruView;
    var clerkGuruTalkView;
    var hunterRoleView;
    var hunterVidView;
    var hunterVidFileView;
    var hunterIntroView;
    var hunterGetView;
    var hunterTradeView;
    var hunterGuruView;
    var hunterGuruTalkView;
    var roleViews;
    var vidViews;
    var vidFileViews;
    var introViews;
    var getViews;
    var tradeViews;
    var guruViews;
    var guruTalkViews;
    function initViews() //need to wait until initialization of dom
    {
        clerkRoleView     = document.getElementById('clerkrole');
        clerkVidView      = document.getElementById('clerkvid');
        clerkVidFileView  = document.getElementById('clerkvidfile');
        clerkIntroView    = document.getElementById('clerkintro');
        clerkGetView      = document.getElementById('clerkget');
        clerkTradeView    = document.getElementById('clerktrade');
        clerkGuruView     = document.getElementById('clerkguru');
        clerkGuruTalkView = document.getElementById('clerkgurutalk');

        hunterRoleView     = document.getElementById('hunterrole');
        hunterVidView      = document.getElementById('huntervid');
        hunterVidFileView  = document.getElementById('huntervidfile');
        hunterIntroView    = document.getElementById('hunterintro');
        hunterGetView      = document.getElementById('hunterget');
        hunterTradeView    = document.getElementById('huntertrade');
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
    }

    //These 'views' are injected into the current game
    var deltaview = document.createElement('div');
    deltaview.setAttribute('id','deltaview');
    deltaview.fade = 0; //0-500
    deltaview.delta = 0;

    var hud = document.createElement('div');
    hud.setAttribute('id','hud');
    var haveDisplay = document.createElement('div');
    haveDisplay.setAttribute('id','havedisplay');
    haveDisplay.innerHTML = '';
    var wantDisplay = document.createElement('div');
    wantDisplay.setAttribute('id','wantdisplay');
    wantDisplay.innerHTML = '&nbsp;&nbsp;';
    hud.appendChild(haveDisplay);
    hud.appendChild(wantDisplay);
    hud.appendChild(deltaview);

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
        currentGetView.appendChild(hud);

        if(currentRole.roleEnum == roleEnumClerk)  formatClerkGet();
        if(currentRole.roleEnum == roleEnumHunter) formatHunterGet();

        if(currentVidView)     currentVidView.style.display   = 'none';
        if(currentVidFileView) currentVidFileView.pause();
        if(currentIntroView)   currentIntroView.style.display = 'none';
        if(currentGetView)     currentGetView.style.display   = 'block';
        if(currentTradeView)   currentTradeView.style.display = 'none';
        if(currentGuruView)    currentGuruView.style.display  = 'none';
    }

    function displayTrade()
    {
        currentTradeView.appendChild(hud);

        if(currentRole.roleEnum == roleEnumClerk)  formatClerkTrade();
        if(currentRole.roleEnum == roleEnumHunter) formatHunterTrade();

        if(currentVidView)     currentVidView.style.display   = 'none';
        if(currentVidFileView) currentVidFileView.pause();
        if(currentIntroView)   currentIntroView.style.display = 'none';
        if(currentGetView)     currentGetView.style.display   = 'none';
        if(currentTradeView)   currentTradeView.style.display = 'block';
        if(currentGuruView)    currentGuruView.style.display  = 'none';
    }

    function formatClerkGet()
    {
        haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        wantDisplay.innerHTML = "&nbsp;&nbsp;Cost: "+webPageItem.peltCost;
        document.getElementById("clerkitemget").src = "assets/"+webPageItem.imageName;
        document.getElementById("sellerdialog").innerHTML = "I've got some <b>"+webPageItem.name+"s</b> here... I'd be willing to part with one for the price of <b>"+webPageItem.peltCost+" pelts</b>. Whad'ya say, kid?";
        document.getElementById("sellerbuttontext").innerHTML = "Buy "+webPageItem.name;
    }

    function formatHunterGet()
    {
        haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        wantDisplay.innerHTML = "&nbsp;&nbsp;You Need:10 pelts";
    }

    function formatClerkTrade()
    {
    }

    function formatHunterTrade()
    {
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

    function displaydelta(txt, delta)
    {
        if(delta > 0) deltaview.style.color = "#009344";
        else          deltaview.style.color = "#C42032";
        deltaview.delta = delta;

        if(delta > 0) deltaview.innerHTML = "+"+delta+" "+txt;
        else          deltaview.innerHTML = delta+" "+txt; //'-' auto added
        var alreadyTicking = (deltaview.fade != 0);
        deltaview.fade = 500;
        deltaview.style.display = 'block';
        if(!alreadyTicking) tickdelta();
    }

    function tickdelta()
    {
        if(deltaview.delta > 0)
        {
            deltaview.style.color = "rgba(0,147,68,"+(deltaview.fade/500)+")";
            deltaview.style.top = (200-1/4*(500-deltaview.fade))+'px';
        }
        else
        {
            deltaview.style.color = "rgba(196,32,50,"+(deltaview.fade/500)+")";
            deltaview.style.top = (200+1/4*(500-deltaview.fade))+'px';
        }

        deltaview.fade--;
        if(deltaview.fade > 0)
            setTimeout(tickdelta, 10);
        else
        {
            deltaview.style.color = 'rgba(255,255,255,0.0)';
            deltaview.style.display = 'none';
        }
    }

