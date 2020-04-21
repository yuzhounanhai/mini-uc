import {
  TFOMProperty,
  Matrix,
} from './interfaces';

export default class TFOM {
  cssProperty: TFOMProperty
  element: HTMLElement

  constructor(el: HTMLElement, transformCssProperty?: TFOMProperty) {
    this.cssProperty = {
      ...(transformCssProperty || {})
    }
    this.element = el;
    this.draw();
  }

  get(propertyName?: string): any {
    if (propertyName) {
      if (propertyName === 'scaleX' || propertyName === 'scaleY' || propertyName === 'scaleZ') {
        if (!this.cssProperty[propertyName]) {
          return 1;
        }
      }
      if (propertyName === 'rotateX' || propertyName === 'rotateY' || propertyName === 'rotateZ') {
        if (!this.cssProperty[propertyName]) {
          return '0deg';
        }
      }
      return this.cssProperty[propertyName];
    } else {
      return {
        ...this.cssProperty,
      };
    }
  }

  set(transformCssProperty: TFOMProperty): void {
    this.cssProperty = {
      ...this.cssProperty,
      ...transformCssProperty
    };
  }

  remove(propertyNames: string | string[]): any {
    if (Array.isArray(propertyNames)) {
      propertyNames.forEach((propertyName) => {
        delete this.cssProperty[propertyName];
      });
    } else {
      delete this.cssProperty[propertyNames];
    }
  }

  removeAll() {
    this.cssProperty = {};
  }

  removeAllAndDraw() {
    this.removeAll();
    this.draw();
  }

  removeAndDraw(propertyNames: string | string[]): any {
    this.remove(propertyNames);
    this.draw();
  }

  setAndDraw(transformCssProperty: TFOMProperty): void {
    this.set(transformCssProperty);
    this.draw();
  }

  draw():void {
    const transformValueArr: string[] = [];
    Object.keys(this.cssProperty).forEach(transformFunctionName => {
      if (transformFunctionName === 'matrix3d' || transformFunctionName === 'matrix') {
        transformValueArr.push(`${transformFunctionName}(${(this.cssProperty[transformFunctionName] as Matrix).join(', ')})`);
      } else {
        transformValueArr.push(`${transformFunctionName}(${this.cssProperty[transformFunctionName]})`);
      }
    })
    this.element.style.transform = transformValueArr.join(' ');
  }
}