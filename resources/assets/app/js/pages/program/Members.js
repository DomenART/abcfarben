import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from "classnames"
import { Link } from 'react-router-dom'
import Breadcrumbs from "../../components/Breadcrumbs"
import SvgIcon from "../../components/UI/SvgIcon"
import ProgramProgress from '../../components/Program/ProgramProgress'
import Head from "../../components/Head"

const query = gql`
query Members(
  $search: String,
  $program: Int
) {
  users(
    search: $search,
    program: $program,
  ) {
    id
    avatar
    city
    country
    name
    sphere
    subdivision
    progress {
      done
      available
      total
    }
    positions {
      name
    }
  }
  currentUser {
    id
  }
}
`

class Members extends React.Component {
  state = {
    search: ''
  }

  handlerSearch(event) {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { program } = this.props
    const { search } = this.state

    return (
      <main className="participants">
        <Breadcrumbs
          items={[{
            uri: `/programs/${program.id}`,
            title: program.name
          }, {
            title: 'Участники'
          }]}
        />

        <Head title={`Участники - ${program.name}`} />

        <div className="participants__heading">
          <h1 className="participants__page-title page-title">
            <SvgIcon
              className="page-title__icon page-title__icon_participants"
              name="user"
            />
            Участники
          </h1>

          <div className="search-form">
            <input
              className="search-form__input uk-search"
              type="search"
              title="Поле поиска учстников"
              placeholder="ПОИСК УЧАСТНИКА"
              value={search}
              onChange={e => this.handlerSearch(e)}
            />
            <button className="search-form__submit" type="submit">
              <SvgIcon
                className="search-form__submit-icon"
                name="search"
              />
            </button>
          </div>
        </div>

        <Query
          query={query}
          variables={{
            program: program.id,
            search
          }}
        >
          {({ loading, error, data: { users, currentUser } }) => {
            if (loading)
              return <div className="preloader preloader_absolute" />

            if (error)
              return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

            return (
              <div className="uk-overflow-auto uk-position-relative">
                <table className="participants-table uk-table">
                  <thead>
                    <tr>
                      <th>
                        Имя участника
                      </th>
                      <th>
                        Страна
                      </th>
                      <th>
                        Город
                      </th>
                      <th>
                        Сфера деятельности
                      </th>
                      <th>
                        Подразделение
                      </th>
                      <th>
                        Должность
                      </th>
                      <th>
                        Прогресс
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(({
                      id, avatar, city, country, name, positions, progress, sphere, subdivision
                    }) => (
                      <tr key={id} className={classNames({'current':id === currentUser.id})}>
                        <td>
                          <Link to={`/users/${id}`}>
                            <img className="participants-table__avatar" src={avatar} alt="" />
                            {name}
                          </Link>
                        </td>
                        <td>{country}</td>
                        <td>{city}</td>
                        <td>{sphere}</td>
                        <td>{subdivision}</td>
                        <td>{positions.map(({name}) => name).join(', ')}</td>
                        <td>
                          <ProgramProgress {...progress} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {program.membersFetching && <div className="preloader preloader_absolute" />}
              </div>
            )
          }}
        </Query>
      </main>
    )
  }
}

export default Members