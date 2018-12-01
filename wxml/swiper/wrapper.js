import Item from './swiper-item'

export default {
    name: 'wrapper',
    functional: true,
    props: {
        itemStyle: Object
    },
    render: function (createElement, context) {
        const {props, children = []} = context
        return createElement('div', context.data, children.map(({componentOptions}) => createElement(Item, {props}, componentOptions.children))
        )
    }
}
