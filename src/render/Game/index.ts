import { GameStatue, MoveDirection } from '../types'
import SquareGroup from './../Square/SquareGroup'
import { createTetris } from '../Tetris/Tetris'
import { TetrisRules } from './../Tetris/TetrisRules'
import { IGameViewer } from './../types'
import { levels, nextPanel } from '../Viewer/config/GameConfig'
import { gamePanel } from '../Viewer/config/GameConfig'
import Square from '../Square/Square'

/**
 * 游戏类，控制游戏进程
 */

export class Game {
  private _gameStatus: GameStatue = GameStatue.init
  private _curTetris?: SquareGroup
  private _nextTetris: SquareGroup = createTetris({ x: 0, y: 0 })
  private _timer: any
  private _duration: number
  private _exists: Square[] = []
  private _score = 0

  constructor(private _gameViewer: IGameViewer) {
    this._duration = levels[0].duration
    this._gameViewer.init(this)
    this.createNext()
  }

  private createNext() {
    this._nextTetris = createTetris({ x: 0, y: 0 })
    this.resetCenterPoint(nextPanel.width, this._nextTetris)
    this._gameViewer.showNext(this._nextTetris)
  }

  private get score() {
    return this._score
  }

  private set score(val) {
    this._score = val
    this._gameViewer.showScore(this._score)
    const level = levels.filter((it) => it.score <= this._score).pop()
    if (level!.duration === this._duration) return
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
      this._duration = level!.duration
      console.log(this._duration)
      this.autoDrop()
    }
  }

  /**
   * 初始化
   */
  private init() {
    // 清除上一次游戏面板中的方块
    this._exists.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove()
      }
    })
    // 清楚上一次游戏面板中的下一个方块对象
    this._nextTetris.squares.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove()
      }
    })
    this.score = 0
    this._exists = []
    this.createNext()
    this._curTetris = undefined
  }

  /**
   * 游戏开始
   */
  start() {
    if (this._gameStatus === GameStatue.playing) return
    if (this._gameStatus === GameStatue.over) {
      this.init()
    }
    if (!this._curTetris) this.switchTetris()
    this._gameStatus = GameStatue.playing
    this.autoDrop()
    this._gameViewer.onGameStart()
  }

  /**
   * 游戏暂停
   */
  pause() {
    if (!(this._gameStatus === GameStatue.playing)) return
    clearInterval(this._timer)
    this._timer = null
    this._gameStatus = GameStatue.pause
    this._gameViewer.onGamePause()
  }

  over() {
    this._gameStatus = GameStatue.over
    clearInterval(this._timer)
    this._timer = null
    this._exists.forEach((sq) => {
      if (sq.viewer) sq.viewer.remove()
    })
    this._exists = []
    this._gameViewer.onGameOver(this._score)
    this._score = 0
    this._curTetris?.squares.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove()
      }
    })
    this._nextTetris.squares.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove()
      }
    })
    this._duration = levels[0].duration
  }

  public get gameStatus(): GameStatue {
    return this._gameStatus
  }

  /**
   * 控制方块向左移动
   */
  public controlLeft() {
    this.controlMove(MoveDirection.left)
  }

  /**
   * 控制方块向右移动
   */
  public controlRight() {
    this.controlMove(MoveDirection.right)
  }

  /**
   * 控制方块向下移动
   */
  public controlDown() {
    if (this._curTetris && this._gameStatus === GameStatue.playing) {
      TetrisRules.moveDirection(
        this._curTetris,
        MoveDirection.down,
        this._exists
      )
      this.hitButton()
    }
  }

  public controlRotate() {
    if (this._curTetris && this._gameStatus === GameStatue.playing) {
      TetrisRules.rotate(this._curTetris, this._exists)
    }
  }

  /**
   * 小方块自由下落
   */
  private autoDrop() {
    if (this._timer || this._gameStatus !== GameStatue.playing) return
    this._timer = setInterval(() => {
      if (this._curTetris) {
        if (
          !TetrisRules.move(this._curTetris, MoveDirection.down, this._exists)
        ) {
          this.hitButton()
        }
      }
    }, this._duration)
  }

  /**
   * 切换方块
   */
  private switchTetris() {
    this._curTetris = this._nextTetris
    this.resetCenterPoint(gamePanel.width, this._curTetris)
    if (
      !TetrisRules.canIMove(
        this._curTetris.shape,
        this._curTetris.centerPoint,
        this._exists
      )
    ) {
      this.over()
      return
    }
    this.createNext()
    this._gameViewer.switch(this._curTetris)
  }

  /**
   * 设置中心点坐标，以达到让该方块对象出现在面板区域的中上方
   * @param width 面板宽度
   * @param tetris 方块对象
   */
  private resetCenterPoint(width: number, tetris: SquareGroup) {
    const x = Math.ceil(width / 2) - 1
    const y = 0

    tetris.centerPoint = { x, y }
    while (tetris.squares.some((it) => it.point.y < 0)) {
      tetris.centerPoint = {
        x: tetris.centerPoint.x,
        y: tetris.centerPoint.y + 1
      }
    }
  }

  private controlMove(direction: MoveDirection) {
    if (this._curTetris && this._gameStatus === GameStatue.playing) {
      TetrisRules.move(this._curTetris, direction, this._exists)
    }
  }

  /**
   * 方块触底之后的处理
   */
  private hitButton() {
    this._exists = this._exists.concat(this._curTetris!.squares)
    const num = TetrisRules.deleteSquares(this._exists)
    this.addScore(num)
    this.switchTetris()
  }

  private addScore(lineNum: number) {
    switch (lineNum) {
      case 0:
        return
      case 1:
        return (this.score += 10)
      case 2:
        return (this.score += 15)
      case 3:
        return (this.score += 20)
      case 4:
        return (this.score += 30)
    }
  }
}