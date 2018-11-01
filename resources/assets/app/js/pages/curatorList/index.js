import React from 'react'
// import Http from '../../Http'
// import { Link } from 'react-router-dom'
import HeaderContainer from "../../containers/HeaderContainer"

// class Page extends React.Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             threads: [],
//             loaded: false,
//             error: null
//         }
//     }

//     componentDidMount() {
//         this.loadDialogs()
//     }

//     loadDialogs() {
//         Http.get(`/api/curator/dialogs`)
//             .then(response => {
//                 this.setState({
//                     threads: response.data.threads,
//                     loaded: true
//                 })
//             })
//             .catch(({ response }) => {
//                 this.setState({
//                     loaded: true,
//                     error: response.data.message
//                 })
//             })
//     }

//     getContent() {
//         const { threads, loaded, error } = this.state

//         if (!loaded) {
//             return <div className="preloader preloader_absolute" />
//         }

//         if (error) {
//             return <div className="uk-alert-danger" dangerouslySetInnerHTML={{__html:error}} />
//         }

//         return (
//             <table className="uk-table uk-table-divider">
//                 <thead>
//                     <tr>
//                         <th>Программа</th>
//                         <th>Задание</th>
//                         <th>Пользователь</th>
//                         <th>Сообщений</th>
//                         <th />
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {Object.keys(threads).map(key => {
//                         const { thread, user, task, program, messages, unread } = threads[key]

//                         return (
//                             <tr key={key}>
//                                 <td>{program.name}</td>
//                                 <td>{task ? task.name : '-'}</td>
//                                 <td>
//                                     <Link to={`/users/${user.id}`}>
//                                         {user.firstname}{user.secondname && ` ${user.secondname}`}
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     {messages}{Boolean(unread) && ` (+${unread})`}
//                                 </td>
//                                 <td>
//                                     <Link to={`/curator/${thread}`} className="uk-button uk-button-default uk-button-small">
//                                         Смотреть переписку
//                                     </Link>
//                                 </td>
//                             </tr>
//                         )
//                     })}
//                 </tbody>
//             </table>
//         )
//     }

//     render() {
//         return (
//             <main className="page">
//                 <HeaderContainer />

//                 <div className="uk-container">
//                     {this.getContent()}
//                 </div>
//             </main>
//         )
//     }
// }

// export default Page

class Page extends React.Component {
  render() {
    return (
      <main className="page">
          <HeaderContainer />

          <div className="uk-container uk-margin-large">

          <div className="uk-grid-collapse" data-uk-grid>
            <div className="uk-width-auto@m">
              <ul className="uk-tab-left" data-uk-tab="connect: #component-tab-left; animation: uk-animation-fade">
                <li><a href="#">Знакомство с ЛКМ <span className="uk-badge">+5</span></a></li>
                <li><a href="#">Item</a></li>
                <li><a href="#">Item</a></li>
              </ul>
            </div>

            <div className="uk-width-expand@m">
              <ul className="uk-switcher uk-margin" id="component-tab-left">
                <li>
                  <table className="uk-table uk-table-small uk-table-hover uk-table-striped curator-table">
                    <tbody>
                      <tr>
                        <td width="100%"><a href="#">Пользователь</a></td>
                        <td>
                          <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                        </td>
                      </tr>
                      <tr>
                        <td width="100%"><a href="#">Пользователь</a></td>
                        <td>
                          <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                        </td>
                      </tr>
                      <tr>
                        <td width="100%"><a href="#">Пользователь</a></td>
                        <td>
                          <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                        </td>
                      </tr>
                      <tr>
                        <td width="100%"><a href="#">Пользователь</a></td>
                        <td>
                          <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
                <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
              </ul>
            </div>
          </div>

          <hr/>

          <ul data-uk-tab="connect: #component-tab-program; animation: uk-animation-fade">
            <li><a href="#">Задачи</a></li>
            <li><a href="#">Переписка программы</a></li>
          </ul>

          <ul className="uk-switcher uk-margin" id="component-tab-program">
            <li>
              <table className="uk-table uk-table-small uk-table-hover uk-table-divider curator-table">
                <tbody>
                  <tr>
                    <th colspan="2">Модуль</th>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Задача</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Задача</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Задача</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Пользователь</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <th colspan="2">Модуль</th>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Задача</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Задача</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Задача</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%"><a href="#">Пользователь</a></td>
                    <td>
                      <button className="uk-button uk-button-primary uk-button-small">Открыть</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
          </ul>
        </div>
      </main>
    )
  }
}

export default Page