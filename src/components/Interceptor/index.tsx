import createScope, { IScope, IScopeConfig } from './Scope';
import globalScope from './GlobalScope';

const GLOBAL_SCOPE_MAP: { [name: string]: IScope } = {};

function createScopeAtGlobal(name: string) {
  const scope: IScope = createScope(name);
  GLOBAL_SCOPE_MAP[name] = scope;
  return scope;
}

const Interceptor = {
  use: (scopeName?: string):IScope => {
    if (scopeName) {
      // 如果存在该名称的作用，则返回该作用域
      if (GLOBAL_SCOPE_MAP.hasOwnProperty(scopeName)) {
        return GLOBAL_SCOPE_MAP[scopeName];
      } else {
        // 如果不存在 先创建 再返回
        const scope = createScopeAtGlobal(scopeName);
        return scope;
      }
    } else {
      // 返回全局作用域
      return globalScope;
    }
  },
  add: (fn: Function, config?: IScopeConfig) => {
    const scope = createScope(Symbol(), config);
    return scope.add(fn);
  },
  destory: (content: string | IScope): void => {
    let name = '';
    if (typeof content === 'string') {
      name = content;
    } else if (typeof content.name === 'string') {
      name = content.name;
    }
    if (GLOBAL_SCOPE_MAP.hasOwnProperty(name)) {
      delete GLOBAL_SCOPE_MAP[name];
    }
  }
}

export default Interceptor;