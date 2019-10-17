import * as React from 'react';
import C from './C';
import MiniStore from '@/components/MiniStore';

interface BProps {
  store1?: {
    [key: string]: any
  }
}

class B extends React.Component<BProps> {
  onClick() {
    const { storeColor, setStoreColor } = this.props.store1 || {};
    let setColorValue = '#ffff00';
    if (storeColor === '#ffff00') {
      setColorValue = '#00ffff';
    }
    if (typeof setStoreColor === 'function') {
      setStoreColor(setColorValue);
    }
  }
  render() {
    return (
      <div style={{
        background: '#eeffee',
        margin: '20px'
      }}>
        <h3>B组件订阅store1(嵌套C组件)<button onClick={this.onClick.bind(this)}>点击切换文字颜色</button></h3>
        <p>{ this.props.store1 && Object.keys(this.props.store1).map(key => {
          return this.props.store1 && this.props.store1[key]
        }).toString() }</p>
        <MiniStore.Consumer storeName="store1">
          <MiniStore.Consumer storeName="store2">
            <C />
          </MiniStore.Consumer>
        </MiniStore.Consumer>
      </div>
    )
  }
}
export default B;