import $ from 'jquery'
import { IViewer } from '../types'
import Square from '../Square/Square'
import { SquareConfig } from './config/pageConfig'

export default class Viewer implements IViewer {
  private dom?: JQuery<HTMLElement>
  constructor(private square: Square, private container: JQuery<HTMLElement>) {}
  show(): void {
    if (!this.dom) {
      this.dom = $('<div></div>').css({
        position: 'absolute',
        width: SquareConfig.width,
        height: SquareConfig.height,
        border: SquareConfig.border,
        boxSizing: 'border-box'
      })
    }
    this.dom
      .css({
        left: this.square.point.x * SquareConfig.width,
        top: this.square.point.y * SquareConfig.height,
        backgroundColor: this.square.color
      })
      .appendTo(this.container)
  }
  remove(): void {
    if (this.dom) this.dom.remove()
  }
}