var CELL_SIZE = 16;  //マスのサイズ
var COL_COUNT = 6;   //横のマス数
var ROW_COUNT = 12;  //縦のマス数

var context = null;

// enchant.js を使う前に必要な処理。
enchant();

window.onload = function () {

    // Game オブジェクトを作成する
    var game = new Core(CELL_SIZE * 10, CELL_SIZE * 13);

    // ゲームのFPS
    game.fps = 15;

    // 必要なファイルを相対パスで引数に指定する。 ファイルはすべて、ゲームが始まる前にロードされる。
    game.preload("images/puyopuyo2.png", "images/map0.png", "images/gameover.png");

    // ロードが完了したら、ゲームの処理を実行していく
    game.onload = function () {

        //コンテキストクラスの作成
        context = new GameContext(game);
        context.controller = new GameController();
        context.map = new GameMap();

        game.scale = 1;

        // マップの作成
        game.rootScene.addChild(GameMap.createEnchantMap());

        // フレームが描画される前の処理 
        game.addEventListener("enterframe", enterFrame);

        // 開始処理 
        context.startGame();
    };

    //ゲームを開始する
    game.start();
};

/**
 * フレームが描画される前の処理
 */
function enterFrame() {

    //ゲーム状態に応じて処理を振り分ける
    if (GameContext.currnt().state == GAME_STATE.WAIT_NEXT) {
        //次のぷよの落下待ちの場合
        if (GameContext.currnt().map.isGameOver()) {
            //ゲームオーバーの場合
            //alert("gameover");
            GameContext.currnt().endGame();
        } else {
            //次の[ぷよ]を降らせる
            GameContext.currnt().popNext();
        }
    } else if (GameContext.currnt().state == GAME_STATE.FIXED) {
        //落下中の[ぷよ]の配置が確定した場合
        //連鎖アニメーション処理
        GameContext.currnt().rensaAnimation();

    }
}

/**
 * ゲームオーバ画面の表示
 */
function pushGameOverScene() {

}
