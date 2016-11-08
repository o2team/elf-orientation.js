(function (root, factory) {
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
}(this, function () {
    var assign = Object.assign || function (base, extend) {
        for (var prop in extend) {
            base[prop] = extend[prop]
        }
        return base
    }

    var Orientation = function (options) {
        this.opts = {
            onChange: function () {}
        }
        if (typeof options === 'function') {
            this.opts.onChange = options
        } else {
            this.opts = assign(this.opts, options)
        }

        this.data = {
            initLeftRotate: undefined,
            initForwardSlant: this.opts.initForwardSlant,
            orientation: window.orientation || 0
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        this.data.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

        this.handleDeviceOrientation = function (e) {
            var alpha = Math.floor(e.alpha)
            var beta = Math.floor(e.beta)
            var gamma = Math.floor(e.gamma)

            // https://github.com/w3c/deviceorientation/issues/6
            if (this.data.initLeftRotate === undefined) {
                this.data.initLeftRotate = this.data.isIOS ? Math.floor(e.webkitCompassHeading) : alpha
            }
            // iOS 的 alpha 的已经是相对的了，不需要做处理
            if (!this.data.isIOS) {
                if (alpha > 0 || alpha < this.data.initLeftRotate) {
                    alpha += 360
                }
                alpha -= this.data.initLeftRotate
            }

            this.data.leftRotate = alpha < 180 ? alpha : alpha - 360
            this.data.rightRotate = -this.data.leftRotate

            switch (this.data.orientation) {
                case 0:
                    this.data.forwardSlant = beta
                    break
                case 90:
                    this.data.forwardSlant = gamma < 0 ? -gamma : 180 - gamma
                    break
                case -90:
                    this.data.forwardSlant = gamma < 0 ? 180 + gamma : gamma
                    break
            }
            this.data.backwardSlant = -this.data.forwardSlant
            this.data.isForward = this.data.forwardSlant > 0
            this.data.isBackward = !this.data.isForward
                // 记录初始的 向前倾斜度
            if (this.data.initForwardSlant === undefined) this.data.initForwardSlant = this.data.forwardSlant
            switch (this.data.orientation) {
                case 0:
                    this.data.forwardThreshold = this.data.initForwardSlant > 0 ? -180 + this.data.initForwardSlant : 180 + this.data.initForwardSlant
                    if (this.data.initForwardSlant > 0 && beta < this.data.forwardThreshold) {
                        this.data.relativeForwardSlant = beta + 360 - this.data.initForwardSlant
                    } else if (this.data.initForwardSlant < 0 && beta > this.data.forwardThreshold) {
                        this.data.relativeForwardSlant = beta - 180 - this.data.initForwardSlant
                    } else {
                        this.data.relativeForwardSlant = beta - this.data.initForwardSlant
                    }
                    break
                case 90:
                case -90:
                    // this.data.forwardThreshold
                    // 横屏时，只考虑向前倾斜度在 [0, 180] 的情况
                    this.data.relativeForwardSlant = this.data.forwardSlant - this.data.initForwardSlant
                    break
            }
            this.data.relativeBackwardSlant = -this.data.relativeForwardSlant
            this.data.isRelativeForward = this.data.relativeForwardSlant > 0
            this.data.isRelativeBackward = !this.data.isRelativeForward

            switch (this.data.orientation) {
                case 0:
                    this.data.leftSlant = -gamma
                    break
                case 90:
                    this.data.leftSlant = -beta
                    break
                case -90:
                    this.data.leftSlant = beta
                    break
            }
            this.data.rightSlant = -this.data.leftSlant
            this.data.isLeft = this.data.leftSlant > 0
            this.data.isRight = !this.data.leftSlant

            this.opts.onChange(assign(e, this.data))
        }

        this.handleOrientationChange = function (e) {
            this.data.orientation = window.orientation
            this.data.initForwardSlant = undefined
        }

    }

    Orientation.prototype.init = function () {
        // 防止重复监听
        if (this._isListeningOrientation) {
            window.removeEventListener('deviceorientation', this._handleDeviceOrientation, false)
            window.removeEventListener('orientationchange', this._handleOrientationChange, false)
        }
        this._isListeningOrientation = true
        this.data.initLeftRotate = undefined
        this.data.initForwardSlant = this.opts.initForwardSlant
        this._handleDeviceOrientation = this.handleDeviceOrientation.bind(this)
        this._handleOrientationChange = this.handleOrientationChange.bind(this)
        window.addEventListener('deviceorientation', this._handleDeviceOrientation, false)
        window.addEventListener('orientationchange', this._handleOrientationChange, false)
    }

    Orientation.prototype.destory = function () {
        this._isListeningOrientation = false
        window.removeEventListener('deviceorientation', this._handleDeviceOrientation, false)
        window.removeEventListener('orientationchange', this._handleOrientationChange, false)
    }

    return Orientation
}))
