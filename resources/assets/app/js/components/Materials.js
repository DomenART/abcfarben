import React, { Fragment } from 'react'
import SvgIcon from './UI/SvgIcon'
import getIconName from '../utils/getIconName'

export default ({ title = 'Материалы к заданию:', files = [] }) =>
  <Fragment>
    {!!files && (
      <div className="practice__materials materials">
        <div className="materials__heading">{title}</div>
        <ul className="materials__list">
          {files.map((file, key) => (
            <li key={key}>
              <a className="materials__item" href={`/storage/admin/${file}`} target="_blank">
                <SvgIcon name={getIconName(file)} className="materials__icon" />
                {file.replace(/^.*[\\\/]/, '')}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </Fragment>