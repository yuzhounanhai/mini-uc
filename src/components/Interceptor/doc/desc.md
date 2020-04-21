## Interceptor 拦截器

拦截器是一个工具组件，它的主要功能是拦截函数的再执行。适用于拦截连点请求情景下的业务需求。

举例来说，一个新增按钮，它的点击操作将会发起一个请求，这个请求会添加一则数据进入数据库，如若不进行连点拦截，那么在用户快速点击多次的情况下，将会有多条相同的数据被加入数据库中。

![Interceptor效果示例](images/interceptor.gif)

## 拦截器的作用域

拦截器的作用域是拦截器拦截的范围区域，当该作用域被上锁，属于该作用域内的所有函数调用都将被拦截。

+ 全局作用域
+ 独立作用域
+ 专属作用域

> 场景说明： A函数被添加到了全局作用域，B1、B2被添加到了独立作用域1，C1、C2被添加到了独立作用域2、D1、D2则创建了专属作用域中。当A处于执行过程中，B1、B2、C1、C2、D1、D2都将被拦截；当B1处于执行过程中，B1、B2的函数调用被拦截，同理当C2处于执行过程中时，C1、C2会被拦截；D1处于执行过程中时，D1会被拦截；D2同D1处理。

#### 引用全局作用域

```javascript
import { Interceptor } from 'mini-uc';

// 引用全局作用域
const globalScope = Interceptor.use(); 
```

#### 创建/引用独立作用域

你可以根据不同场景，创建多个独立作用域，每个拦截作用域将独立拦截函数的调用执行。

```javascript
import { Interceptor } from 'mini-uc';

// 创建了一个名为Asia的拦截作用域
const scope1 = Interceptor.use('Asia');
// 创建了一个名为Europe的拦截作用域
const scope2 = Interceptor.use('Europe');
// 因为上面已经创建过Asia的拦截作用域，所以此处是引用Asia拦截作用域
const asia = Interceptor.use('Asia');
```

##### 清除拦截作用域的副作用影响

作用域一旦创建将会在项目级别的范围产生作用，组件A、组件B引用了作用域1，即便A\B处于不同的位置，但作用域1仍然是同一个。

因此在不使用时需要及时清除作用域，以消除此作用域的影响

```javascript
import React from 'react';
import { Interceptor } from 'mini-uc';

class C extends React.Component {
  constructor(props) {
    super(props);
    const scope = Interceptor.use('Asia');
    // ...
  }

  componentWillUnmount() {
    // 组件销毁时移除作用域
    Interceptor.destory('Asia');
  }

  // ...
}
```

#### 使用专属作用域

专属作用域的意思是为单一函数创建单独的作用域空间

```javascript
import { Interceptor } from 'mini-uc';

const fn = () => {
  console.log('fn');
}

const scopedFn1 = Interceptor.add(fn);
const scopedFn2 = Interceptor.add(fn);
```

上述例子对同一个方法fn设立了专属作用域，并返回了包装后的方法，而scopedFn1和scopedFn2是两个专属作用域的不同函数。

## 拦截作用域对象

`Interceptor.use()`方法会返回拦截作用域对象(IScope)，作用域对象IScope的属性如下：

```typescript
export interface IScope {
  name: string | symbol,
  add: (fn: Function) => (...params: any) => any,
  forceFree: () => void,
  isLock: () => boolean,
}
```

作用域对象有四个属性：

+ name是作用域对象的标志；
+ add方法是将一个方法加入该拦截作用域中，并返回一个包装后的方法；
+ forceFree方法，将该拦截作用域强制解锁；
+ isLock方法，判断该作用域是否上锁。

#### 为拦截作用域添加函数成员

`scope1.add`方法接收一个函数，并返回一个包装后的属于scope1拦截作用域的函数，被包装的方法的原型对象上存在一个forceFree方法，用以在该函数逻辑结束时，解锁当前作用域的锁定状态。

若scope1拦截作用域处于未上锁的状态，被包装后的方法一经调用即上锁，直到手动调用解锁函数。

```javascript
import { Interceptor } from 'mini-uc';

function fn() {
  console.log('fn');
  setTimeout(() => {
    console.log('解除锁定');
    fn.prototype.forceFree();
  }, 3000);
}

const scope = Interceptor.use('scope');
const packedFn = scope.add(fn);

packedFn();
packedFn();

// 只会打印一个fn, 和一个解除锁定
```

#### 函数return后自动解除锁定（新）

TODO：为了丰富拦截作用域的表现，特此在XXX版本追加了这一特性。该特性可令一些同步函数事件，在执行完毕后自动执行作用域解锁事件

