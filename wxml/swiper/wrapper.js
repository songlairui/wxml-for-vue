import Item from './swiper-item'

export default {
    name: 'wrapper',
    functional: true,
    props: {
        itemStyle: Object
    },
    render: function (createElement, context) {
        const { props, data, listeners } = context
        const slots = context.slots()
        const children = (slots.default || []).map(({ data: childData = {}, componentOptions = {} }) => [childData, componentOptions.children, componentOptions.propsData])
        const count = children.length
        listeners.count && listeners.count(count)
        const col = data.attrs.displayMultipleItems || 1

        if (data.attrs.circular && count > col) {
            const first = [...children[0]]
            const last = [...children[children.length - 1]]
            first[3] = { key: 'append' }
            last[3] = { key: 'prepend' }
            children.push(first)
            children.unshift(last)
        }

        return createElement('div', context.data, children.map(([childData, opt, propsData, other]) => createElement(Item, {
            ...childData,
            ...other,
            props: { ...propsData, ...props }
        }, opt)))
    }
}
