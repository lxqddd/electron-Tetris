import { MoveDirection, Shape } from '../types'
import { IPoint } from './../types'
import { gamePanel } from '../Viewer/config/GameConfig'
import SquareGroup from './../Square/SquareGroup'
import Square from '../Square/Square'
import { Game } from './../Game/index'

function isPoint(obj: any): obj is IPoint {
  if (typeof obj.x === 'undefined') {
    return false
  }
  return true
}

/**
 * 方块规则类，根据游戏规则，判断各种情况
 */
export class TetrisRules {
  /**
   * 方块是否能移动到指定位置
   */
  static canIMove(
    shape: Shape,
    targetPoint: IPoint,
    exists: Square[]
  ): boolean {
    const targetSquarePoints: IPoint[] = shape.map((it) => ({
      x: it.x + targetPoint.x,
      y: it.y + targetPoint.y
    }))
    let result = true
    result = targetSquarePoints.some((sq) => {
      return (
        sq.x < 0 ||
        sq.x > gamePanel.width - 1 ||
        sq.y < 0 ||
        sq.y > gamePanel.height - 1
      )
    })

    if (result) return false

    targetSquarePoints.forEach((sq) => {
      if (exists.some((it) => it.point.x === sq.x && it.point.y === sq.y)) {
        result = true
      }
    })
    if (result) {
      return false
    }
    return true
  }

  /**
   * 移动小方块
   * @param tetris 方块组
   * @param targetPointOrDirection 目标点或者是方向
   * @returns 是否移动成功
   */
  static move(
    tetris: SquareGroup,
    targetPoint: IPoint,
    exists: Square[]
  ): boolean
  static move(
    tetris: SquareGroup,
    direction: MoveDirection,
    exists: Square[]
  ): boolean
  static move(
    tetris: SquareGroup,
    targetPointOrDirection: IPoint | MoveDirection,
    exists: Square[]
  ): boolean {
    if (isPoint(targetPointOrDirection)) {
      if (this.canIMove(tetris.shape, targetPointOrDirection, exists)) {
        tetris.centerPoint = targetPointOrDirection
        return true
      }
      return false
    } else {
      const direction = targetPointOrDirection
      let targetPoint: IPoint
      switch (direction) {
        case MoveDirection.down:
          targetPoint = {
            x: tetris.centerPoint.x,
            y: tetris.centerPoint.y + 1
          }
          break
        case MoveDirection.left:
          targetPoint = {
            x: tetris.centerPoint.x - 1,
            y: tetris.centerPoint.y
          }
          break
        case MoveDirection.right:
          targetPoint = {
            x: tetris.centerPoint.x + 1,
            y: tetris.centerPoint.y
          }
          break
      }
      return this.move(tetris, targetPoint, exists)
    }
  }

  /**
   * 将方块组在指定方向上移动到不能移动为止
   * @param tetris 方块组
   * @param direction 移动方向
   */
  static moveDirection(
    tetris: SquareGroup,
    direction: MoveDirection,
    exists: Square[]
  ): boolean {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!this.move(tetris, direction, exists)) {
        return true
      }
    }
  }

  static rotate(tetris: SquareGroup, exists: Square[]): boolean {
    const newShape = tetris.afterRotateShape()
    if (this.canIMove(newShape, tetris.centerPoint, exists)) {
      tetris.rotate()
      return true
    }
    return false
  }

  /**
   * 获取面板纵坐标为 y 的所有方块
   * @param exists 当前面板中所有的方块对象组
   * @param y 面板纵坐标
   * @returns
   */
  static getLineSquares(exists: Square[], y: number): Square[] {
    return exists.filter((sq) => sq.point.y === y)
  }

  /**
   * 删除方块
   * @param exists 方块
   */
  static deleteSquares(exists: Square[]): number {
    const yArr = exists.map((sq) => sq.point.y)
    const maxY = Math.max(...yArr)
    const minY = Math.min(...yArr)
    // 计数器
    let num = 0
    for (let i = minY; i <= maxY; i++) {
      // 删除能删除的行
      if (this.deleteLine(exists, i)) num++
    }
    return num
  }

  /**
   * 删除一行
   * @param exists 面板中存在的方块
   * @param y 要删除的那一行的纵坐标
   * @returns 是否删除成功
   */
  private static deleteLine(exists: Square[], y: number): boolean {
    const squares = exists.filter((sq) => sq.point.y === y)
    if (squares.length === gamePanel.width) {
      squares.forEach((sq) => {
        if (sq.viewer) {
          sq.viewer.remove()
        }

        const index = exists.indexOf(sq)
        exists.splice(index, 1)
      })
      exists
        .filter((sq) => sq.point.y < y)
        .forEach((sq) => {
          sq.point = {
            x: sq.point.x,
            y: sq.point.y + 1
          }
        })
      return true
    }
    return false
  }
}