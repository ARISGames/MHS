var IronMineView = function()
{
    this.currentScene = null;
    this.loadingScene = document.getElementById('loading');
    this.introsScene = document.getElementById('intros');
    this.gamesScene = document.getElementById('games');
    this.scenes = [this.loadingScene, this.introsScene, this.gamesScene, null];

    this.currentIntro = null;
    this.drillIntro = document.getElementById('drillintro');
    this.dynamiteIntro = document.getElementById('dynamiteintro');
    this.backerIntro = document.getElementById('backerintro');
    this.intros = [this.drillIntro, this.dynamiteIntro, this.backerIntro];

    this.currentGameName = "";
    this.drillGameName = "driller";
    this.dynamiteGameName = "blaster";
    this.backerGameName = "barman";
    this.gameNames = [this.drillGameName, this.dynamiteGameName, this.backerGameName];

    this.currentGame = null;
    this.drillGame = document.getElementById('drillgame');
    this.dynamiteGame = document.getElementById('dynamitegame');
    this.backerGame = document.getElementById('backergame');
    this.games = [this.drillGame, this.dynamiteGame, this.backerGame];

    //These 'views' are injected into the current game
    this.notice = document.createElement('div');
    this.notice.setAttribute('id','notice');
    this.notice.fade = 0; //0-120
    document.getElementById('games').appendChild(this.notice);

    this.fail = document.createElement('div');
    this.fail.setAttribute('id','fail');
    this.fail.fade = 0; //0-120
    this.failBG = new Image();
    this.failBG.setAttribute('id','failBG');
    this.failFG = new Image();
    this.failFG.setAttribute('id','failFG');
    this.fail.appendChild(this.failBG);
    this.fail.appendChild(this.failFG);
    document.getElementById('games').appendChild(this.fail);

    this.HUDbg = document.createElement('img');
    this.HUDbg.setAttribute('src','assets/money_back.png');
    this.HUDbg.style.width='90px';
    this.HUDbg.style.position='absolute';
    this.haveDisplay = document.createElement('div');
    this.haveDisplay.setAttribute('id','havedisplay');
    this.haveDisplay.setAttribute('class','display');
    this.haveDisplay.innerHTML = '$0.00';
    this.wantDisplay = document.createElement('div');
    this.wantDisplay.setAttribute('id','wantdisplay');
    this.wantDisplay.setAttribute('class','display');
    this.wantDisplay.innerHTML = 'GOAL: $0.00';

    this.currentHud = null;
    this.drillHUD = document.getElementById('drillhud');
    this.dynamiteHUD = document.getElementById('dynamitehud');
    this.backerHUD = document.getElementById('backerhud');
    this.HUDs = [this.drillHUD, this.dynamiteHUD, this.backerHUD];

    this.displayGame = function(game)
    {
        this.currentIntro = this.intros[game];
        this.currentIntro.style.display = 'block';
        this.currentGameName = this.gameNames[game];
        this.currentGame = this.games[game];
        this.currentGame.style.display = 'block';
        this.currentHUD = this.HUDs[game];
        this.currentHUD.appendChild(this.HUDbg);
        this.currentHUD.appendChild(this.haveDisplay);
        this.currentHUD.appendChild(this.wantDisplay);
        this.failBG.src = "assets/"+this.currentGameName+"gifback.png";
        this.failFG.src = "assets/"+this.currentGameName+".gif";
    }

    this.displayNotice = function(notice)
    {
        var alreadyTicking = false;
        this.notice.innerHTML = notice;
        if(this.notice.fade != 0)
            alreadyTicking = true;
        this.notice.fade = 120;
        this.notice.style.display = 'block';
        if(!alreadyTicking)
            tickNotice();
    }

    var tickNotice = function()
    {
        this.notice.style.color = 'rgba(255,255,255,'+(this.notice.fade/120)+')';
        this.notice.fade--;
        if(this.notice.fade > 0)
            setTimeout(tickNotice, 10);
        else
            hideNotice();
    }

    var hideNotice = function()
    {
        this.notice.fade = 0;
        this.notice.style.color = 'rgba(255,255,255,0.0)';
        this.notice.style.display = 'none';
    }

    this.displayFail = function()
    {
        var alreadyTicking = false;
        if(this.fail.fade != 0)
            alreadyTicking = true;
        this.fail.fade = 120;
        this.fail.style.display = 'block';
        if(!alreadyTicking)
            tickFail();
    }

    var tickFail = function()
    {
        this.fail.fade--;
        if(this.fail.fade < 20)
        {
            this.failBG.style.opacity = this.fail.fade/20;
            this.failFG.style.opacity = this.fail.fade/20;
        }
        else
        {
            this.failBG.style.opacity = 1.0;
            this.failFG.style.opacity = 1.0;
        }
        if(this.fail.fade > 0)
            setTimeout(tickFail, 10);
        else
            hideFail();
    }

    var hideFail = function()
    {
        this.fail.fade = 0;
        this.failBG.style.opacity = '0.0';
        this.failFG.style.opacity = '0.0';
        this.fail.style.display = 'none';
    }

    this.setScene = function(scene)
    {
        for(var i = 0; i < this.scenes.length-1; i++) this.scenes[i].style.display = 'none';
        this.currentScene = scene;
        if(scene != null) scene.style.display = 'block';
    }

    this.nextScene = function()
    {
        for(var i = 0; i < this.scenes.length-1; i++)
            if(this.scenes[i] == this.currentScene) { this.setScene(this.scenes[i+1]); break; }

        if(this.currentScene == null) this.setScene(this.scenes[0]);
    }
}