> 场景:
> 商品下单页，有选择地址区域，点击该区域后弹窗出现地址列表，点击地址列表的某一项，即可切换收货地址，点击蒙层关闭地址列表弹窗；下单页的底部有一个下单按钮，点击便会触发提交订单请求
> 在这个场景下，有四个事件：
> 1. 打开地址列表;
> 2. 切换地址;
> 3. 关闭地址列表;
> 4. 下单
> 假设我们点击下单后，因某些原因loading蒙层并没有出现，那么此时我们对于切换地址的功能应该禁止，以防止提交数据和界面显示不一致。而打开关闭地址列表并不存在太大的问题。
> (特殊说明：这个例子并不太恰当，在这里笔者可能更多的想表达：即便我们界面上有一些蒙层拦截，在部分逻辑严谨的场景下，我们也需要在逻辑上进行拦截，而非仅仅做到UI去阻止操作)
> 那么我们可以将切换地址 和 下单归于一个拦截作用域，在点击下单后，切换地址的操作将被拦截。乍看之下没有什么问题，但是当我们点击切换地址这个操作后，其实仅仅更改的是一个内存中的变量，这是一个同步的操作，但是因为被加入到了拦截作用域中，因此我们需要手动告诉作用域该事件已经完成，对于同步事件的操作来说，forceFree的代码可以说是冗余的。
> 因此，考虑增加一个特性：对于拦截作用域中的同步函数，可以设置在函数执行完毕时主动forceFree。

#### 拦截请求后增加默认行为（新）

TODO 0.2.2 版本，拦截器对于成功拦截的函数执行，仅仅做了return处理，在（XXX版本）我们对这一现象做了更正，丰富了反馈体验。
使用者可以在拦截行为成功触发时，进行默认行为的反馈，例如Toast提示、统计等。


## 在React中的实践

```javascript
import * as React from 'react';
import { Interceptor } from 'mini-uc';
import * as styles from './index.modules.scss';

class PrivateCodeCard extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
    const scope = Interceptor.use();
    const scope1 = Interceptor.use('scope1');
    const scope2 = Interceptor.use('scope2');
    this.onClickGlobalBtn = scope.add(this.onClickGlobalBtn.bind(this));
    this.onClickFreeScope1 = this.onClickFreeScope1.bind(this);
    this.onClickFreeScope2 = this.onClickFreeScope2.bind(this);
    this.onClickScope11 = scope1.add(this.onClickScope11.bind(this));
    this.onClickScope12 = scope1.add(this.onClickScope12.bind(this));
    this.onClickScope21 = scope2.add(this.onClickScope21.bind(this));
    this.onClickScope22 = scope2.add(this.onClickScope22.bind(this));
  }

  onClickGlobalBtn() {
    console.log('点击了全局按钮');
    setTimeout(() => {
      this.onClickGlobalBtn.prototype.forceFree();
      console.log('解锁全局');
    }, 3000);
  }

  onClickFreeScope1() {
    const scope1 = Interceptor.use('scope1');
    scope1.forceFree();
    console.log('作用域1已经解除占用');
  }

  onClickFreeScope2() {
    const scope2 = Interceptor.use('scope2');
    scope2.forceFree();
    console.log('作用域2已经解除占用');
  }

  onClickScope11() {
    console.log('点击了作用域1按钮');
    setTimeout(() => {
      this.onClickScope11.prototype.forceFree();
      console.log('解锁作用域1');
    }, 3000);
  }

  onClickScope12() {
    console.log('点击了作用域1按钮，将一直占用');
  }

  onClickScope21() {
    console.log('点击了作用域2按钮');
    setTimeout(() => {
      this.onClickScope21.prototype.forceFree();
      console.log('解锁作用域2');
    }, 3000);
  }

  onClickScope22() {
    console.log('点击了作用域2按钮，将一直占用');
  }

  render() {
    return (
      <div className={styles.container}>
        <h3>全局作用域</h3>
        <p>请打开控制台查看打印结果</p>
        <div className={styles.btn} onClick={this.onClickGlobalBtn}>点击后三秒解锁全局</div>
        <div className={styles.btn} onClick={this.onClickFreeScope1}>解锁作用域1</div>
        <div className={styles.btn} onClick={this.onClickFreeScope2}>解锁作用域2</div>
        <div className={styles.scope}>
          <h3>作用域1</h3>
          <div className={styles.btn} onClick={this.onClickScope11}>点击后三秒解锁</div>
          <div className={styles.btn} onClick={this.onClickScope12}>点击后不解锁</div>
        </div>
        <div className={styles.scope}>
          <h3>作用域2</h3>
          <div className={styles.btn} onClick={this.onClickScope21}>点击后三秒解锁</div>
          <div className={styles.btn} onClick={this.onClickScope22}>点击后不解锁</div>
        </div>
      </div>
    )
  }
}

export default PrivateCodeCard;
```