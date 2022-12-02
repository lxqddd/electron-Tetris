import { IPoint, Shape } from '../types'
import { getRandom } from '../../utils/index'
import SquareGroup from '../Square/SquareGroup'

/**
 * 方块旋转规则：
 *  S形方块和直线形方块只能在两个方向上旋转
 *  L形方块可以四旋转四个角度
 *  方块形不旋转
 */

/**
 * T形
 */
export class TShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 }
      ],
      _centerPoint,
      _color
    )
  }
}

/**
 * L形
 */
export class LShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: -3, y: 0 },
        { x: -2, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: -1 }
      ],
      _centerPoint,
      _color
    )
  }
}

/**
 * 反向L形
 */
export class LMirrorShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: 3, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: -1 }
      ],
      _centerPoint,
      _color
    )
  }
}

/**
 * S形
 */
export class SShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 1 }
      ],
      _centerPoint,
      _color
    )
  }
  rotate() {
    super.rotate()
    this.isClock = !this.isClock
  }
}

/**
 * 反向S形
 */
export class SMirrorShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      ],
      _centerPoint,
      _color
    )
  }
  rotate() {
    super.rotate()
    this.isClock = !this.isClock
  }
}
/**
 * 方块形
 */
export class SquareShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 }
      ],
      _centerPoint,
      _color
    )
  }
  rotate() {
    return
  }
}
/**
 * 直线形
 */
export class LineShape extends SquareGroup {
  constructor(_centerPoint: IPoint, _color: string) {
    super(
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 }
      ],
      _centerPoint,
      _color
    )
  }
  // 只能在两个方向上旋转
  rotate() {
    super.rotate()
    this.isClock = !this.isClock
  }
}
/**
 * 俄罗斯方块的形状
 */
export const shapes = [
  TShape,
  SShape,
  SMirrorShape,
  LShape,
  LMirrorShape,
  LineShape,
  SquareShape
]

/**
 * 俄罗斯方块的颜色
 */
export const colors: string[] = ['red', 'yellow', 'skyblue', 'orange']

/**
 * 随机生成一个俄罗斯方块
 * @param centerPoint 中心点
 * @returns tetris
 */
export const createTetris = (centerPoint: IPoint): SquareGroup => {
  const randomShape = getRandom(0, shapes.length)
  const Shape = shapes[randomShape]
  const randomColor = getRandom(0, colors.length)
  const color = colors[randomColor]
  const tetris = new Shape(centerPoint, color)
  return tetris
}