import * as React from 'react';
import cn from 'classnames';
import { cnPrefix } from '@/config/variable';
import './styles/index';

export interface FadeAnimationProps {
  show: boolean,
  children: React.ReactElement,
  speed?: 'quick' | 'slow' | 'middle' | number,
  needDestroy?: boolean,
}

interface FadeAnimationState {
  isElementShow: boolean,
  animationClass: string,
}

export const CLASSNAMEMAP = {
  fadeIn: `${cnPrefix}-animation-fade-in`,
  fadeOut: `${cnPrefix}-animation-fade-out`,
  opacityShow: `${cnPrefix}-opacity-1`,
  opacityHide: `${cnPrefix}-opacity-0` 
};

export const FADESTATUS = {
  finished: 0,
  showing: 1,
  hidding: 2,
};

class FadeAnimation extends React.Component<FadeAnimationProps, FadeAnimationState> {
  static defaultProps = {
    show: true,
    speed: 0.5,
    needDestroy: true,
  }

  fadeStatus: number
  
  constructor(props: FadeAnimationProps) {
    super(props);
    this.state = {
      isElementShow: this.getElementShowState(this.props.show),
      animationClass:
        this.props.show
          ? CLASSNAMEMAP.opacityShow
          : CLASSNAMEMAP.opacityHide,
    }
    this.fadeStatus = FADESTATUS.finished;
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
  }

  componentDidUpdate(prevProps: FadeAnimationProps) {
    if (prevProps.show !== this.props.show) {
      if (this.props.show) {
        this.setState({
          isElementShow: true
        }, () => {
          this.fadeStatus = FADESTATUS.showing;
          this.setState({
            animationClass: `${CLASSNAMEMAP.opacityHide} ${CLASSNAMEMAP.fadeIn}`,
          });
        });
      } else {
        this.fadeStatus = FADESTATUS.hidding;
        this.setState({
          animationClass: `${CLASSNAMEMAP.opacityShow} ${CLASSNAMEMAP.fadeOut}`
        });
      }
    }
  }

  handleAnimationEnd() {
    if (this.fadeStatus === FADESTATUS.hidding) {
      this.setState({
        isElementShow: this.getElementShowState(false),
        animationClass: CLASSNAMEMAP.opacityHide
      });
    } else {
      this.setState({
        animationClass: CLASSNAMEMAP.opacityShow,
      });
    }
  }

  getElementShowState(showValue: boolean): boolean {
    const { needDestroy } = this.props;
    if (needDestroy) {
      return showValue;
    } else {
      return true;
    }
  }

  render() {
    let { children } = this.props;
    children = React.Children.only(children);
    const { speed } = this.props;
    const {
      isElementShow,
      animationClass
    } = this.state;
    let speedClassName = '';
    const otherProps: any = {};
    if (typeof speed === 'number') {
      otherProps.style = Object.assign({
        animationDuration: `${speed}s`,
      }, children.props.style || {});
    } else {
      speedClassName = `${cnPrefix}-animation-duration-${speed}`;
    }
    const element = {
      ...children as object,
      props: {
        ...children.props,
        className: cn(children.props.className, animationClass, speedClassName),
        onAnimationEnd: this.handleAnimationEnd,
        ...otherProps
      },
    };
    return isElementShow && element;
  }
}

export default FadeAnimation;
