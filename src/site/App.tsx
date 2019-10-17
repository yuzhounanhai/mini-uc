import * as React from 'react';
import FadeAnimation from '@/components/Animation/Fade';
import SelectMenu from '@/components/SelectMenu';
import MiniStore, { packMiniStoreState } from '@/components/MiniStore';
import './App.scss';
import A from './component/A';

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
          <p>MiniStore --- context的解决方案</p>
          <MiniStore.Provider storeName="store1" value={{
            name: 'store1',
            ...packMiniStoreState('storeColor', this.state.storeColor, this),
          }}>
            <A />
          </MiniStore.Provider>
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
        <div className="demo fade-demo">
          <p>Fade组件</p>
          <div className="example">
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
              }}>不销毁元素，淡入淡出动画播放更快</div>
            </FadeAnimation>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
