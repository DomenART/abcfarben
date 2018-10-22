import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Wiki from './Wiki'

class WikiContainer extends Component {
  unique(arr) {
    const obj = {}

    for (let i = 0; i < arr.length; i++) {
      const str = arr[i]
      obj[str] = true
    }

    return Object.keys(obj)
  }

  getLetters(questions) {
    const list = questions.map(question => question.title[0].toUpperCase()).sort()
    return this.unique(list)
  }

  getLlist(questions) {
    const letters = this.getLetters(questions)
    const list = []

    letters.forEach(letter => {
      list.push({
        letter,
        items: questions.filter(question => question.title[0].toUpperCase() === letter)
      })
    })
    return list
  }

  render() {
    const {
      program,
      data: { loading, error, questions }
    } = this.props

    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    return (
      <Wiki
        program={program}
        letters={this.getLetters(questions)}
        list={this.getLlist(questions)}
      />
    )
  }
}

const query = gql`
  query Questions {
    questions {
      id
      title
      content
    }
  }
`
export default graphql(query)(WikiContainer)