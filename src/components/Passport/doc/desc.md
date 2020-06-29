## 通行证组件

通行证组件的想法自权限验证的需求而萌生，其基本作用是校验一些逻辑化的UI界面是否显示，简单来说：通行证组件校验通过后，组件的children将会被渲染，否则不渲染

### 三项校验

通行证组件内部有三项校验：

+ 角色校验
+ 条件校验
+ 授权校验

### 校验模式：与、或

你可以对内部的三项校验选择校验模式，共有两种校验模式：

+ 与: '&'
+ 或: '|'

与模式需要设置的校验项全部通过，或模式仅需满足设置校验项的其中一个。

#### 角色校验

角色校验提供一种最初级最简单的校验，即通过权重大小来决定权限高低，这种校验需要你知晓所有的用户组及其权重。

与角色校验相关的有四个概念：当前角色、所有角色表、最低角色要求、完全匹配角色。

+ 当前角色是当前通行证组件校验的目标

+ 所有角色表记录了所有角色的权限权重

+ 最低角色要求是校验的标准，只有权限高于等于最低角色要求，才会被pass

+ 完全匹配角色，只有当前角色完全等价于放行的角色标准，才会被pass

使用示例如下：

```javascript
import { Passport } from 'mini-uc';

// 完全匹配角色
<Passport
   role={user.role}
   allowRole="tourist"
>
   <p>这是只有游客才能看到的话</p>
</Passport>

// 最低角色要求
<Passport
   role={user.role}
   allowMinRole="admin"
   allRoles={['tourist', 'user', 'vip', 'admin', 'super-admin']}
>
   <p>权限大于等于admin的用户组，如admin、super-admin可以看到！</p>
</Passport>
```

`allRoles` 接收所有的角色信息，允许接收一个角色数组或者是角色数组的权重对象。

如若接收到的是数组，则通行证组件内部将采用 indexOf 来选取角色在数组中的位置进行比对。

为了更好的性能体验，你可以选择角色数组的权重对象方式，来优化indexOf遍历带来的能耗:

```javascript

// 生成Map会方便通行证组件内部读值，你可以采取实际的权重值，也可以按照实际的角色权重排序给予一个虚假的权重值。
const allRoles = {};
['tourist', 'user', 'vip', 'admin', 'super-admin'].forEach((item, index) => {
   allRoles[item] = index;
});
<Passport
   role={user.role}
   allowMinRole="admin"
   allRoles={allRoles}
>
   <p>权限大于等于admin的用户组，如admin、super-admin可以看到！</p>
</Passport>
```

### 条件校验

条件校验实际上只是一个值的校验，你可以使用通行证组件来处理一些判断语句块

```javascript

{
   status === 1 && (
      <button>do something</button>
   )
}

// 可以改写成

<Passport
   condition={status === 1}
>
   <button>do something</button>
</Passport>
```

### 授权校验

授权校验是三项校验之中最为自由的，需要使用时需自己定义 `onAuthCheck` 方法，该方法将会收到组件的参数，并返回是否通过的布尔值。

你可以与你存储权限映射的redux store做关联，将Passport组件进行二次封装，会获得更为丰富的通行证组件。

#### 通行证与redux做关联

假设：在redux仓库中，存储了用户信息。用户信息中定义了当前用户的全部权限，而验证用户是否具备某一权限便是需要将某一功能所校验的权限名与用户拥有的权限列表进行校验，那么我们可以再封装一个PermissionPassport组件

```javascript
import { Passport } from 'mini-uc';
import { connect } from 'react-redux';

function BasePermissionPassport(props) {
   const {
      // redux附加的props 是当前用户的权限映射
      permissions,
      // 自定义字段 在使用PermissionPassport组件时需要校验的权限名称
      permissionKey,
      children,
      ...otherProps,
   } = props;

   // passportProps 是 Passport 组件接收到的部分props
   const onAuthCheck = (passportProps) => {
      const {
         ps,
         pKey,
      } = passportProps;
      if (ps && pKey) {
         // 判断权限映射中是否存在当前权限
         return !!ps[pKey];
      }
      return false;
   }

   return (
      <Passport
         {...otherProps}
         ps={permissions}
         pkey={permissionKey}
         onAuthCheck={onAuthCheck}
      >
         {children}
      </Passport>
   );
}

const PermissionPassport = connect(({ user }) => ({
   permissions: user.permissions,
}))(BasePermissionPassport);

export default PermissionPassport;
```

##### 自定义字段

在上述例子中给Passport组件附加了自定义的字段ps、pKey，这两个参数将不会在组件内部发生作用，会原封不动的传入onAuthCheck函数中。

### 未通过校验的显示

可以设置未通过通行证组件时显示内容

```javascript
<Passport
   notPassContent={(
      <span>您暂未拥有权限查看当前内容</span>
   )}
   condition={false}
>
   <p>XXXX</p>
</Passport>
```

## API

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| mode | 多项匹配的模式 | '&' &#124; '|' | '&' | |
| role | 角色匹配项-当前待匹配的角色 | string | | |
| allowRole | 角色匹配项-仅能通过的角色，如若和allowMinRole一起使用，allowMinRole优先级更高 | string | | |
| allowMinRole | 角色匹配项-允许的最低权限角色,使用这个api需要同步传递allRoles | string | | |
| allRoles | 角色匹配项-所有角色映射，允许接收一个数组或者权限权重映射 | string[] &#124; { [roleName: string]: number } | | |
| condition | 条件匹配项 | any | | |
| notPassContent | 没有通过校验时显示的内容 | ReactNodes | | |
| onAuthCheck | 授权匹配项-接收一个方法，并给这个方法传递组件内部分props的值，该函数需要返回一个布尔值，表示授权验证是否通过。 | (props: PassportProps) => boolean | | |