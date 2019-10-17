import * as React from 'react';

interface CProps {
  store1?: {
    [key: string]: any
  },
  store2?: {
    [key: string]: any
  }
}

class C extends React.Component<CProps> {
  render() {
    return (
      <div style={{
        background: '#ff0fee',
        margin: '20px',
        color: this.props.store1 ? this.props.store1.storeColor : '#000000'
      }}>
        <h3>C组件订阅store1、store2</h3>
        <p>store1信息</p>
        <p>{ this.props.store1 && Object.keys(this.props.store1).map(key => {
          return this.props.store1 && this.props.store1[key]
        }).toString() }</p>
        <p>store2信息</p>
        <p>{ this.props.store2 && Object.keys(this.props.store2).map(key => {
          return this.props.store2 && this.props.store2[key]
        }).toString() }</p>
      </div>
    )
  }
}
export default C;