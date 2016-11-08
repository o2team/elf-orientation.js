(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        // CMD
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        root.Orientation = factory()
    }
}(this, function() {
    var assign = Object.assign || function(base, extend) {
        for (var prop in extend) {
            base[prop] = extend[prop]
        }
        return base
    }

    var Orientation = function(options) {
        var opts = {
            onChange: function() {}
        }
        if (typeof options === 'function') {
            opts.onChange = options
        } else {
            opts = assign(opts, options)
        }

        var data = {
            initForwardSlant: opts.initForwardSlant,
            orientation: window.orientation || 0
        }

        this.handleDeviceOrientation = function(e) {
            var alpha = Math.floor(e.alpha)
            var beta = Math.floor(e.beta)
            var gamma = Math.floor(e.gamma)

            data.leftRotate = alpha < 180 ? alpha : alpha - 360
            data.rightRotate = -data.leftRotate

            switch (data.orientation) {
                case 0:
                    data.forwardSlant = beta
                    break
                case 90:
                    data.forwardSlant = gamma < 0 ? -gamma : 180 - gamma
                    break
                case -90:
                    data.forwardSlant = gamma < 0 ? 180 + gamma : gamma
                    break
            }
            data.backwardSlant = -data.forwardSlant
            data.isForward = data.forwardSlant > 0
            data.isBackward = !data.isForward
            // 记录初始的 向前倾斜度
            if (data.initForwardSlant === undefined) data.initForwardSlant = data.forwardSlant
            switch (data.orientation) {
                case 0:
                    data.forwardThreshold = data.initForwardSlant > 0 ? -180 + data.initForwardSlant : 180 + data.initForwardSlant
                    if (data.initForwardSlant > 0 && beta < data.forwardThreshold) {
                        data.relativeForwardSlant = beta + 360 - data.initForwardSlant
                    } else if (data.initForwardSlant < 0 && beta > data.forwardThreshold) {
                        data.relativeForwardSlant = beta - 180 - data.initForwardSlant
                    } else {
                        data.relativeForwardSlant = beta - data.initForwardSlant
                    }
                    break
                case 90:
                case -90:
                    // data.forwardThreshold
                    // 横屏时，只考虑向前倾斜度在 [0, 180] 的情况
                    data.relativeForwardSlant = data.forwardSlant - data.initForwardSlant
                    break
            }
            data.relativeBackwardSlant = -data.relativeForwardSlant
            data.isRelativeForward = data.relativeForwardSlant > 0
            data.isRelativeBackward = !data.isRelativeForward

            switch (data.orientation) {
                case 0:
                    data.leftSlant = -gamma
                    break
                case 90:
                    data.leftSlant = -beta
                    break
                case -90:
                    data.leftSlant = beta
                    break
            }
            data.rightSlant = -data.leftSlant
            data.isLeft = data.leftSlant > 0
            data.isRight = !data.leftSlant

            opts.onChange(assign(e, data))
        }

        this.handleOrientationChange = function(e) {
            data.orientation = window.orientation
            data.initForwardSlant = undefined
        }

    }

    Orientation.prototype.init = function() {
        window.addEventListener('deviceorientation', this.handleDeviceOrientation, false)
        window.addEventListener('orientationchange', this.handleOrientationChange, false)
    }

    Orientation.prototype.destory = function() {
        window.removeEventListener('deviceorientation', this.handleDeviceOrientation, false)
        window.removeEventListener('orientationchange', this.handleOrientationChange, false)
    }

    return Orientation
}))
