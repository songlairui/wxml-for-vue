/**
 * 全局注册小程序标签组件
 */
import Block from './block'
import Swiper from './swiper'
import SwiperItem from './swiper/swiper-item'

const components = [
    Block,
    Swiper,
    SwiperItem
]

export default {
    install(Vue) {
        components.forEach(component =>
            Vue.component(component.name.replace(/^paas/i, ''), component)
        )
    },
    components
}
