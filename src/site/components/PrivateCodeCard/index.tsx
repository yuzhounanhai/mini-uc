import * as React from 'react';
import Interceptor from '@/components/Interceptor';
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
    this.onClickPersonal = Interceptor.add(this.onClickPersonal.bind(this));
  }

  componentWillUnmount() {
    Interceptor.destory('scope1');
    Interceptor.destory('scope2');
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

  onClickPersonal(a: any, b: any) {
    console.log('点击了专属作用域按钮，在三秒后解除，传递的参数是：' + a + ',' + b);
    setTimeout(() => {
      this.onClickPersonal.prototype.forceFree();
      console.log('解锁专属作用域');
    }, 3000);
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
        <div className={styles.scope}>
          <h3>专属作用域</h3>
          <div className={styles.btn} onClick={() => {
            this.onClickPersonal(1, 2);
          }}>专属作用域</div>
        </div>
      </div>
    )
  }
}

export default PrivateCodeCard;