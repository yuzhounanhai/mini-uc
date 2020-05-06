export interface GlobalScopeConfig {
  onPrevent?: () => void,
}

export interface IScope {
  name: string | symbol,
  add: (fn: Function, config?: ISFConfig) => (...params: any) => any,
  forceFree: () => void,
  isLock: () => boolean,
  setOnPrevent: (v: () => void) => void,
}

export interface ISFConfig {
  onPrevent?: () => void,
}

export interface IScopeConfig {
  onPrevent?: () => void,
};