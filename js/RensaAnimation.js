/**
 * 連鎖アニメーションを行うクラス
 */
class RensaAnimation {

  /**
   * 連鎖アニメーションを実行します
   */
  process() {

    //削除対象の[ぷよ]がなくなるまで、落下と連鎖処理を繰り替えす為の関数
    var loopFunc = async (cnt) => {
    
      //宙に浮いている[ぷよ]を下に落とす
      this.dropFloting();

      //落下アニメーション終了待機
      await this.waitAnimate();
      
      //連鎖処理
      let removeCount = this.rensa();

      //連鎖アニメーション終了待機
      await this.waitAnimate();

      if (removeCount > 0) {
        //再帰で繰り替えし
        loopFunc.call(this, cnt + 1);
      } else {
        //繰り返し終了
        GameContext.currnt().state = GAME_STATE.WAIT_NEXT;
      }
    };

    //繰り返し処理開始
    loopFunc(1);
  }

  /**
   * アニメーション終了まで待機し、終了後、指定したコールバック関数を呼ぶ
   * @param {function} callback アニメーション終了時に呼び出されるコールバック関数
   */
  waitAnimate(callback) {
    const intaval = 100;

    // 非同期でアニメーション終了を待機するため、Promise を返す
    return new Promise(resolve => {
      let id = setInterval(() => {
        if (!this.map().isAnimate()) {
          clearInterval(id);
          resolve();
        }
      }, intaval);
    });
  }

  /**
   * 宙に浮いている[ぷよ]を下に落とす
   */
  dropFloting() {

    //宙に浮いている[ぷよ]を探して、下に落とす
    this.map().invokeAll((row, col, puyo) => {
      //宙に浮いている[ぷよ]か判定
      if (!this.map().isFloting(row, col)) return;

      //対象の[ぷよ]を設定
      var puyo = this.map().puyo(row, col);

      //落とし先を探して、[ぷよ]をそこに落とす
      for (let row2 = row + 1; row2 <= ROW_COUNT; row2++) {
        if (row2 == ROW_COUNT || this.map().puyo(row2, col) != null) {
          this.map().movePuyo(row, col, row2 - 1, col, 3);
          break;
        }
      }
    });
  }

  /**
   * 連作処理
   */
  rensa() {
    
    // チェック状態を管理する縦１２ x 横６の二次元配列
    //   - nullの要素: 未チェックのマス
    //   - "1": チェック済みのマス
    //   - "D": 同色が４つ以上隣り合っている削除対象の[ぷよ]があるマス
    let ckList = [];
    for (var i = 0; i < ROW_COUNT; i++) {
      var ary = [];
      for (var j = 0; j < COL_COUNT; j++) {
        ary.push(null);
      }
      ckList.push(ary);
    }

    //全ての[ぷよ]に対する繰り返し処理
    this.map().invokeAll((row, col, puyo) => {
      if (puyo == null) return;
      var samePosList = new Array();
      //隣り合うマスに同色の[ぷよ]が居るか探す
      this.checkSameColor(row, col, puyo.sprite.frame, samePosList, ckList);
      //４つ以上同色の[ぷよ]が隣り合って居る場合、削除対象のフラグを立てる
      if (samePosList.length >= 4) {
        samePosList.forEach((pos) => ckList[pos.row][pos.col] = "D");
      }
    });

    let removeCount = 0;

    //同色が４つ以上隣り合っている[ぷよ]を消す
    this.map().invokeAll((row, col, puyo) => {
      if (ckList[row][col] == "D") {
        this.map().removePuyo(row, col);
        removeCount++;
      }
    });

    return removeCount;
  }

  /**
   * 隣り合うマスに同色の[ぷよ]が居るか探す
   * @param {Number} baseRow 行インデックス
   * @param {Number} baseCol 列インデックス
   * @param {Number} frame [ぷよ]のフレームインデックス
   * @param {Array} samePosList 同色の位置を管理するリスト
   * @param {Array} ckList チェック状態を管理する縦１２ x 横６の二次元配列
   */
  checkSameColor(baseRow, baseCol, frame, samePosList, ckList) {
    const directions = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];

    //処理済みマスはスキップ
    if (ckList[baseRow][baseCol] !== null) return;

    //処理済みフラグ設定
    ckList[baseRow][baseCol] = "1";

    //同色[ぷよ]の位置リスト追加
    samePosList.push({ row: baseRow, col: baseCol });

    //上下左右の４方向に同色を探す
    directions.forEach((direction) => {
      let mvCol = baseCol + direction[0];
      let mvRow = baseRow + direction[1];
      
      //マップからはみ出る範囲の行・列インデックスかチェック
      if (mvCol < 0 || mvCol >= COL_COUNT || mvRow < 0 || mvRow >= ROW_COUNT) return;

      //隣り合う[ぷよ]が同色の場合、再帰で処理を繰り返す
      let puyo2 = this.map().puyo(mvRow, mvCol);
      if (puyo2 != null && puyo2.sprite.frame == frame) {
        this.checkSameColor(mvRow, mvCol, frame, samePosList, ckList);
      }
    });
  }

  /**
   * ゲームマップクラスを取得します
   */
  map() {
    return GameContext.currnt().map;
  }
}