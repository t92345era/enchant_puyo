var GAME_STATE = {
  STOP: "STOP",
  WAIT_NEXT: "WAIT_NEXT",
  FALLING: "FALLING",
  WAIT_FIX: "WAIT_FIXED",
  FIXED: "FIXED",
  RENSA_ANIME: "RENSA_ANIME",
  GAME_OVER: "GAME_OVER"
};

/**
 * ゲームの状態を管理するコンテキストクラス
 */
class GameContext {

  /**
   * コンテキストクラスのインスタンスを取得します
   */
  static currnt() {
    return context;
  }

  /**
   * コンストラクタ
   * @param game ゲームオブジェクト
   */
  constructor(game) {
    // ゲームオブジェクト
    this.game = game;
    // キーボード操作に対応するコントローラクラス
    this.controller = null;
    // [ぷよ]の配置状況を管理するマップクラス
    this.map = null;
    // 現在落下中の[ぷよ]を格納する変数
    this.dropingPuyoPair = null;     
    // 次に落ちる[ぷよ]のリスト
    this.nextList = [];     
    // ゲーム状態の初期値設定
    this.state = GAME_STATE.STOP;
  }

  /**
   * ゲームの開始
   */
  startGame() {
    //次に落ちる[ぷよ]を２つ設定する
    this.pushNext();
    this.pushNext();
    //コントローラを開始する
    this.controller.start();
    //ゲーム状態を、[ぷよ]の落下待ちに設定する
    this.state = GAME_STATE.WAIT_NEXT;
  }

  /**
   * ゲームの終了(game over)
   */
  endGame() {
    // コントローラを停止
    this.controller.stop();
    //ゲーム状態を、ゲームオーバ状態に設定
    this.state = GAME_STATE.GAME_OVER;
    //ゲームオーバ画面を表示するシーンを追加する
    this.pushGameOverScene();
  }

  /** 
   * ゲーム情報の初期化 
   */
  clearGame() {
    this.map.removeAllPuyo();
    this.dropingPuyoPair = null;     
    this.nextList.forEach((puyoPair) => {
      this.game.rootScene.removeChild(puyoPair.puyo1.sprite);
      this.game.rootScene.removeChild(puyoPair.puyo2.sprite);
    });
    this.nextList = [];     
    this.state = GAME_STATE.STOP;
  }

  /**
   * 次に落ちる[ぷよ]を１件追加します
   */
  pushNext() {
    //ランダムな色の２つの[ぷよ]を生成
    let puyoPair = PuyoPair.randamCreate(this.game);
    this.game.rootScene.addChild(puyoPair.puyo1.sprite);
    this.game.rootScene.addChild(puyoPair.puyo2.sprite);
    this.nextList.push(puyoPair);
    puyoPair.setStockPosition(this.nextList.length - 1);
  }

  /**
   * 次に落ちる[ぷよ]のリストから１件取り出します
   */
  popNext() {

    //[ぷよ]を１件取り出す
    let puyoPair = this.nextList.shift();
    this.nextList.forEach((puyoPair, index) => puyoPair.setStockPosition(index));
    
    // 次に落ちる[ぷよ]に１つ足す
    this.pushNext();

    //取り出した[ぷよ]を、落下中の[ぷよ]に設定する
    this.dropingPuyoPair = puyoPair;
    this.dropingPuyoPair.setPosition(-1, 2);
    this.state = GAME_STATE.FALLING;
    return puyoPair;
  }

  /**
   * 現在落下中の[ぷよ]を確定する
   */
  fixDrop() {
    //落下中の[ぷよ]を確定
    this.dropingPuyoPair.fix();
    this.dropingPuyoPair = null;
    this.state = GAME_STATE.FIXED;
  }

  /**
   * 連鎖アニメーション処理を開始する
   */
  rensaAnimation() {
    this.state = GAME_STATE.RENSA_ANIME;
    let animation = new RensaAnimation();
    animation.process();
  }

  /**
   * ゲームオーバ画面を表示する、Sceneを追加
   */
  pushGameOverScene() {

    // 新しく Scene を作成する
    let scene = new Scene();
    scene.backgroundColor = 'rgba(0, 0, 255, 0.5)';

    // GAME OVER画像を表示する Sprite を作成する
    let sprite = new Sprite(95, 49);
    sprite.image = this.game.assets["images/gameover.png"];
    sprite.x = CELL_SIZE * 2;
    sprite.y = CELL_SIZE * 4;
    scene.addChild(sprite);

    // ラベルを作成する
    let label = new Label("画面タッチでリトライ");
    label.font = '13px "Fira Sans", sans-serif';
    label.color = "#fff";
    label.y = sprite.y + 60;
    label.x = 0;
    label.width = this.game.width;
    label.textAlign = "center";
    scene.addChild(label);

    // シーンを追加します
    this.game.pushScene(scene);

    // 画面をタッチした際に、ゲームをリトライする為の処理
    scene.addEventListener(Event.TOUCH_START, (e) => { // シーンにタッチイベントを設定
      //ゲームオーバのSceneを取り除く
      this.game.popScene();
      //ゲームの初期化・リトライを行います
      this.clearGame();
      this.startGame();
    });
  }
}