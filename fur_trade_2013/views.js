var FurTradeViews = function()
{
    var self = this;

    self.currentRoleView     = null;
    self.currentIntroView    = null;
    self.currentGetView      = null;
    self.currentLoungeView   = null;
    self.currentTradeView    = null;
    self.currentTradeClientImageView = null;
    self.currentTradeClientNameView  = null;
    self.currentGuruView     = null;
    self.currentGuruTalkView = null;

    self.clerkRoleView     = document.getElementById('clerkrole');
    self.clerkIntroView    = document.getElementById('clerkintro');
    self.clerkGetView      = document.getElementById('clerkget');
    self.clerkLoungeView   = document.getElementById('clerklounge');
    self.clerkTradeView    = document.getElementById('clerktrade');
    self.clerkTradeClientImageView = document.getElementById('clerktradeclientimg');
    self.clerkTradeClientNameView  = document.getElementById('clerktradeclientname');
    self.clerkGuruView     = document.getElementById('clerkguru'); self.clerkGuruView.progress = 50;
    self.clerkGuruTalkView = document.getElementById('clerkgurutalk');

    self.hunterRoleView     = document.getElementById('hunterrole');
    self.hunterIntroView    = document.getElementById('hunterintro');
    self.hunterGetView      = document.getElementById('hunterget');
    self.hunterLoungeView   = document.getElementById('hunterlounge');
    self.hunterTradeView    = document.getElementById('huntertrade');
    self.hunterTradeClientImageView = document.getElementById('huntertradeclientimg');
    self.hunterTradeClientNameView  = document.getElementById('huntertradeclientname');
    self.hunterGuruView     = document.getElementById('hunterguru'); self.hunterGuruView.progress = 50;
    self.hunterGuruTalkView = document.getElementById('huntergurutalk');

    //These 'views' are injected into the current game
    var deltaview = document.createElement('div');
    deltaview.setAttribute('id','deltaview');
    deltaview.fade = 0; //0-500
    deltaview.delta = 0;

    var hud = document.createElement('div');
    hud.setAttribute('id','hud');
    self.haveDisplay = document.createElement('div');
    self.haveDisplay.setAttribute('id','havedisplay');
    self.haveDisplay.innerHTML = '';
    self.wantDisplay = document.createElement('div');
    self.wantDisplay.setAttribute('id','wantdisplay');
    self.wantDisplay.innerHTML = '&nbsp;&nbsp;';
    hud.appendChild(self.haveDisplay);
    hud.appendChild(self.wantDisplay);
    hud.appendChild(deltaview);

    self.failHUD = function()    { self.haveDisplay.style.color = "#C42032"; }
    self.neutralHUD = function() { self.haveDisplay.style.color = "#EDB11F"; }
    self.successHUD = function() { self.haveDisplay.style.color = "#009344"; }

    self.displayLoading = function()
    {
        document.getElementById('vidfile').pause();
        document.getElementById('vid').style.display     = 'none';
        document.getElementById('loading').style.display = 'block';
    }

    self.displayVid = function()
    {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('vid').style.display     = 'block';
        document.getElementById('vidfile').play();
    }

    self.displayRole = function(role)
    {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('vid').style.display     = 'none';
        document.getElementById('vidfile').pause();

        if(self.currentRoleView)   self.currentRoleView.style.display  = 'none';
        if(self.currentIntroView)  self.currentIntroView.style.display = 'none';
        if(self.currentGetView)    self.currentGetView.style.display   = 'none';
        if(self.currentLoungeView) self.currentLoungeView.style.display = 'none';
        if(self.currentTradeView)  self.currentTradeView.style.display = 'none';

        if(role == roleHunter)
        {
            self.currentRoleView      = self.hunterRoleView;
            self.currentIntroView     = self.hunterIntroView;
            self.currentGetView       = self.hunterGetView;
            self.currentLoungeView    = self.hunterLoungeView;
            self.currentTradeView     = self.hunterTradeView;
            self.currentTradeClientImageView = self.hunterTradeClientImageView;
            self.currentTradeClientNameView  = self.hunterTradeClientNameView;
            self.currentGuruView      = self.hunterGuruView;
            self.currentGuruTalkView  = self.hunterGuruTalkView;
        }
        else if(role == roleClerk)
        {
            self.currentRoleView      = self.clerkRoleView;
            self.currentIntroView     = self.clerkIntroView;
            self.currentGetView       = self.clerkGetView;
            self.currentLoungeView    = self.clerkLoungeView;
            self.currentTradeView     = self.clerkTradeView;
            self.currentTradeClientImageView = self.clerkTradeClientImageView;
            self.currentTradeClientNameView  = self.clerkTradeClientNameView;
            self.currentGuruView      = self.clerkGuruView;
            self.currentGuruTalkView  = self.clerkGuruTalkView;
        }

        self.currentRoleView.style.display = 'block';
    }

    self.displayIntro = function()
    {
        if(self.currentIntroView)    self.currentIntroView.style.display  = 'block';
        if(self.currentGetView)      self.currentGetView.style.display    = 'none';
        if(self.currentLoungeView)   self.currentLoungeView.style.display = 'none';
        if(self.currentTradeView)    self.currentTradeView.style.display  = 'none';
    }

    self.displayGet = function()
    {
        self.currentGetView.appendChild(hud);

        if(self.currentIntroView)    self.currentIntroView.style.display  = 'none';
        if(self.currentGetView)      self.currentGetView.style.display    = 'block';
        if(self.currentLoungeView)   self.currentLoungeView.style.display = 'none';
        if(self.currentTradeView)    self.currentTradeView.style.display  = 'none';
    }

    self.displayLounge = function()
    {
        if(self.currentIntroView)     self.currentIntroView.style.display    = 'none';
        if(self.currentGetView)       self.currentGetView.style.display      = 'none';
        if(self.currentLoungeView)    self.currentLoungeView.style.display    = 'block';
        if(self.currentTradeView)     self.currentTradeView.style.display    = 'none';
    }

    self.displayTrade = function()
    {
        if(self.currentIntroView)     self.currentIntroView.style.display     = 'none';
        if(self.currentGetView)       self.currentGetView.style.display       = 'none';
        if(self.currentLoungeView)    self.currentLoungeView.style.display    = 'none';
        if(self.currentTradeView)     self.currentTradeView.style.display     = 'block';
    }

    self.displayGuruWithMessage = function(message)
    {
        self.currentGuruView.style.display = 'block';
        self.currentGuruTalkView.innerHTML = message;

        var alreadyTicking = (self.currentGuruView.progress != 50);
        self.currentGuruView.progress = 0;
        if(!alreadyTicking) tickdisplayguru();
    }

    var tickdisplayguru = function()
    {
        self.currentGuruView.progress++;
        self.currentGuruView.style.top = (10*(50-self.currentGuruView.progress))+'px';
        if(self.currentGuruView.progress < 50)
            setTimeout(tickdisplayguru, 10);
    }

    self.hideGuru = function()
    {
        if(self.currentGuruView)
        {
            var alreadyTicking = (self.currentGuruView.progress != 50);
            self.currentGuruView.progress = 0;
            if(!alreadyTicking) tickhideguru();
        }
    }

    var tickhideguru = function()
    {
        self.currentGuruView.progress++;
        self.currentGuruView.style.top = (10*self.currentGuruView.progress)+'px';
        if(self.currentGuruView.progress < 50)
            setTimeout(tickhideguru,10);
        else
            self.currentGuruView.style.display = 'none';
    }

    self.displaydelta = function(txt, delta)
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

    var tickdelta = function()
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
}

