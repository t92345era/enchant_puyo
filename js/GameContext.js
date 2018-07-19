var GAME_STATE = {
  STOP: "STOP",
  WAIT_NEXT: "WAIT_NEXT",
  FALLING: "FALLING",
  WAIT_FIX: "WAIT_FIXED",
  FIXED: "FIXED",
  RENSA_ANIME: "RENSA_ANIME"
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
    this.game = game;               // ゲームオブジェクト
    this.clearGame();
    this.controller = null;
    this.map = null;
  }

  /** 
   * ゲーム情報の初期化 
   */
  clearGame() {
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

}