import {
  GesteListenerEvents,
  GesteEventListenerConfig,
  PointOffset,
} from './interfaces';
import {
  getTwoPointDistance,
  packTouchToPoint,
  getAngle,
  getDirection,
} from './utils';

const defaultTriggerSwipeDistance = 30;
const defaultDoubleTapDelay = 200;
const defaultLongTapDelay = 750;

class GesteEventListener {
  // 目标元素
  element: HTMLElement
  // 回调函数集合对象
  glEvents: GesteListenerEvents
  // 配置项
  config: GesteEventListenerConfig
  // 长按的计时器
  longTapTimeout: number | null
  // tap的计时器
  singleTapTimeout: number | null
  // 上一个两点偏移量
  prevPointOffset: PointOffset | null
  // 上一个两点距离
  prevTwoPointDistance: number | null
  // 是否双击
  isDoubleTap: boolean
  // 是否可认定为单手指移动
  isOneFingerMoveAction: boolean
  // 是否阻止Tap / doubleTap事件标识，如在移动触发时阻止
  isPreventTap: boolean
  // start时的touches信息
  beginningTouches: Touch[] | null
  // 当前的touches信息
  currentTouches: Touch[] | null
  // 会出现在一次手势中触发两次touchstart事件的情况，这个情况会影响tap的判断
  startPatchCount: number = 0
  endPatchCount: number = 0
  
  constructor(el: HTMLElement, glEvents: GesteListenerEvents, config?: GesteEventListenerConfig) {
    this.element = el;
    this.glEvents = {
      ...glEvents,
    };
    this.prevPointOffset = null;
    this.isPreventTap = false;
    this.config = {
      longTapDelay: defaultLongTapDelay,
      doubleTapDelay: defaultDoubleTapDelay,
      triggerSwipeDistance: defaultTriggerSwipeDistance,
      ...(config || {})
    };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.element.addEventListener('touchstart', this.handleTouchStart);
    this.element.addEventListener('touchmove', this.handleTouchMove);
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchcancel', this.handleTouchCancel);
  }

  handleTouchStart(evt: TouchEvent) {
    if (!evt.touches) return;
    this.isOneFingerMoveAction = false;
    // 增加一次计数
    this.startPatchCount++;
    // dispatch touchStart
    this.glEvents.touchStart && this.glEvents.touchStart(evt, this.element);
    const touches = evt.touches;
    const len = touches.length;
    this.beginningTouches = Array.from(touches);
    this.currentTouches = Array.from(touches);
    if (len > 1) {
      // 取消长按监听
      this.clearLongTap();
      // 多个触点 不是点击操作 取消点击监听
      this.cancelTap();
      // dispatch multiFingerTouchStart
      this.glEvents.multiFingerTouchStart && this.glEvents.multiFingerTouchStart(evt, this.element);
      // 获得初始时的距离
      const po = {
        deltaX: touches[1].pageX - touches[0].pageX,
        deltaY: touches[1].pageY - touches[0].pageY,
      };
      this.prevPointOffset = { ...po };
      this.prevTwoPointDistance = getTwoPointDistance(po);
    } else {
      this.longTapTimeout = setTimeout(() => {
        // 若触发了长按，则不是Tap
        this.cancelTap();
        this.glEvents.longTap && this.glEvents.longTap(evt, this.element);
        this.clearLongTap();
      }, this.config.longTapDelay);
      // 存在计时器，再次触发点击，则认为是双击
      if (this.singleTapTimeout) {
        this.isDoubleTap = true;
      }
    }
  }

  handleTouchMove(evt: TouchEvent) {
    if (!evt.touches) return;
    // 阻止默认行为，一般是会和滚动事件互相影响
    evt.preventDefault();
    // 移动了 则认为不是长按手势
    this.clearLongTap();
    // 移动了 则认为不是点击/双击手势
    this.cancelTap();
    this.glEvents.touchMove && this.glEvents.touchMove(evt, this.element);
    const touches = evt.touches;
    this.currentTouches = Array.from(touches);
    const beginningTouchesLen = this.beginningTouches && this.beginningTouches.length;
    if (this.beginningTouches && this.beginningTouches.length > 1) {
      // 存在多个触点就不是单手指移动了
      this.isOneFingerMoveAction = false;
      const currentPo: PointOffset = {
        deltaX: touches[1].pageX - touches[0].pageX,
        deltaY: touches[1].pageY - touches[0].pageY,
      };
      if (this.prevTwoPointDistance && this.prevTwoPointDistance > 0) {
        const currentTwoPointDistance = getTwoPointDistance(currentPo);
        this.glEvents.zoomInAndOut && this.glEvents.zoomInAndOut(Object.assign(evt, {
          zoom: currentTwoPointDistance / this.prevTwoPointDistance,
        }), this.element);
      }
      if (this.prevPointOffset) {
        // 旋转
        this.glEvents.rotate && this.glEvents.rotate(Object.assign(evt, {
          angle: getAngle(currentPo, this.prevPointOffset),
        }), this.element);
      }
      if (beginningTouchesLen && beginningTouchesLen > 1) {
        this.glEvents.multiFingerPressMove && this.glEvents.multiFingerPressMove(evt, this.element);
      } 
    } else if (this.beginningTouches && this.beginningTouches.length === 1) {
      // 单指操作
      this.isOneFingerMoveAction = true;
      this.glEvents.oneFingerPressMove && this.glEvents.oneFingerPressMove(Object.assign(evt, {
        deltaX: this.currentTouches[0].pageX - this.beginningTouches[0].pageX,
        deltaY: this.currentTouches[0].pageY - this.beginningTouches[0].pageY,
      }), this.element);
      evt.preventDefault();
    }
  }

