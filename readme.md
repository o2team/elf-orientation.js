# orientation-wrapper

基于 `DeviceOrientationEvent` 封装，扩充了参数，使其更易于使用。

[DEMO](https://orientation-wrapper-hgcjjahnjr.now.sh/examples/show-case.html)

## Usage

支持 AMD、CMD或者直接引入。

```
var Orientation = require('orientation-wrapper')

var ori = new Orientation({
    initForwardSlant: 45, // 可选，初始向前倾斜度
    onChange: function (e) {
        // 在 DeviceOrientationEvent 上增加了
        console.log(e.leftRotate) // 向左旋转偏移量
        console.log(e.rightRotate) // 向右旋转偏移量

        console.log(e.forwardSlant) // 向前倾斜偏移量
        console.log(e.backwardSlant) // 向后倾斜偏移量
        console.log(e.isForward) // 是否向前倾斜
        console.log(e.isBackward) // 是否向后倾斜
        console.log(e.relativeForwardSlant) // 相对初始切斜度的向前倾斜偏移量
        console.log(e.relativeBackwardSlant) // 相对初始切斜度的向后倾斜偏移量
        console.log(e.isRelativeForward) // 相对初始切斜度是否向前倾斜
        console.log(e.isRelativeBackward) // 相对初始切斜度是否向前倾斜

        console.log(e.leftSlant) // 向左倾斜偏移量
        console.log(e.rightSlant) // 向右倾斜偏移量
        console.log(e.isLeft) // 是否向左倾斜
        console.log(e.isRight) // 是否向右倾斜
    }
})
ori.init()
// ori.destory()
```
