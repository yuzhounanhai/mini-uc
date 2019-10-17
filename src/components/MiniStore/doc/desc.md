## MiniStore

MiniStore 是 React Context 的封装，保持了 React Context 的使用方式。

### 基本使用

```react
import MiniStore from '...';
// ...
render() {
  return (
    {/* 创建一个MiniStore，其值由value提供 */}
    <MiniStore.Provider
      storeName="store1"
      value={{
        name: 'nanhai'
        lang: 'react'
      }}
    >
      <p>段落</p>
      {/* B组件订阅store1的数据 */}
      <MiniStore.Consumer storeName="store1">
        <B />
      </MiniStore.Consumer>
    </MiniStore.Provider>
  )
}
// ...
```

### 暴露成员

相关伪代码

```
export function packMiniStoreStates
export function packMiniStoreState
export default {
  Provider: xxx,
  Consumer: xxx,
  packMiniStoreStates,
  packMiniStoreState,
}

```

### packMiniStoreStates(state, context)

一个用以包装 state 类型的 MiniStore 的 value 值，其作用是返回一个对象，使每一个state 的成员（第一层成员）具备一个 set 更改方法。

例如一个组件的 state 为

```
{
  name: 'nanhai'
}
```

使用该方法的伪代码如下：

```
import MiniStore, { packMiniStoreStates } from '...';

packMiniStoreStates(this.state, this);

// 也可以使用MiniStore.packMiniStoreStates(this.state, this);
```

执行该方法后会返回以下结果

```
{
  name: 'nanhai',
  setName: (value) => {...}
}
```

### packMiniStoreState(key, value, context)

同 packMiniStoreStates。

packMiniStoreStates 是批量处理 state（处理集合{}）,而 packMiniStoreState 则是处理一个 state。

### Provider API

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| storeName | 创建出MiniStore的名字，后续订阅组件将会查找这个名字 | string | | |
| value | 创建出MiniStore的内容、值，需要传入一个对象。 | { [key: string]: any } | {} | |

### Consumer API

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| storeName | 订阅的MiniStore的名字，订阅组件需要在Provider组件的内部，订阅成功后，store的值将会挂载在名为storeName的props下 | string | | |

### 订阅多个store

不提倡订阅多个 store，可以查看 React 官方文档 Context 一节了解更多, 但仍然你可以利用 MiniStore 来订阅多个 store：

```
this.state = {
  age: 12
}

// ...

<MiniStore.Provider
  storeName="store1"
  value={{
    ...packMiniStoreStates(this.state, this),
    otherValue: 'something'
  }}
>
  <B />
  <MiniStore.Provider
    storeName="store2"
    value={{
      name: 'nanhai',
      lang: 'react',
      ...MiniStore.packMiniStoreState('size', this.state.size, this)
    }}
  >
    {/* 订阅store1 */}
    <MiniStore.Consumer storeName="store1">
      {/* 订阅store2 */}
      <MiniStore.Consumer storeName="store2">
        <C />
      </MiniStore.Consumer>
    </MiniStore.Consumer>
  </MiniStore.Provider>
</MiniStore.Provider>
```

C组件使用
```
this.props.store1.otherValue

this.props.store1.setAge(100)

this.props.store2.name

this.props.store2.setSize('100px')
```