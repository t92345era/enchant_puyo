var KEY_CODE = {
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  ENTER: 13
}

/**
 * コントローラクラス
 */
class GameController {

  /**
   * コンストラクタ
   */
  constructor() {
    this.isStart = false;
    this.direction = 0;
    this.setupEventHandler();
  }

  /** コンテキストクラスの取得 */
  context() {
    return GameContext.currnt();
  }

  /** 現在キーボードイベントを受け付けているかを取得します。 */
  acceptKeybordEvent() {
    if (this.isStart) {
      if (this.context().dropingPuyoPair != null) {
        return true;
      }
    }
    return false;
  }

  /** キーボードイベントの処理 */
  handleKeyEvent(keyCode) {
    if (!this.acceptKeybordEvent()) {
      return;
    }

    if (keyCode == KEY_CODE.LEFT) {
      //左キー
      this.context().dropingPuyoPair.moveLeft();
    } else if (keyCode == KEY_CODE.RIGHT) {
      //右キー
      this.context().dropingPuyoPair.moveRight();
    } else if (keyCode == KEY_CODE.DOWN) {
      //下キー
      this.context().dropingPuyoPair.moveBottom();
    } else if (keyCode == KEY_CODE.UP) {
      //上キー
      this.context().dropingPuyoPair.moveTop();
    } else if (keyCode == KEY_CODE.SPACE) {
      //スペースキー
      this.context().dropingPuyoPair.rotation();
    } else if (keyCode == KEY_CODE.ENTER) {
      //Enterキー
      this.context().dropingPuyoPair.moveBottomLast();
      this.context().fixDrop();
    }
  }

  /** イベントハンドラの初期化 */
  setupEventHandler() {
    //KeyDown
    // /alert(this.context());
    this.context().game.addEventListener("keydown", (e) => {
      this.handleKeyEvent(e.keyCode);
    });
  }

  /** 入力イベントの受付を開始します */
  start() {
    this.isStart = true;
  }

  /** 入力イベントの受付を停止します */
  stop() {
    this.isStart = false;
  }

}