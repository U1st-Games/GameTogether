function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oBlackPanel;
    var _oWhitePanel;

    var _oMsgText;
    var _oMsgTextUnder;
    var _oFade;
    var _oListener;

    
    this._init = function(oSpriteBg){
        
        s_oGame.pauseGame(true);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        //s_oStage.addChild(_oFade);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;

        _oMsgText = new createjs.Text("","bold 90px "+PRIMARY_FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2) - 200;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 800;
        
        _oMsgTextUnder = new createjs.Text("","bold 40px "+PRIMARY_FONT, "#ffffff");
        _oMsgTextUnder.x = CANVAS_WIDTH/2;
        _oMsgTextUnder.y = (CANVAS_HEIGHT/2) - 150;
        _oMsgTextUnder.textAlign = "center";
        _oMsgTextUnder.textBaseline = "alphabetic";
        _oMsgTextUnder.lineWidth = 800;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oFade, _oBg,_oMsgText, _oMsgTextUnder);
        _oBlackPanel = new CInfoTurn(CANVAS_WIDTH/2,1120,PAWN_BLACK, _oGroup);
        _oBlackPanel.setBgVisible(false);
        _oBlackPanel.invert();
        _oWhitePanel = new CInfoTurn(CANVAS_WIDTH/2,970,PAWN_WHITE, _oGroup);
        _oWhitePanel.setBgVisible(false);
        _oWhitePanel.invert();
        //_oWhitePanel.setPawn(PAWN_WHITE);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iWinner, iBlackTime, iWhiteTime){
        
        _oBlackPanel.refreshTime(formatTime(iBlackTime));
        _oWhitePanel.refreshTime(formatTime(iWhiteTime));
        
        
        if(iWinner === WIN_WHITE){
            playSound("win",1,false); 
            
            
            _oMsgText.text = TEXT_WHITE + " " +TEXT_GAMEOVER;
        } else if(iWinner === WIN_BLACK) {
            if(MODE_HUMAN){
                playSound("win",1,false); 
            } else {
                playSound("game_over",1,false);
            }            
            _oMsgText.text = TEXT_BLACK + " " +TEXT_GAMEOVER;
            
        } else if(iWinner === DRAW){ //DRAW            
            playSound("game_over",1,false);
            _oMsgText.text = TEXT_DRAW;
        } else if(iWinner === WIN_WHITE_BLACK_NOMOVES){
            playSound("win",1,false); 
            _oMsgText.text = TEXT_WHITE + " " +TEXT_GAMEOVER;
            _oMsgTextUnder.text = "(" +TEXT_BLACK + " " + TEXT_MOVES_AVAIL +")";
        } else if(iWinner === WIN_BLACK_WHITE_NOMOVES){
            if(MODE_HUMAN){
                playSound("win",1,false);  
            } else {
                playSound("game_over",1,false);
            }            
            _oMsgText.text = TEXT_BLACK + " " +TEXT_GAMEOVER;
            _oMsgTextUnder.text = "(" +TEXT_WHITE + " " + TEXT_MOVES_AVAIL +")";
        }
       
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        //new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        var iWhiteScore = 1800000 - iWhiteTime;        
        $(s_oMain).trigger("save_score", [iWinner, iBlackTime, iWhiteTime, s_iGameType, iWhiteScore]);
        $(s_oMain).trigger("share_event", [iWhiteScore, s_iGameType, iWinner] ); 
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",_oListener);
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        s_oStage.removeChild(_oGroup);
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}
