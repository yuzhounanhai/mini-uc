import * as React from 'react';
import MiniStore from '@/components/MiniStore';
import B from './B';
import C from './C';
import D from './D';

class A extends React.Component {
  render() {
    return (
      <div style={{
        background: '#eeeeee'
      }}>
        <MiniStore.Provider storeName="store2" value={{
          name: 'store2',
          text: 'store2',
          color: '#000000',
        }}>
          <h3>A组件（嵌套B组件C组件D组件）</h3>
          <p>A组件没有订阅任何store，但创建了另一个provider：store2</p>
          <MiniStore.Consumer storeName="store1">
            <B />
          </MiniStore.Consumer>
          <MiniStore.Consumer storeName="store1">
            <MiniStore.Consumer storeName="store2">
              <C />
            </MiniStore.Consumer>
          </MiniStore.Consumer>
          <MiniStore.Consumer storeName="store2">
            <D />
          </MiniStore.Consumer>
        </MiniStore.Provider>
      </div>
    )
  }
}
export default A;