import React, { Component } from 'react'

class ProgramProgress extends Component {
    constructor(props) {
        super(props)

        const { done, available, total } = this.props

        this.state = {
            done: total > 0 ? Math.round(done / total * 100) : 0,
            available: total > 0 ? Math.round(available / total * 100) : 0
        }
    }

    render() {
        const { done, available } = this.state
        const { title } = this.props

        return (
            <div className="progress">
                {title && (
                    <div className="progress__text">{title}</div>
                )}
                <div className="progress__scale">
                    <div
                        className="progress__done"
                        style={{
                            width: `${done}%`
                        }}
                    />
                    <div
                        className="progress__available"
                        style={{
                            width: `${available}%`
                        }}
                    />
                </div>
                <div className="progress__numbers">
                    <div className="progress__level progress__level_done">
                        {done}%
                    </div>
                    <div className="progress__level progress__level_available">
                        {available}%
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgramProgress