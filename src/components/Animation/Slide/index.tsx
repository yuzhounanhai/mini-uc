import * as React from 'react';
import cn from 'classnames';
import { cnPrefix } from '@/config/variable';
import './styles/index';

export const CLASSNAMEMAP = {
  slide: `${cnPrefix}-animation-slide`,
  slideLeftBegin: `${cnPrefix}-animation-slide-left-begin`,
  slideRightBegin: `${cnPrefix}-animation-slide-right-begin`,
  slideUpBegin: `${cnPrefix}-animation-slide-up-begin`,
  slideDownBegin: `${cnPrefix}-animation-slide-down-begin`,
  opacityShow: `${cnPrefix}-opacity-1`,
  opacityHide: `${cnPrefix}-opacity-0` 
};

type direction = 'up'|'down'|'left'|'right';

export interface SlideAnimationProps {
  show: boolean,
  direction: direction,
  children: React.ReactElement,
  speed?: 'quick' | 'slow' | 'middle' | number,
  delay?: number,
  needDestroy?: boolean,
  exitDelay?: number,
  showTimingFunction?: string,
  hideTimingFunction?: string,
}

interface SlideAnimationState {
  isElementShow: boolean,
  animationClass: string,
}

export const SLIDESTATUS = {
  finished: 0,
  showing: 1,
  hidding: 2,
};

class SlideAnimation extends React.Component<SlideAnimationProps, SlideAnimationState> {
  static defaultProps = {
    show: false,
    direction: 'down',
    speed: 0.5,
    delay: 0,
    needDestroy: false,
    showTimingFunction: '',
    hideTimingFunction: '',
  }

  slideStatus: number

  timer: number | undefined = undefined

  constructor(props: SlideAnimationProps) {
    super(props);
    this.state = {
      isElementShow: this.getIsElementShow(this.props.show),
      animationClass: this.props.show ? CLASSNAMEMAP.opacityShow : this.getClassName(this.props.direction, true),
    }
    this.slideStatus = SLIDESTATUS.finished;
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }

  getClassName(direction: direction, isBegin: boolean): string {
    if (isBegin) {
      return CLASSNAMEMAP[`slide${direction.slice(0, 1).toLocaleUpperCase()}${direction.slice(1)}Begin`]
        + ' '
        + CLASSNAMEMAP.opacityHide;
    } else {
      return CLASSNAMEMAP.opacityShow;
    }
    return '';
  }

  getIsElementShow(elementShow: boolean) {
    if (elementShow) {
      return true;
    } else {
      return !this.props.needDestroy;
    }
  }

  handleTransitionEnd() {
    if (this.slideStatus === SLIDESTATUS.hidding) {
      this.slideStatus = SLIDESTATUS.finished;
      this.setState({
        isElementShow: this.getIsElementShow(false)
      });
    } else if (this.slideStatus === SLIDESTATUS.hidding) {
      this.slideStatus = SLIDESTATUS.finished;
    }
  }

  componentDidUpdate(prevProps: SlideAnimationProps) {
    if (prevProps.show !== this.props.show) {
      clearTimeout(this.timer);
      if (this.props.show) {
        this.slideStatus = SLIDESTATUS.showing;
        this.setState({
          isElementShow: true,
          animationClass: this.getClassName(this.props.direction, true)
        }, () => {
          this.timer = window.setTimeout(() => {
            this.setState({
              animationClass: this.getClassName(this.props.direction, false)
            });
          }, 0);
        });
      } else {
        this.slideStatus = SLIDESTATUS.hidding;
        this.setState({
          animationClass: this.getClassName(this.props.direction, true)
        });
      }
    }
  }

  render() {
    let { children } = this.props;
    children = React.Children.only(children);
    const {
      speed,
      delay,
      exitDelay,
      showTimingFunction,
      hideTimingFunction,
    } = this.props;
    const {
      isElementShow,
      animationClass
    } = this.state;
    let speedClassName = '';
    const otherProps: any = {};
    let styles = Object.assign({}, children.props.style || {});
    if (typeof speed === 'number') {
      styles = Object.assign({
        transitionDuration: `${speed}s`,
      }, styles);
    } else {
      speedClassName = `${cnPrefix}-transition-duration-${speed}`;
    }
    let delayTime = 0;
    if (this.slideStatus === SLIDESTATUS.hidding) {
      if (typeof exitDelay === 'number' && exitDelay > 0) {
        delayTime = exitDelay;
      } else if (typeof exitDelay !== 'number' && typeof delay === 'number' && delay > 0) {
        delayTime = delay;
      }
    } else {
      if (typeof delay === 'number' && delay > 0) {
        delayTime = delay;
      }
    }
    if (delayTime) {
      styles = Object.assign({
        transitionDelay: `${delayTime}s`,
      }, styles);
    }
    if (showTimingFunction && this.slideStatus === SLIDESTATUS.showing) {
      styles = Object.assign({
        transitionTimingFunction: showTimingFunction
      }, styles);
    }
    if (hideTimingFunction && this.slideStatus === SLIDESTATUS.hidding) {
      styles = Object.assign({
        transitionTimingFunction: hideTimingFunction
      }, styles);
    }
    otherProps.style = styles;
    const element = {
      ...children as object,
      props: {
        ...children.props,
        className: cn(children.props.className, animationClass, speedClassName),
        onTransitionEnd: this.handleTransitionEnd,
        ...otherProps
      },
    };
    return isElementShow && element;
  }
}

export default SlideAnimation;