  handleTouchEnd(evt: TouchEvent) {
    if (!evt.touches) return;
    this.endPatchCount++;
    this.glEvents.touchEnd && this.glEvents.touchEnd(evt, this.element);
    // TouchEnd触发先于计时器，需要清除长按计时器， 若晚于，下条语句其实并不会产生什么结果
    this.clearLongTap();
    const len = this.currentTouches ? this.currentTouches.length : 0;
    if (len > 1) {
      this.glEvents.multiFingerTouchEnd && this.glEvents.multiFingerTouchEnd(evt, this.element);
    } else {
      if (this.isOneFingerMoveAction) {
        this.glEvents.oneFingerPressMoveEnd && this.glEvents.oneFingerPressMoveEnd(evt, this.element);
      }
      // 没有阻止 并且当前没有触发多个touchStart事件的情况
      if (!this.isPreventTap && this.startPatchCount === 1) {
        if (this.isDoubleTap) {
          // 触发双击则不触发单击
          this.cancelTap();
          // 立即触发双击
          this.glEvents.doubleTap && this.glEvents.doubleTap(evt, this.element);
          this.isDoubleTap = false;
          this.isPreventTap = false;
        } else {
          // 在计时结束被认为是tap
          this.singleTapTimeout = setTimeout(() => {
            this.glEvents.tap && this.glEvents.tap(evt, this.element);
            this.cancelTap();
            this.isPreventTap = false;
          }, this.config.doubleTapDelay);
        }
      }
    }
    if (this.beginningTouches && this.currentTouches) {
      const beginningTouchesLen = this.beginningTouches.length;
      if (beginningTouchesLen && this.currentTouches.length) {
        const beginningPoint = packTouchToPoint(this.beginningTouches[0]);
        const endedPoint = packTouchToPoint(this.currentTouches[0]);
        const po: PointOffset = {
          deltaX: endedPoint.x - beginningPoint.x,
          deltaY: endedPoint.y - beginningPoint.y,
        };
        const triggerSwipeDistance = this.config.triggerSwipeDistance || defaultLongTapDelay;
        if (Math.abs(po.deltaX) > triggerSwipeDistance || Math.abs(po.deltaY) > triggerSwipeDistance) {
          const direction = getDirection(beginningPoint, endedPoint);
          this.glEvents.swipe && this.glEvents.swipe(Object.assign(evt, {
            distanceX: po.deltaX,
            distanceY: po.deltaY,
            beginningTouchesLength: beginningTouchesLen,
            endedTouchesLength: len,
            direction,
          }), this.element);
        }
      }
    }
    // 重置参数
    this.beginningTouches = null;
    this.currentTouches = null;
    this.longTapTimeout = null;
    this.isPreventTap = false;
    this.prevPointOffset = {
      deltaX: 0,
      deltaY: 0,
    };
    this.prevTwoPointDistance = null;
    if (this.endPatchCount === this.startPatchCount) {
      this.endPatchCount = 0;
      this.startPatchCount = 0;
    }
  }

  handleTouchCancel(evt: TouchEvent) {
    this.cancelTap();
    this.clearTimeout();
    // 取消情况重置
    this.startPatchCount = 0;
    this.glEvents.touchCancel && this.glEvents.touchCancel(evt, this.element);
  }

  clearLongTap() {
    if (this.longTapTimeout) {
      clearTimeout(this.longTapTimeout);
      this.longTapTimeout = null;
    }
  }

  cancelTap() {
    this.isPreventTap = true;
    if (this.singleTapTimeout) {
      clearTimeout(this.singleTapTimeout);
      this.singleTapTimeout = null;
    }
  }

  clearTimeout() {
    if (this.longTapTimeout) {
      clearTimeout(this.longTapTimeout);
      this.longTapTimeout = null;
    }
    if (this.singleTapTimeout) {
      clearTimeout(this.singleTapTimeout);
      this.singleTapTimeout = null;
    }
  }

  destory() {
    // 清除计时器相关
    this.clearTimeout();
    // 移除监听
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
  }
}

export default GesteEventListener;
