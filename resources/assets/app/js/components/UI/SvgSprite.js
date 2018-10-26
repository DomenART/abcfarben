import React, { Component } from 'react'

class Sprite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            html: ''
        }
        this.container = React.createRef()
    }

    componentDidMount() {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', '/img/sprite.svg')
        xhr.onload = () => {
            this.setState({
                html: xhr.responseText
            })
        }
        xhr.send()
    }

    render() {
        return (
            <div
                dangerouslySetInnerHTML={{__html: this.state.html}}
                style={{display: 'none'}}
                ref={this.container}
            />
        )
    }
}

export default Sprite