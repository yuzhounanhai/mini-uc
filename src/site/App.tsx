import * as React from 'react';
import FadeAnimation from '@/components/Animation/Fade';

class App extends React.Component {
  state = {
    animationShow: true
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        animationShow: !this.state.animationShow
      });
    }, 5000)
  }
  render() {
    return (
      <div className="App">
        <div>
          <p>Fade组件</p>
          <div>
            <FadeAnimation show={this.state.animationShow} speed={2}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                fontSize: '12px',
                lineHeight: '100px',
              }}>隐藏后销毁元素</div>
            </FadeAnimation>
            <FadeAnimation show={this.state.animationShow} speed={2} needDestroy={false}>
            <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '100px',
                fontSize: '12px',
                marginTop: '10px',
              }}>隐藏不销毁元素</div>
            </FadeAnimation>
            <FadeAnimation show={this.state.animationShow} speed="quick" needDestroy={false}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#0f0',
                textAlign: 'center',
                lineHeight: '50px',
                fontSize: '12px',
                marginTop: '10px',
              }}>不销毁元素，淡入淡出动画播放更快</div>
            </FadeAnimation>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
