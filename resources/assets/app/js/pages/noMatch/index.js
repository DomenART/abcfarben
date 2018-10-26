import React from 'react'
import { Link } from 'react-router-dom'

class Page extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return(
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}>
              <h1>Lost in space!</h1>
              <p>
                <Link to={`/`}>Programs</Link>
              </p>
            </div>
        )
    }
}

export default Page