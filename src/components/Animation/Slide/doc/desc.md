## AnimationSlide 滑动出现 (v0.2.0)

`AnimationSlide` 提供了由隐藏到显示的透明度过渡，并带有一定距离滑动的动画效果。

`AnimationSlide` 基于行内 CSS3 transition 实现，这意味着您在行内附加的有关 `transform/opacity/transition` 等相关属性，可能会影响到这一组件的表现。

![Slide组件使用示例](images/slide.gif)

## 使用示例

```
import { AnimationSlide } from 'mini-uc';

<AnimationSlide
  show={this.state.animationShow}
  speed={2}
  delay={0.2}
  exitDelay={0}
  direction="left"
  needDestroy={false}
  hideTimingFunction={linear}
>
  <div className="xxxx">
    <img src="" alt="" />
  </div>
</AnimationSlide>
```

## 滑动转换距离

默认对于四个方向的滑动，将使用动画应用元素的20%（宽/高）的长度，作为滑动动画的起始位置。相关 SASS 代码如下：

```
$cn-prefix: mini-uc

.#{$cn-prefix}-animation-slide-down-begin {
  transform: translateY(-20%);
}
.#{$cn-prefix}-animation-slide-up-begin {
  transform: translateY(20%);
}
.#{$cn-prefix}-animation-slide-left-begin {
  transform: translateX(20%);
}
.#{$cn-prefix}-animation-slide-right-begin {
  transform: translateX(-20%);
}
```

因此你可以根据自己项目的需要在全局进行重写，以 CSS 代码为例：

```
.mini-uc-animation-slide-down-begin {
  transform: translateY(-10%);
}
.mini-uc-animation-slide-up-begin {
  transform: translateY(10%);
}
.mini-uc-animation-slide-left-begin {
  transform: translateX(10%);
}
.mini-uc-animation-slide-right-begin {
  transform: translateX(-10%);
}
```

当然也可以通过多层选择器选中动画应用元素，对这一 class 的样式进行高优先级覆盖：

```
#page .header .mini-uc-animation-slide-down-begin {
  transform: translateY(-100px);
}
```

### 应用场景

一些网站会在页面滚动过程中动效的展示一些元素，这些元素是逐渐展现并带有上升效果的，利用 `AnimationSlide` 组件你就可以实现这一效果。

![AnimationSlide的应用](images/slideDemo.gif)

渲染部分代码如下：

```javascript
class Poster extends React.Component {
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
```

上面的代码中，真正存在动效的部分已经被 `AnimationSlide` 组件包裹，将由 `isShow` 来控制展现与隐藏，那么下一步我们只需要检测这些内容是否进入视图中，模拟代码如下：

```javascript
  componentDidMount() {
    window.addEventListener('scroll', () => {
      const wrapper = this.wrapperRef.current;
      const bcr = wrapper.getBoundingClientRect();
      if ((bcr.top + 100) < window.innerHeight) {
        if (!this.state.isShow) {
          this.setState({
            isShow: true
          });
        }
      } else {
        if (this.state.isShow) {
          this.setState({
            isShow: false,
          });
        }
      }
    })
  }
```

## API

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| show | (必需)控制内容是否显示 | boolean | false | |
| direction | (必需)slide 滑动动画的正方向 | 'up'\|'down'\|'left'\|'right'| 'down' | |
| speed | slide 滑动动画的时间快慢，允许接收一个数字（单位为s），也可以接收"quick"、"middle"、"slow"三个标识字符串 | number\|'quick'\|'slow'\|'middle' | 0.5 | |
| needDestroy | 控制内容在滑动淡出后是否需要销毁，如若不销毁，动画应用区域只是附加了一个`opacity: 0;`的样式，但仍然占据空间。 | boolean | false | |
| delay | 控制滑动动画滑动出现时的延迟时间，接受一个数字（单位为s） | number | 0 | |
| exitDelay | 控制滑动动画滑动消失时的延迟时间，接受一个数字（单位为s），若不传递该参数，消失时的延迟时间将会使用 delay 的值。 | number\|null | |
| showTimingFunction | 控制滑动动画滑动出现时的过渡速度曲线，接受同`transition-timing-function`所规定的值 | string | ease | |
| hideTimingFunction | 控制滑动动画滑动消失时的过渡速度曲线，接受同`transition-timing-function`所规定的值 | string | ease | |