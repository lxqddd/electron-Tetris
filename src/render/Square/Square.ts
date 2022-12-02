import { IPoint, IViewer } from '../types'

/**
 * 小方块
 */

export default class Square {
  private _viewer?: IViewer
  private _point: IPoint = { x: 3, y: 5 }
  private _color = 'skyblue'

  public get point() {
    return this._point
  }

  public set point(val) {
    this._point = val
    // 完成显示
    if (this._viewer) {
      this._viewer.show()
    }
  }

  public get color() {
    return this._color
  }

  public set color(val) {
    this._color = val
    if (this._viewer) this._viewer.show()
  }

  public get viewer() {
    return this._viewer
  }

  public set viewer(val) {
    this._viewer = val
    if (this._viewer) this._viewer.show()
  }
}