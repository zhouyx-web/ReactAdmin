/* 
自定义实现react-redux库
向外暴露两个函数：
    1.Provider组件，用于使用context提供一个store对象
    2.connect函数，用于从Provider组件取出store对象中的state/actionCreactor传递给UI组件
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const MyContext = React.createContext('@init')
export class Provider extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired
    }
    render() {
        return (
            <MyContext.Provider value={this.props.store}>
                {this.props.children}
            </MyContext.Provider>
        )
    }

}


export function connect(mapStateToProps, mapDispatchToProps) {

    // 返回一个高阶组件wrapperComponent，这个高阶组件接收一个UI组件返回一个匿名容器组件
    return function wrapperComponent (UIComponent){
        return class extends Component {
            static contextType = MyContext
            constructor(props) {
                super(props)
                this.state = {}
            }
            componentDidMount(){
                const store = this.context
                store.subscribe(() => this.setState({}))
            }
            render() {
                const store = this.context
                // debugger
                const objProps = mapStateToProps(store.getState())
                let funcProps
                if (typeof mapDispatchToProps === 'object') {
                    funcProps = Object.keys(mapDispatchToProps).reduce((totalFuncProps, key) => {
                        totalFuncProps[key] = (...args) => store.dispatch(mapDispatchToProps[key](...args))
                        return totalFuncProps
                    }, {})
                } else {
                    funcProps = mapDispatchToProps(store.dispatch)
                }
                return (
                    <UIComponent {...objProps} {...funcProps} />
                )
            }
        }
    }
}