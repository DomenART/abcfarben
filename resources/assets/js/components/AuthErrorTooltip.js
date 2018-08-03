import React, { Component } from 'react'
import classNames from 'classnames'

class AuthErrorTooltip extends Component {
    constructor(props) {
        super(props)

        this.state = {
            shown: true
        }

        this.timer = null

        this.handlerMouseLeave = this.handlerMouseLeave.bind(this)
        this.handlerMouseEnter = this.handlerMouseEnter.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
    }

    componentDidMount() {
        this.timer = setTimeout(this.hide, 2000)
    }

    handlerMouseLeave() {
        clearInterval(this.timer)

        this.timer = setTimeout(this.hide, 400)
    }

    handlerMouseEnter() {
        clearInterval(this.timer)

        this.timer = setTimeout(this.show, 200)
    }

    show() {
        this.setState({ shown: true })
    }

    hide() {
        this.setState({ shown: false })
    }

    render() {
        const { title } = this.props

        return (
            <div
                style={this.props.style}
                className="info-danger"
                onMouseEnter={this.handlerMouseEnter}
                onMouseLeave={this.handlerMouseLeave}
            >
                <span
                    dangerouslySetInnerHTML={{__html: title}}
                    className={classNames('info-danger__tooltip', {
                        'info-danger__tooltip_shown':  this.state.shown
                    })}
                />
            </div>
        )
    }
}

export default AuthErrorTooltip