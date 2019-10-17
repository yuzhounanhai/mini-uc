import * as React from 'react';

interface Obj {
  [key: string]: any
};

const storeMap: {
  [key: string]: React.Context<{}>
} = {};

const referenceCountingMap: { [key: string]: number } = {};

export interface MiniStoreProviderProps {
  storeName: string,
  value: Obj
}

class MiniStoreProvider extends React.Component<MiniStoreProviderProps> {
  TestContext: React.Context<{}>

  constructor(props: MiniStoreProviderProps) {
    super(props);
    if (typeof this.props.storeName !== 'string') {
      throw Error('MiniStoreProvider need a storeName to init Component, and the storeName must be a string type.');
    }
    if (Object.keys(storeMap).indexOf(this.props.storeName) > -1) {
      this.TestContext = storeMap[this.props.storeName];
    } else {
      this.TestContext = React.createContext({});
      storeMap[this.props.storeName] = this.TestContext;
    }
    // 引用计数
    referenceCountingMap[this.props.storeName] = (referenceCountingMap[this.props.storeName] || 0) + 1;
  }

  componentWillUnmount() {
    // 卸载时计数减一
    referenceCountingMap[this.props.storeName] = (referenceCountingMap[this.props.storeName] || 0) - 1;
    // 如果调用计数为0  则清除为0的context
    if (referenceCountingMap[this.props.storeName] <= 0) {
      delete referenceCountingMap[this.props.storeName];
      delete storeMap[this.props.storeName];
    }
  }
  
  render() {
    const { value, children } = this.props;
    return (
      <this.TestContext.Provider value={value}>
        { children }
      </this.TestContext.Provider>
    );
  }
}

export interface MiniStoreConsumerProps {
  storeName: string
}

class MiniStoreConsumer extends React.Component<MiniStoreConsumerProps> {
  ContextConsumer: {
    id: string,
    consumer?: React.ExoticComponent<React.ConsumerProps<{}>>
  }

  constructor(props: MiniStoreConsumerProps) {
    super(props);
    const { storeName } = this.props;
    this.ContextConsumer = {
      id: '',
    };
    if (typeof storeName !== 'string' || Object.keys(storeMap).indexOf(storeName) < 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Can not find store which storeName is called '${storeName}'.`);
      }
    } else {
      this.ContextConsumer.id = storeName;
      this.ContextConsumer.consumer = storeMap[storeName].Consumer;
    }
  }
  render() {
    const { children, storeName, ...otherProps } = this.props;
    if (this.ContextConsumer.consumer) {
      return (
        <this.ContextConsumer.consumer>
          {
            (contextState) => {
              let childNodes: React.ReactNode[] = [];
              if (Object.prototype.toString.call(children) !== '[object Array]') {
                childNodes = [children];
              }
              return childNodes.map((o: any, i: number) => {
                if (o && !o.key && childNodes.length > 1) {
                  console.warn('You may need to set a key to help achieve higher performance.');
                }
                return React.cloneElement(o, {
                  ...otherProps,
                  [this.ContextConsumer.id]: contextState,
                  key: o.key || i,
                });
              });
            }
          }
        </this.ContextConsumer.consumer>
      );
    } else {
      return children;
    }
  }
}

export function packMiniStoreStates(state: Obj, context: React.Component) {
  const result = {};
  Object.keys(state).forEach(key => {
    Object.assign(result, packMiniStoreState(key, state[key], context))
  });
  return result;
}

export function packMiniStoreState(stateItemKey: string, stateItemValue: any, context: React.Component) {
  return {
    [stateItemKey]: stateItemValue,
    [`set${stateItemKey.charAt(0).toUpperCase()}${stateItemKey.slice(1)}`]: (value: any, cb: any) => {
      context.setState({
        [stateItemKey]: value
      }, cb);
    }
  }
}

export default {
  Provider: MiniStoreProvider,
  Consumer: MiniStoreConsumer,
  packMiniStoreState,
  packMiniStoreStates
};
