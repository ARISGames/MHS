var IronMineView = function()
{
    this.currentScene = null;
    this.loadingScene = document.getElementById('loading');
    this.introsScene = document.getElementById('intros');
    this.videosScene = document.getElementById('videos');
    this.gamesScene = document.getElementById('games');
    this.scenes = [this.loadingScene, this.introsScene, this.videosScene, this.gamesScene, null];

    this.currentIntro = null;
    this.drillIntro = document.getElementById('drillintro');
    this.dynamiteIntro = document.getElementById('dynamiteintro');
    this.backerIntro = document.getElementById('backerintro');
    this.intros = [this.drillIntro, this.dynamiteIntro, this.backerIntro];

    this.currentVideo = null;
    this.drillVideo = document.getElementById('drillvideo');
    this.dynamiteVideo = document.getElementById('dynamitevideo');
    this.backerVideo = document.getElementById('backervideo');
    this.videos = [this.drillVideo, this.dynamiteVideo, this.backerVideo];

    this.currentGame = null;
    this.drillGame = document.getElementById('drillgame');
    this.dynamiteGame = document.getElementById('dynamitegame');
    this.backerGame = document.getElementById('backergame');
    this.games = [this.drillGame, this.dynamiteGame, this.backerGame];

    //These 'views' are injected into the current game
    this.haveDisplay = document.createElement('div');
    this.haveDisplay.setAttribute('id','havedisplay');
    this.haveDisplay.setAttribute('class','display');
    this.haveDisplay.innerHTML = '+$0.00';
    this.wantDisplay = document.createElement('div');
    this.wantDisplay.setAttribute('id','wantdisplay');
    this.wantDisplay.setAttribute('class','display');
    this.wantDisplay.innerHTML = '$0.00';

    this.currentHud = null;
    this.drillHUD = document.getElementById('drillhud');
    this.dynamiteHUD = document.getElementById('dynamitehud');
    this.backerHUD = document.getElementById('backerhud');
    this.HUDs = [this.drillHUD, this.dynamiteHUD, this.backerHUD];

    this.displayGame = function(game)
    {
        this.currentIntro = this.intros[game];
        this.currentIntro.style.display = 'block';
        this.currentVideo = this.videos[game];
        this.currentVideo.style.display = 'block';
        this.currentGame = this.games[game];
        this.currentGame.style.display = 'block';
        this.currentHUD = this.HUDs[game];
        this.currentHUD.appendChild(this.haveDisplay);
        this.currentHUD.appendChild(this.wantDisplay);
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
