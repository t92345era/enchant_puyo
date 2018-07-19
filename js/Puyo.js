class Puyo {

  /**
   * ぷよ１個を表すクラス
   */
  constructor(game) {
    this.sprite = new Sprite(CELL_SIZE, CELL_SIZE);
    this.sprite.image = game.assets["images/puyopuyo2.png"];
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.frame = 0;
    this.isAnimate = false;
  }

  //行・列インデックスの設定
  setPosition(row, col) {
    let xyPos = GameContext.currnt().map.getXY(row, col);
    this.sprite.x = xyPos.x;
    this.sprite.y = xyPos.y;
  }

  //アニメーションしながら[ぷよ]を移動する
  moveWithAnimate(row, col, frameCount) {
    if (frameCount > 1) {
      this.isAnimate = true;
    }

    let xyPos = GameContext.currnt().map.getXY(row, col);
    this.sprite.tl
      .moveTo(xyPos.x, xyPos.y, frameCount)
      .then(() => {
        this.isAnimate = false;
      });
  }

  //ランダムな色のぷよを作成する
  static randamCreate(game) {
    var puyo = new Puyo(game);
    var random = Math.floor( Math.random() * 5 ) + 0;
    puyo.sprite.frame = random;
    return puyo;
  }
}

