/**
 * ゲーム版のマップおよび、[ぷよ]の配置状況を管理するクラスです
 */
class GameMap {

  /**
   * コンストラクタ
   */
  constructor() { 
    // [ぷよ]の配置状況を管理する縦12x横6の２次元配列を作成
    this.puyoList = [];
    for (var i = 0; i < ROW_COUNT; i++) {
      var ary = [];
      for (var j = 0; j < COL_COUNT; j++) {
        ary.push(null);
      }
      this.puyoList.push(ary);
    }
  }
  
  /**
   * row,colで指定した位置を基準に、
   * moveRow,moveColで指定された行・列数分の先に、移動可能かを判定します
   * @param {Number} puyo 移動対象の[ぷよ]
   * @param {Number} col 列インデックス
   * @param {Number} moveRowCount 移動する行数
   * @param {Number} moveColCount 移動する列数
   * @return 移動可能な場合 true
   */
  canMove(row, col, moveRow, moveCol) {
    var r = row + moveRow;
    var c = col + moveCol;

    if (row == -1 && row == r) return true;

    //行・列がゲーム盤からはみ出ないかチェックする
    if (r < 0 || r >= ROW_COUNT) return false;
    if (c < 0 || c >= COL_COUNT) return false;

    //移動先に[ぷよ]が配置されているかチェックする
    if (this.puyoList[r][c] != null) return false;

    //移動OK
    return true;
  }
  
  /**
   * [ぷよ]を追加します
   * @param {Puyo} puyo 
   */
  setPuyo(puyo, row, col) {
    if (row >= 0) {
      this.puyoList[row][col] = puyo;
      if (puyo != null) {
        puyo.setPosition(row, col);
      }
    }
  }

  /**
   * [ぷよ]を移動します。
   * @param {Number} row 行インデックス
   * @param {Number} col 列インデックス
   * @param {Number} toRow 移動先のインデックス
   * @param {Number} toCol 移動先のインデックス
   * @param {Number} animationFrame アニメーションするフレーム数
   */
  movePuyo(row, col, toRow, toCol, animationFrame) {
    let frame = typeof animationFrame === "undefined" ? 1 : animationFrame;
    frame = Math.max(frame, 1);

    let puyo = this.puyoList[row][col];
    if (puyo != null) {
      puyo.moveWithAnimate(toRow, toCol, animationFrame);
      this.puyoList[row][col] = null;
      this.puyoList[toRow][toCol] = puyo;
    }
  }

  /**
   * [ぷよ]の削除
   * @param {Number} row 行インデックス
   * @param {Number} col 列インデックス
   */
  removePuyo(row, col) {
    if (this.puyoList[row][col] == null) return;
    let puyo = this.puyoList[row][col];
    GameContext.currnt().game.rootScene.removeChild(puyo.sprite);
    this.puyoList[row][col] = null;
  }

  /**
   * すべての[ぷよ]を削除
   */
  removeAllPuyo() {
    this.invokeAll((row, col, puyo) => {
      this.removePuyo(row, col);
    });
  }

  /**
   * 行と列インデックスを指定してぷよを取得します
   */
  puyo(row, col) {
    return this.puyoList[row][col];
  }

  /**
   * ゲームオーバしているか判定する
   */
  isGameOver() {
    //[ぷよ]が落下する列の左上部まで積まれた場合ゲームオーバとする
    return this.puyoList[0][2] != null;
  }

  /**
   * 指定された行・列インデックスの[ぷよ]が宙に浮いている状態の[ぷよ]か判定します
   * @param {Number} row 行インデックス
   * @param {Number} col 列インデックス
   */
  isFloting(row, col) {
    if (row == ROW_COUNT - 1) return false;

    if (this.puyo(row, col) != null) {
      if (this.puyo(row + 1, col) == null) {
        return true;
      }
    }
    return false;
  }

  /**
   * タイムラインアニメーションを実行している[ぷよ]が存在するか取得します
   * @returns アニメーション実行中の[ぷよ]が存在する場合 true。
   */
  isAnimate() {
    var result = false;
    this.invokeAll((row, col, puyo) => {
      if (puyo != null && puyo.isAnimate) {
        result = true;
      }
    });
    return result;
  }

  /**
   * 全てのマスに対し指定された関数を実行します
   * @param func function(row, col, puyo) { ... }
   */
  invokeAll(func) {
    for (let i = ROW_COUNT - 1; i >= 0; i--) {
      for (let j = COL_COUNT - 1; j >= 0; j--) {
        func(i, j, this.puyoList[i][j])
      }
    }
  }

  /**
   * 指定された行・列インデックスの X・Y座標取得
   * @param {Number} row 行インデックス
   * @param {Number} col 列インデックス
   */
  getXY(row, col) {
    return {
      x: (col + 1) * CELL_SIZE,
      y: (row) * CELL_SIZE
    };
  }

  /**
   * enchant.js のマップデータを作成します
   */
  static createEnchantMap() {

    var map = new Map(CELL_SIZE, CELL_SIZE);
    map.image = GameContext.currnt().game.assets['images/map0.png'];
  
    var mapData = [
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 5, 0 ], //1
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 5, 0 ], //2
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 3, 3 ], //3
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 5, 0 ], //4
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 5, 0 ], //5
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 3, 3 ], //6
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 2, 2 ], //7
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 2, 2 ], //8
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 2, 2 ], //9
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 2, 2 ], //10
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 2, 2 ], //11
      [ 3, 5, 5 ,5 ,5 ,5, 5, 3, 2, 2 ], //12
      [ 3, 3, 3 ,3 ,3 ,3, 3, 3, 2, 2 ], //13
    ];

    map.loadData(mapData);
    return map;
  }



}