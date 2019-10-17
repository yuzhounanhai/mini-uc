import * as React from 'react';

interface DProps {
  store2?: {
    [key: string]: any
  }
}

class D extends React.Component<DProps> {
  render() {
    return (
      <div style={{
        background: '#00afef',
        margin: '20px'
      }}>
        <h3>D组件只订阅store2</h3>
        <p>{ this.props.store2 && Object.keys(this.props.store2).map(key => {
          return this.props.store2 && this.props.store2[key]
        }).toString() }</p>
      </div>
    )
  }
}
export default D;