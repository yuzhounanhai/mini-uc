import { GlobalScopeConfig, ISFConfig } from './interface';

const fnList: Function[] = [];

let lock = false;

export let globalScopeConfigs: GlobalScopeConfig = {};

const forceFree = (): void => {
  lock = false;
}

const add = (fn: Function, config?: ISFConfig) => {
  if (fn && typeof fn === 'function') {
    const customFn = (...args: any[]) => {
      if (lock) {
        if (config && config.onPrevent) {
          typeof config.onPrevent === 'function' && config.onPrevent();
        } else if (globalScopeConfigs.onPrevent) {
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

const isLock = () => {
  return lock;
}

const setOnPrevent = (v: () => void) => {
  globalScopeConfigs.onPrevent = v;
}

export default {
  name: Symbol(),
  add: add,
  forceFree: forceFree,
  isLock: isLock,
  setOnPrevent: setOnPrevent,
};