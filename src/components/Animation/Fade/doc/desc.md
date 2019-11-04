## Fade 过渡

Fade 组件提供一种淡入淡出的过渡效果。

### API

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| show | 控制内容是否显示 | boolean | true | |
| speed | 过渡动画的时间快慢，允许接收一个数字（单位为s），也可以接收"quick"、"middle"、"slow"三个标识字符串 | number\|'quick'\|'slow'\|'middle' | 0.5 | |
| needDestroy | 控制内容在淡出后是否需要销毁，如若不销毁，内容区域只是附加了一个`opacity: 0;`的样式，但仍然占据空间。 | boolean | true | |