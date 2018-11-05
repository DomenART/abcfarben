import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import SvgIcon from './UI/SvgIcon'
import HeaderNotifications from './HeaderNotifications'

const Header = ({ roles = [], id, name, avatar }) =>
  <header className="main-header">
    <div className="main-header__leftside">
      <Link to="/" className="main-header__logo">
        <img className="main-header__logo-img" src="/img/logo.png" alt="" />
        <div className="main-header__logo-title">
          Электронная Академия<br />
          ABC Farben
        </div>
      </Link>
    </div>

    <div className="main-header__rightside">
      <div>
        <Link to="/" className="main-header__programs">« Список учебных программ</Link>
        {/*<button className="main-header__help" type="button" data-uk-toggle="target: #help">
          <SvgIcon name="help" className="main-header__help-icon" />
        </button>*/}
        {/*<div id="help" data-uk-modal>
          <div className="help uk-modal-dialog uk-modal-body">
            <button className="help__close uk-modal-close" type="button" data-uk-close />
            <ul className="help__nav" data-uk-switcher="connect: .help__content;">
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
            </ul>
            <ul className="uk-switcher help__content">
              <li>
                <div className="help__image-area">
                  <img className="help__image" src="../img/help-image.jpg" alt="" />
                </div>
                <div className="help__desc-area">
                  <div className="help__desc-title">
                    Шаг 6 - Вопросы эксперту
                  </div>
                  <div className="help__desc-text">
                    Вы можете задать вопрос эксперту на открытой сессии “вопрос-ответ”
                    в соответствующем разделе.
                  </div>
                  <button className="help__desc-further" type="button">Дальше</button>
                  <button className="help__desc-end uk-modal-close" type="button">Мне всё понятно</button>
                </div>
              </li>
              <li>
                <div className="help__image-area">
                  <img className="help__image" src="../img/help-image.jpg" alt="" />
                </div>
                <div className="help__desc-area">
                  <div className="help__desc-title">
                    Шаг 3 - Помощь эксперту
                  </div>
                  <div className="help__desc-text">
                    Вы можете задать вопрос эксперту на открытой сессии “вопрос-ответ”
                    в соответствующем разделе.
                  </div>
                  <button className="help__desc-further" type="button">Дальше</button>
                  <button className="help__desc-end uk-modal-close" type="button">Мне всё понятно</button>
                </div>
              </li>
              <li>
                <div className="help__image-area">
                  <img className="help__image" src="../img/help-image.jpg" alt="" />
                </div>
                <div className="help__desc-area">
                  <div className="help__desc-title">
                    Шаг 1 - Помощь мне
                  </div>
                  <div className="help__desc-text">
                    Вы можете задать вопрос эксперту на открытой сессии “вопрос-ответ”
                    в соответствующем разделе.
                  </div>
                  <button className="help__desc-further" type="button">Дальше</button>
                  <button className="help__desc-end uk-modal-close" type="button">Мне всё понятно</button>
                </div>
              </li>
            </ul>
          </div>
        </div>*/}

        <HeaderNotifications />

        {roles && !!roles.filter(role => role.slug === 'curator').length && (
          <Link to="/curator" className="main-header__notification-btn notification-btn">
            <SvgIcon name="lock" className="notification-btn__icon" />
            Куратор
          </Link>
        )}

        {roles && !!roles.filter(role => role.slug === 'expert').length && (
          <Link to="/expert" className="main-header__notification-btn notification-btn">
            <SvgIcon name="lock" className="notification-btn__icon" />
            Эксперт
          </Link>
        )}
      </div>

      <div>
        <Link
          to={`/users/${id}`}
          className="main-header__user"
        >
          {name}
          <img className="main-header__user-avatar" src={avatar} alt="" />
        </Link>
      </div>
    </div>
  </header>

export default Header