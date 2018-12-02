export default {
    indicatorDots: {
        type: Boolean,
        default: false
    },
    indicatorColor: {
        type: String,
        default: 'rgba(0,0,0,.3)'
    },
    indicatorActiveColor: {
        type: String,
        default: '#000000'
    },
    autoplay: {
        type: Boolean,
        default: false
    },
    current: {
        type: Number,
        default: 0
    },
    currentItemId: {
        type: String,
        default: ''
    },
    interval: {
        type: Number,
        default: 5000
    },
    duration: {
        type: Number,
        default: 500
    },
    circular: {
        type: Boolean,
        default: false
    },
    vertical: {
        type: Boolean,
        default: false
    },
    previousMargin: {
        type: Number,
        default: '0px'
    },
    nextMargin: {
        type: Number,
        default: '0px'
    },
    displayMultipleItems: {
        type: Number,
        default: 1,
        validator(val) {
            return val > 0
        }
    },
    skipHiddenItemLayout: {
        type: Boolean,
        default: false
    }
}
