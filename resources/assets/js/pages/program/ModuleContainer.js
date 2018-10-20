import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { catchErrorsNotification } from '../../utils/graphql'
import Module from './Module'

class ModuleContainer extends Component {
  read() {
    const {
      program, readModule, match, history,
      data: { modules: [module] }
    } = this.props

    readModule({
      variables: {
        module_id: match.params.module
      }
    })
    .then(() => {
      if (module.next_module_id) {
        history.push(`/programs/${program.id}/${module.next_module_id}`)
      }
    })
    .catch(catchErrorsNotification)
  }

  render() {
    const {
      program,
      data: { loading, error, modules }
    } = this.props

    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    if (modules.length === 0)
      return <div className="uk-alert-danger" data-uk-alert>Запись не найдена</div>

    const module = modules[0]

    return (
      <Module
        {...{module, program}}
        readHandler={this.read.bind(this)}
      />
    )
  }
}

const query = gql`
query Module(
  $module_id: Int!
  $program_id: Int!
) {
  modules(id: $module_id) {
    id
    name
    content
    status
    opened(program: $program_id)
    next_module_id(program: $program_id)
    next_task_id
    has_access
    tasks {
      id
      name
      status
    }
  }
}
`
const readModuleMutation = gql`
  mutation ReadModule($module_id: Int!) {
    readModule(module_id: $module_id) {
      id
      status
    }
  }
`
export default compose(
  graphql(query, {
    options: ({ match: { params }, program }) => ({
      fetchPolicy: "network-only",
      variables: {
        module_id: params.module,
        program_id: program.id
      }
    })
  }),
  graphql(readModuleMutation, { name: 'readModule' })
)(withRouter(ModuleContainer))