export interface GesteListenerEvents {
  touchStart?: (evt: TouchEvent, el: HTMLElement) => any,
  touchMove?: (evt: TouchEvent, el: HTMLElement) => any,
  touchEnd?: (evt: TouchEvent, el: HTMLElement) => any,
  touchCancel?: (evt: TouchEvent, el: HTMLElement) => any,
  // 旋转手势
  rotate?: (evt: RotateTouchEvent, el: HTMLElement) => any,
  // 多指触摸开始
  multiFingerTouchStart?: (evt: TouchEvent, el: HTMLElement) => any,
  // 多指触摸开始
  multiFingerTouchEnd?: (evt: TouchEvent, el: HTMLElement) => any,
  // 长按
  longTap?: (evt: TouchEvent, el: HTMLElement) => any,
  // 双指放大缩小
  zoomInAndOut?: (evt: ZoomInAndOutTouchEvent, el: HTMLElement) => any,
  // 多指按住移动
  multiFingerPressMove?: (evt: TouchEvent, el: HTMLElement) => any,
  // 单指按住移动
  oneFingerPressMove?: (evt: oneFingerPressMoveTouchEvent, el: HTMLElement) => any,
  // 单指按住移动
  oneFingerPressMoveEnd?: (evt: TouchEvent, el: HTMLElement) => any,
  // 点击一次
  tap?: (evt: TouchEvent, el: HTMLElement) => any,
  // 快速双击
  doubleTap?: (evt: TouchEvent, el: HTMLElement) => any,
  // swipe 滑动/刷
  swipe?: (evt: SwipeTouchEvent, el: HTMLElement) => any,
}

export interface GesteEventListenerConfig {
  // 按住多久时间被判定为长按手势
  longTapDelay?: number,
  // 在单击后多久时间内再次触发被认定为双击
  doubleTapDelay?: number,
  // 至少 横向滑动/竖向滑动 多少距离将被认为是滑动手势
  triggerSwipeDistance?: number,
}

export interface PointOffset {
  deltaX: number,
  deltaY: number,
}

export interface Point {
  x: number,
  y: number,
}
export interface ZoomInAndOutTouchEvent extends TouchEvent {
  zoom: number
}
export interface RotateTouchEvent extends TouchEvent {
  angle: number
}
export interface oneFingerPressMoveTouchEvent extends TouchEvent {
  deltaX: number
  deltaY: number
}
export interface SwipeTouchEvent extends TouchEvent {
  beginningTouchesLength: number,
  endedTouchesLength: number,
  direction: Direction,
  distanceX: number,
  distanceY: number,
}

export type Direction = 'left' | 'right' | 'up' | 'down' | 'upLeft' | 'upRight' | 'downLeft' | 'downRight' | '';

export type Matrix = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

export interface TFOMProperty {
  translateX?: string,
  translateY?: string,
  scaleX?: number,
  scaleY?: number,
  matrix?: Matrix,
  rotateX?: string,
  rotateY?: string,
  rotateZ?: string,
  skewX?: string,
  skewY?: string,
  matrix3d?: Matrix,
  translateZ?: string,
  scaleZ?: string,
  perspective?: string,
}

export interface GesteListenerObj {
  destory: () => void,
}