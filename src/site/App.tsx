import * as React from 'react';
import AnimationFade from '@/components/Animation/Fade';
import SelectMenu from '@/components/SelectMenu';
import AnimationSlide from '@/components/Animation/Slide';
import HomePoster from './components/HomePoster/HomePoster';
import './App.scss';

class App extends React.Component {
  state = {
    animationShow: true,
    storeColor: '#00ffff',
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        animationShow: !this.state.animationShow
      });
    }, 5000);
  }
  render() {
    return (
      <div className="App">
        <div className="demo">
          <p>Animation-Slide组件</p>
          <div className="example">
            <AnimationSlide
              show={this.state.animationShow}
            >
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '100px',
                fontSize: '12px',
              }}>SlideDown</div>
            </AnimationSlide>
          </div>
          <div className="example">
            <AnimationSlide
              show={this.state.animationShow}
              direction="left"
              speed={0.2}
              needDestroy={true}
            >
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '100px',
                fontSize: '12px',
              }}>Left(隐藏即销毁)</div>
            </AnimationSlide>
          </div>
          <div className="example">
            <AnimationSlide
              show={this.state.animationShow}
              direction="right"
              delay={0.5}
              speed={0.2}
            >
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '100px',
                fontSize: '12px',
              }}>SlideRight</div>
            </AnimationSlide>
          </div>
          <div className="example">
            <AnimationSlide
              show={this.state.animationShow}
              direction="up"
              delay={0.5}
              speed={0.5}
              exitDelay={0}
              showTimingFunction="linear"
              hideTimingFunction="steps(4, end)"
            >
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '100px',
                fontSize: '12px',
              }}>SlideUp</div>
            </AnimationSlide>
          </div>
        </div>
        <div className="demo">
          <p>SelectMenu组件-下拉选择</p>
          <div className="example">
            <div style={{
              width: '100px'
            }}>
              <SelectMenu
                placeholder="请选择"
                tabIndex={1}
                listData={[{
                  key: 'a',
                  value: 'aaaaaa'
                },{
                  key: 'b',
                  value: 'aaabbb'
                },{
                  key: 'c',
                  value: 'aabbcc'
                },{
                  key: 'db',
                  value: '禁用的选项',
                  disabled: true
                }]}
              />
            </div>
            <SelectMenu
              placeholder="请选择"
              style={{
                width: '200px',
              }}
              initialSelectedKey="b"
              listData={[{
                key: 'a',
                value: 'aaaaaa'
              },{
                key: 'b',
                value: 'aaabbb'
              },{
                key: 'c',
                value: 'aabbcc'
              }]}
            />
          </div>
        </div>
        <HomePoster />
        <div className="demo fade-demo">
          <p>Animation-Fade组件</p>
          <div className="example">
            <AnimationFade show={this.state.animationShow} speed={2}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                fontSize: '12px',
                lineHeight: '100px',
              }}>隐藏后销毁元素</div>
            </AnimationFade>
            <AnimationFade show={this.state.animationShow} speed={2} needDestroy={false}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '100px',
                fontSize: '12px',
              }}>隐藏不销毁元素</div>
            </AnimationFade>
            <AnimationFade show={this.state.animationShow} speed="quick" needDestroy={false}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '50px',
                fontSize: '12px',
              }}>不销毁元素，淡入淡出动画播放更快</div>
            </AnimationFade>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
