import GlobalScope from './GlobalScope';

export interface IScope {
  name: string | symbol,
  add: (fn: Function) => (...params: any) => any,
  forceFree: () => void,
  isLock: () => boolean,
}

function createScope(name: string | symbol): IScope {
  if (!name) {
    throw Error('The name parameter is required.');
  }
  const fnList: Function[] = [];
  let lock = false;
  
  function forceFree(): void {
    lock = false;
  }

  function add(fn: Function) {
    if (fn && typeof fn === 'function') {
      const customFn = (...args: any[]) => {
        if (lock) {
          return;
        }
        if (GlobalScope.isLock()) {
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

  return {
    name: name,
    add: add,
    forceFree: forceFree,
    isLock: isLock,
  };
}

export default createScope;
