import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumbs = ({ items }) =>
    <ul className="breadcrumb uk-breadcrumb">
        {items.map(({ uri, title }, i) =>
            <li key={i}>
                {uri ? (
                    <Link to={uri} dangerouslySetInnerHTML={{__html:title}} />
                ) : (
                    <span dangerouslySetInnerHTML={{__html:title}} />
                )}
            </li>
        )}
    </ul>

export default Breadcrumbs