import React from 'react'
import Breadcrumbs from "../../components/Breadcrumbs"
import Head from "../../components/Head"
import SvgIcon from "../../components/UI/SvgIcon"

export default ({ letters, list, program }) =>
  <main className="wiki">
    <Breadcrumbs
      items={[{
        uri: `/programs/${program.id}`,
        title: program.name
      }, {
        title: 'Wiki'
      }]}
    />

    <Head title={`Wiki - ${program.name}`} />

    <h1 className="wiki__page-title page-title">
      <SvgIcon
        className="page-title__icon page-title__icon_wiki"
        name="doc"
      />
      Wiki
    </h1>

    <ul className="wiki-letters uk-pagination uk-flex-center">
      {letters.map(letter => (
        <li key={letter}>
          <a href={`#${letter}`}>{letter}</a>
        </li>
      ))}
    </ul>

    {list.map(({ letter, items }) => (
      <div
        className="wiki-group uk-margin-medium"
        id={letter}
        key={letter}
      >
        <h4>{letter}</h4>
        <div className="uk-grid">
          {items.map(item => (
            <div
              className="uk-width-1-3"
              key={item.id}
            >
              <button
                data-uk-toggle={`target: .modal-question-${item.id}`}
                className="uk-button uk-button-link"
              >{item.title}</button>

              <div className={`modal-question-${item.id}`} data-uk-modal>
                <div className="uk-modal-dialog">
                  <button
                    className="uk-modal-close-default"
                    data-uk-close
                  />
                  <div className="uk-modal-header">
                    <h2 className="uk-modal-title">{item.title}</h2>
                  </div>
                  <div
                    className="uk-modal-body"
                    dangerouslySetInnerHTML={{__html:item.content}}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* <div className="uk-position-relative">
      <ul className="questions">
        {questions.map(row => (
          <li id={`questions-${row.id}`} className="questions-item" key={row.id}>
            <div
              className="questions-item__headline"
              data-uk-toggle={`target: #questions-${row.id}; cls: questions-item_isOpened`}
            >
              <span className="questions-item__pic">
                <SvgIcon
                  className="questions-item__icon"
                  name="folder"
                />
              </span>
              <span
                className="questions-item__title"
                dangerouslySetInnerHTML={{__html:row.title}}
              />

              <button
                className="questions-item__control"
                type="button"
              />
            </div>

            <div
              dangerouslySetInnerHTML={{__html:row.content}}
              className="questions-item__text"
            />
          </li>
        ))}
      </ul>
    </div> */}
  </main>