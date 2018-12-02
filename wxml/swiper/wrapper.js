import Item from './swiper-item'

export default {
    name: 'wrapper',
    functional: true,
    props: {
        itemStyle: Object
    },
    render: function (createElement, context) {
        const {props, data, listeners} = context
        const slots = context.slots()
        const children = (slots.default || []).map(({componentOptions = {}}) => [componentOptions.children, componentOptions.propsData])
        const count = children.length
        listeners.count && listeners.count(count)

        if (data.attrs.circular) {
            const first = [...children[0]]
            const last = [...children[children.length - 1]]
            first[1] = 'prepend'
            last[1] = 'append'
            children.push(first)
            children.unshift(last)
        }
        return createElement('div', context.data, children.map(([opt, propsData]) => createElement(Item, {
            props: {...propsData, ...props}
        }, opt)))
    }
}
