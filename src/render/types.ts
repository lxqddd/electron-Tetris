import SquareGroup from './Square/SquareGroup'
import { Game } from './Game/index'
/**
 * 方块坐标接口
 */
export interface IPoint {
  /**
   * 横坐标
   */
  readonly x: number
  /**
   * 纵坐标
   */
  readonly y: number
}

/**
 * 显示者接口
 */
export interface IViewer {
  /**
   * 控制显示
   */
  show(): void
  /**
   * 控制删除
   */
  remove(): void
}

/**
 * 小方块显示接口
 */
export interface ISquare {
  /**
   * 小方块宽度
   */
  width: number
  /**
   * 小方块高度
   */
  height: number
  /**
   * 小方块边框
   */
  border: string
}

/**
 * 形状
 */
export type Shape = IPoint[]

// 移动方向
export enum MoveDirection {
  down = 'down',
  left = 'left',
  right = 'right'
}

export enum GameStatue {
  init, // 游戏初始化
  playing, // 游戏进行中
  pause, // 游戏暂停
  over // 游戏结束
}

export interface IGameViewer {
  /**
   * 展示下一个方块对象
   * @param tetris 要展示的方块对象
   */
  showNext(tetris: SquareGroup): void

  /**
   * 展示切换的方块对象
   * @param tetris 切换的方块对象
   */
  switch(tetris: SquareGroup): void

  /**
   * 游戏页面初始化
   * @param game
   */
  init(game: Game): void

  /**
   * 显示分数
   * @param score 分数
   */
  showScore(score: number): void

  /**
   * 游戏开始事件
   */
  onGameStart(): void

  /**
   * 游戏暂停事件
   */
  onGamePause(): void

  /**
   * 游戏结束事件
   */
  onGameOver(score: number): void
}