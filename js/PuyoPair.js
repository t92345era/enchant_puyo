/**
 * 落下用の２つのぷよを管理するクラス
 */
class PuyoPair {

  /**
   * コンストラクタ
   */
  constructor() {
    this.puyo1 = null;
    this.puyo2 = null;
    this.row = 0;
    this.col = 0;
    this.angle = 0;
    this.stockIndex = 0;
  }

  /**
   * ゲームマップクラスを取得します
   */
  map() {
    return GameContext.currnt().map;
  }

  //行・列インデックスの設定
  setPosition(row, col) {
    this.row = row;
    this.col = col;
    
    //"ぷよ２"の表示位置
    this.puyo2.setPosition(row + 1, col);
    
    //回転の状態に応じて、"ぷよ１"の表示位置を設定
    let pos = PuyoPair.getRotationPos(this.row, this.col, this.angle);
    this.puyo1.setPosition(pos.row, pos.col);
  }

  /**
   * 次に落ちる[ぷよ]エリアに、[ぷよ]を配置する
   * @param {Number} stockIndex 次に落ちる[ぷよ]の順序を表す、０〜からの連番
   */
  setStockPosition(stockIndex) {
    this.row = 0;
    this.col = 0;
    this.puyo1.setPosition(stockIndex == 0 ? 0 : 3, 7);
    this.puyo2.setPosition(stockIndex == 0 ? 1 : 4, 7);
  }

  /** 左移動を行います */
  moveLeft() {
    if (!this.canMove(0, -1)) return false;
    this.setPosition(this.row, this.col - 1);
    return true;
  }

  /** 右移動を行います */
  moveRight() {
    if (!this.canMove(0, 1)) return false;
    this.setPosition(this.row, this.col + 1);
    return true;
  }

  /** 上移動？を行います */
  moveTop() {
    if (!this.canMove(-1, 0)) return false;
    this.setPosition(this.row - 1, this.col);
    return true;
  }

  /** 下移動を行います */
  moveBottom() {
    if (!this.canMove(1, 0)) return false;
    this.setPosition(this.row + 1, this.col);
    return true;
  }

  /** 最下部まで移動を行います */
  moveBottomLast() {
    while (true) {
      if (!this.moveBottom()) return;
    }
  }

  /**
   * 指定した行・列数の先に移動可能か判定します。
   * @param {Number} moveRow 行数
   * @param {Number} moveCol 列数
   */
  canMove(moveRow, moveCol) {

    //１つめの[ぷよ]の移動可否判定
    let pos = PuyoPair.getRotationPos(this.row, this.col, this.angle);
    if (this.map().canMove(pos.row, pos.col, moveRow, moveCol)) {
      //２つめの[ぷよ]の移動可否判定
      return this.map().canMove(this.row + 1, this.col, moveRow, moveCol);
    }
  }

  /** 回転を行います */
  rotation() {
    let tmpAngle = this.angle;

    // 90度ずつ回転を行う。現在の角度+90で壁を超えるなど、回転できない場合、
    // 現在の角度+180, 現在の角度+270と繰り返し処理を行い、回転出来る所まで処理を行う。
    for (let i = 0; i < 3; i++) {
      tmpAngle = tmpAngle == 270 ? 0 : tmpAngle + 90;
      let pos = PuyoPair.getRotationPos(this.row, this.col, tmpAngle);
      if (this.map().canMove(pos.row, pos.col, 0, 0)) {
        this.angle = tmpAngle;
        this.setPosition(this.row, this.col);
        break;
      }
    }
  }

  /**
   * 現在の[ぷよ]の落下位置で確定する
   */
  fix() {
    let pos = PuyoPair.getRotationPos(this.row, this.col, this.angle);
    this.map().setPuyo(this.puyo1, pos.row, pos.col);
    this.map().setPuyo(this.puyo2, this.row + 1, this.col);
  }

  /**
   * 回転後の行・列インデックスを取得
   * @param {Number} row 行インデックス
   * @param {Number} col 列インデックス
   * @param {Number} angle 角度(0/90/180/270)
   */
  static getRotationPos(row, col, angle) {
    let r1 = angle, r2 = angle + 90;
    let r = row + (Math.sign((r2 % 180)) * Math.sign(r2 - 180) + 1);
    let c = col + (Math.sign((r1 % 180)) * Math.sign(r1 - 180));
    return { row : r, col : c };
  }

  //ランダムにぷよペアを作成
  static randamCreate(game) {
    var pair = new PuyoPair();
    pair.puyo1 = Puyo.randamCreate(game);
    pair.puyo2 = Puyo.randamCreate(game);
    return pair;
  }
}