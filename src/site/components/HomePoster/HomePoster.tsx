import * as React from 'react';
import * as styles from './HomePoster.modules.scss';
import SlideAnimation from '@/components/Animation/Slide';

export interface HomePosterState {
  isShow: boolean,
}

export default class HomePoster extends React.Component<{}, HomePosterState> {
  wrapperRef: React.RefObject<any> = React.createRef();

  state = {
    isShow: false
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const wrapper = this.wrapperRef.current;
      const bcr = wrapper.getBoundingClientRect();
      if ((bcr.top + 100) < window.innerHeight) {
        if (!this.state.isShow) {
          this.setState({
            isShow: true
          })
        }
      } else {
        if (this.state.isShow) {
          this.setState({
            isShow: false,
          })
        }
      }
    })
  }
  render() {
    const { isShow } = this.state;
    return (
      <div className={styles.wrapper} ref={this.wrapperRef}>
        <SlideAnimation
          direction="up"
          show={isShow}
          speed={0.3}
          delay={0}
          exitDelay={0.45}
        >
          <div className={styles.part}>
            <div className={styles.img}></div>
            <div>设计价值观</div>
          </div>
        </SlideAnimation>
        <SlideAnimation
          show={isShow}
          direction="up"
          speed={0.3}
          delay={0.15}
          exitDelay={0.3}
        >
          <div className={styles.part}>
            <div className={styles.img}></div>
            <div>视觉</div>
          </div>
        </SlideAnimation>
        <SlideAnimation
          show={isShow}
          direction="up"
          delay={0.3}
          speed={0.3}
          exitDelay={0.15}
        >
          <div className={styles.part}>
            <div className={styles.img}></div>
            <div>可视化</div>
          </div>
        </SlideAnimation>
        <SlideAnimation
          show={isShow}
          direction="up"
          delay={0.45}
          speed={0.3}
          exitDelay={0}
        >
          <div className={styles.part}>
            <div className={styles.img}></div>
            <div>动效</div>
          </div>
        </SlideAnimation>
      </div>
    )
  }
}