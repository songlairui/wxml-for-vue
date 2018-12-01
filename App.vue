<template>
    <div id="app">
        <p class="red">
            {{hi}}
        </p>
        <pre>参考链接: <a
                href="https://github.com/NervJS/taro/blob/master/packages/taro-components/src/components/swiper/index.js">https://github.com/NervJS/taro/blob/master/packages/taro-components/src/components/swiper/index.js</a>
        </pre>
        <hr>
        <div class="stage">
            <swiper
                    :indicatorDots="indicatorDots" :autoplay="autoplay" :circular="circular" :vertical="vertical"
                    :interval="interval" :duration="duration" :previousMargin="previousMargin" :nextMargin="nextMargin">
                <swiper-item v-for="(item, idx) in background" :key="idx">
                    {{item}}
                </swiper-item>
            </swiper>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'App',
        data() {
            return {
                hi: 'swiper组件',
                background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
                indicatorDots: true,
                vertical: false,
                autoplay: false,
                circular: false,
                interval: 2000,
                duration: 500,
                previousMargin: 0,
                nextMargin: 0
            }
        },
        methods: {
            insertViewport() {
                let meta = document.querySelectorAll('meta[name=viewport]')
                if (!meta[0]) {
                    meta = document.createElement('meta')
                    meta.id = 'viewport'
                    meta.name = 'viewport'
                    meta.content =
                        'width=320, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                    document.querySelector('head').appendChild(meta)
                }
            }
        },
        mounted() {
            this.insertViewport()
        }
    }
</script>
<style lang='less'>
    #app {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 100%;

        > * {
            word-break: break-all;
        }
    }

    pre {
        max-width: 100%;
        white-space: pre-line;
    }

    .stage {
        width: 375px;
        box-shadow: 0 0 10px -4px;
        min-height: 400px;
    }
</style>

