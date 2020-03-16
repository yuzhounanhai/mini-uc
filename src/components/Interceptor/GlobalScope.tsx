const fnList: Function[] = [];

let lock = false;

const forceFree = (): void => {
  lock = false;
}

const add = (fn: Function) => {
  if (fn && typeof fn === 'function') {
    const customFn = (...args: any[]) => {
      if (lock) {
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

export default {
  name: Symbol(),
  add: add,
  forceFree: forceFree,
  isLock: isLock,
};