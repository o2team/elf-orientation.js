# orientation.js [![NPM version][npm-version-image]][npm-version-url]

处理重力感应，通过监听 `deviceorientation` 和 `orientationchange` 事件。

- 对 `deviceorientation` 的回调函数参数 `DeviceOrientationEvent` 进行封装，增加了一些更便于使用的属性，
- 统一了 `iOS` 和 `Android` 的差异
- 处理了横屏竖屏的情况

[DEMO](https://orientation.now.sh/examples/demo.html)

## 安装

```
npm install --save orientation.js
```

## 使用

支持 AMD、CMD 或者直接引入。

```
var Orientation = require('orientation.js')

var ori = new Orientation({
    initForwardSlant: 45, // 可选，初始向前倾斜度
    onChange: function (e) {
        console.log(e)
    }
})
ori.init()
```

## 介绍

### 配置项

- **initForwardSlant** `Number` `可选`

  前后倾斜度基准值

- **onChange** `Function(event)`

  监听重力感应的回调函数。在 `DeviceOrientationEvent` 的基础上增加了：

  - lon `Number` `[0, 360]`

    水平坐标。初始时的位置为 0

  - lat `Number` `[-270, 90]`

    垂直坐标。当手机竖直时，lat 为 0

  - offsetLon `Number`

    相对上一次回调时，水平坐标的偏移量

  - offsetLat `Number`

    相对上一次回调时，垂直坐标的偏移量

  - leftRotate/rightRotate `Number` `[-180, 180]`

    向左/右旋转偏移量

  - leftSlant/rightSlant `Number` `[-90, 90]`

    向左/右倾斜偏移量

  - isLeft/isRight `Boolean`

    是否向左/右倾斜

  - forwardSlant/backwardSlant `Number` `[-180, 180]`

    向前/后倾斜偏移量

  - isForward/isBackward `Boolean`

    是否向前/后倾斜

  - relativeForwardSlant/relativeBackwardSlant `Number` `[-180, 180]`

    相对于初始位置或 `initForwardSlant` 的前/后倾斜偏移量

  - isRelativeForward/isRelativeBackward `Boolean`

    相对于初始位置或 `initForwardSlant` 的是否前/后倾斜


### 实例方法

**`init`**

初始化，开始监听事件

**`pause`**

不触发 `onChange`

**`continue`**

解除 `pause` 状态

**`destory`**

销毁监听事件

## 启示

感谢 @shrekshrek 的 https://github.com/shrekshrek/orienter

## 许可

MIT

[npm-version-image]: https://img.shields.io/npm/v/orientation.js.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/orientation.js
