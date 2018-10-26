import React from 'react'
import { Link } from 'react-router-dom'
import HeaderContainer from '../../containers/HeaderContainer'
import SvgIcon from '../../components/UI/SvgIcon'
import Head from '../../components/Head'

const Page = ({ user, current, logout }) => {
  const address = []
  if (user.city) address.push(user.city)
  if (user.country) address.push(user.country)

  return (
    <main className="page">
      <HeaderContainer />

      <div className="profile page">
        <Head title={`${user.name}`} />

        <div className="profile-info">
          <div className="profile-info__inner">
            <div className="profile-info__leftside">
              <div className="profile-info__avatar">
                <img  src={user.avatar} />
              </div>
              <div
                className="profile-info__name"
                dangerouslySetInnerHTML={{__html:user.name}}
              />
            </div>
            {current && (
              <div className="profile-info__rightside">
                <Link
                  className="profile-info__password"
                  to="/profile/edit"
                >
                  <SvgIcon
                    className="profile-info__password-icon"
                    name="lock"
                  />
                  Редактировать профиль
                </Link>
                <button
                  className="profile-info__logout"
                  type="button"
                  onClick={logout}
                >
                  <SvgIcon className="profile-info__logout-icon" name="logout" />
                  Выход
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="profile__contacts">
          <div className="profile-container">
            {Boolean(address.length) && (
              <div className="profile__contacts-row">
                <img className="profile__contacts-icon" src="/img/map-pin.svg" alt="" />
                <span className="profile__contacts-info">{address.join(', ')}</span>
              </div>
            )}
            {user.name && (
              <div className="profile__contacts-row">
                <img className="profile__contacts-icon" src="/img/bust.svg" alt="" />
                <span
                  className="profile__contacts-info"
                  dangerouslySetInnerHTML={{__html:user.name}}
                />
              </div>
            )}
            {user.email && (
              <div className="profile__contacts-row">
                <img className="profile__contacts-icon" src="/img/mail.svg" alt="" />
                <span
                  className="profile__contacts-info"
                  dangerouslySetInnerHTML={{__html:user.email}}
                />
                {(!user.email_public && current) && (
                  <span className="profile__visibility-warning">(Виден только Вам)</span>
                )}
              </div>
            )}
            {user.phone && (
              <div className="profile__contacts-row">
                <img className="profile__contacts-icon" src="/img/phone.svg" alt="" />
                <span
                  className="profile__contacts-info"
                  dangerouslySetInnerHTML={{__html:user.phone}}
                />
                {(!user.phone_public && current) && (
                  <span className="profile__visibility-warning">(Виден только Вам)</span>
                )}
              </div>
            )}
            {user.skype && (
              <div className="profile__contacts-row">
                <img className="profile__contacts-icon" src="/img/skype.svg" alt="" />
                <span
                  className="profile__contacts-info"
                  dangerouslySetInnerHTML={{__html:user.skype}}
                />
                {(!user.skype_public && current) && (
                  <span className="profile__visibility-warning">(Виден только Вам)</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="profile__company">
          <div className="profile-container">
            {/* <div className="profile__company-row">
              <img className="profile__company-icon" src="/img/house.svg" alt="" />
              <div className="profile__company-info">
                <div className="profile__company-field">
                  Компания
                </div>
                <div className="profile__company-text">
                  ABC Farben
                </div>
              </div>
            </div> */}
            {user.subdivision && (
              <div className="profile__company-row">
                <img className="profile__company-icon" src="/img/position.svg" alt="" />
                <div className="profile__company-info">
                  <div className="profile__company-field">
                    Подразделение
                  </div>
                  <div
                    className="profile__company-text"
                    dangerouslySetInnerHTML={{__html:user.subdivision}}
                  />
                </div>
              </div>
            )}
            {user.sphere && (
              <div className="profile__company-row">
                <img className="profile__company-icon" src="/img/field.svg" alt="" />
                <div className="profile__company-info">
                  <div className="profile__company-field">
                    Сфера деятельности
                  </div>
                  <div
                    className="profile__company-text"
                    dangerouslySetInnerHTML={{__html:user.sphere}}
                  />
                </div>
              </div>
            )}
            {user.about && (
              <div className="profile__company-row">
                <img className="profile__company-icon" src="/img/about.svg" alt="" />
                <div className="profile__company-info">
                  <div className="profile__company-field">
                    О себе
                  </div>
                  <div
                    className="profile__company-text"
                    dangerouslySetInnerHTML={{__html:user.about}}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page