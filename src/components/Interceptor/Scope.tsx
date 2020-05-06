import GlobalScope, { globalScopeConfigs } from './GlobalScope';
import {
  IScope,
  ISFConfig,
  IScopeConfig,
} from './interface';

function createScope(name: string | symbol, scopeConfig?: IScopeConfig): IScope {
  if (!name) {
    throw Error('The name parameter is required.');
  }
  const fnList: Function[] = [];
  let lock = false;
  let scopeConfigs = scopeConfig;
  
  function forceFree(): void {
    lock = false;
  }

  function add(fn: Function, config?: ISFConfig) {
    if (fn && typeof fn === 'function') {
      const customFn = (...args: any[]) => {
        if (lock) {
          if (config) {
            typeof config.onPrevent === 'function' && config.onPrevent();
          } else if (scopeConfigs && typeof scopeConfigs.onPrevent === 'function') {
            scopeConfigs.onPrevent();
          }
          return;
        }
        if (GlobalScope.isLock()) {
          if (globalScopeConfigs.onPrevent) {
            typeof globalScopeConfigs.onPrevent === 'function' && globalScopeConfigs.onPrevent();
          }
          return;
        }
        lock = true;
        fn(...args);
      };
      customFn.prototype.forceFree = () => {
        lock = false;
      }
      fnList.push(customFn);
      return customFn;
    }
    return fn;
  }

  function isLock() {
    return lock;
  }

  function setOnPrevent(v: () => void): void {
    if (!scopeConfigs) {
      scopeConfigs = {};
    }
    scopeConfigs.onPrevent = v;
  }

  return {
    name: name,
    add: add,
    forceFree: forceFree,
    isLock: isLock,
    setOnPrevent: setOnPrevent,
  };
}

export default createScope;
