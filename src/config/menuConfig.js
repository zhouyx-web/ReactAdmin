import {
    HomeOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    ToolOutlined,
    UserOutlined,
    SafetyOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
    FormOutlined
} from '@ant-design/icons'

const menuConfig = [
    {
        title: '首页',
        icon: <HomeOutlined />,
        path: '/home',
        isPublic: true,
    },
    {
        title: '商品',
        icon: <AppstoreOutlined />,
        path: '/products',
        children: [
            {
                title: '品类管理',
                icon: <UnorderedListOutlined />,
                path: '/category'
            },
            {
                title: '商品管理',
                icon: <ToolOutlined />,
                path: '/product'
            },
        ]
    },
    {
        title: '用户管理',
        icon: <UserOutlined />,
        path: '/user'
    },
    {
        title: '角色管理',
        icon: <SafetyOutlined />,
        path: '/role'
    },
    {
        title: '图形图表',
        icon: <AreaChartOutlined />,
        path: '/charts',
        children: [
            {
                title: '柱形图',
                icon: <BarChartOutlined />,
                path: '/charts/bar',
            },
            {
                title: '折线图',
                icon: <LineChartOutlined />,
                path: '/charts/line',
            },
            {
                title: '饼图',
                icon: <PieChartOutlined />,
                path: '/charts/pie',
            },
        ]
    },
    {
        title: '订单管理',
        icon: <FormOutlined />,
        path: '/order'
    },
]

export default menuConfig