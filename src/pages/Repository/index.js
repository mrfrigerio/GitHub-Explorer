/* eslint-disable no-plusplus */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Proptypes from 'prop-types'
import api from '../../services/api'

import { Loading, Owner, IssueList, Paginator } from './styles'
import Container from '../../components/container'

export default class Repository extends Component {
  constructor(props) {
    super(props)

    this.state = {
      repository: {},
      issues: [],
      stateFilter: 'open',
      page: 1,
      pages: null,
      loading: true
    }
  }

  async componentDidMount() {
    const { match } = this.props
    const { stateFilter, page } = this.state
    const repoName = decodeURIComponent(match.params.repository)

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: stateFilter,
          per_page: 5,
          page
        }
      })
    ])

    const links = issues.headers.link
    const pages = links
      .match(/&page=(\d+)/g)
      .map(p => Number.parseInt(p.split('=')[1], 10))

    const allPages = []
    for (let i = 1; i <= pages[1]; i++) {
      allPages.push(i)
    }
    this.setState({ page: pages[0] - 1, pages: allPages })

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false
    })
  }

  handlePagination = async e => {
    e.preventDefault()
    const setPage = Number.parseInt(e.target.value, 10)
    const { stateFilter, page } = this.state
    if (page !== setPage) {
      const { match } = this.props
      const repoName = decodeURIComponent(match.params.repository)

      const issues = await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: stateFilter,
          per_page: 5,
          page: setPage
        }
      })

      this.setState({
        issues: issues.data,
        page: setPage,
        loading: false
      })
    }
  }

  handleFilter = async e => {
    const setState = e.target.value

    const { match } = this.props
    const repoName = decodeURIComponent(match.params.repository)

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: setState,
        per_page: 5,
        page: 1
      }
    })

    const links = issues.headers.link
    const pages = links
      .match(/&page=(\d+)/g)
      .map(p => Number.parseInt(p.split('=')[1], 10))

    const allPages = []
    for (let i = 1; i <= pages[1]; i++) {
      allPages.push(i)
    }

    this.setState({
      issues: issues.data,
      stateFilter: setState,
      page: 1,
      pages: allPages,
      loading: false
    })
  }

  render() {
    const { repository, issues, loading, page, pages } = this.state

    if (loading) {
      return <Loading>Carregando</Loading>
    }

    return (
      <Container>
        <Link to="/">Voltar</Link>
        <Owner>
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
            title={repository.owner.login}
          />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          <form className="filter">
            <label htmlFor="open">
              open
              <input
                type="radio"
                name="state"
                value="open"
                id="open"
                defaultChecked
                onChange={this.handleFilter}
              />
            </label>
            <label htmlFor="closed">
              closed
              <input
                type="radio"
                name="state"
                value="closed"
                id="closed"
                onChange={this.handleFilter}
              />
            </label>
            <label htmlFor="all">
              all
              <input
                type="radio"
                name="state"
                value="all"
                id="all"
                onChange={this.handleFilter}
              />
            </label>
          </form>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {issue.title}
                  </a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Paginator>
          {pages.map((mapPage, index) => (
            <button
              type="button"
              key={mapPage}
              className={page === index + 1 ? 'atual' : ''}
              value={mapPage}
              onClick={this.handlePagination}
            >
              {mapPage}
            </button>
          ))}
        </Paginator>
      </Container>
    )
  }
}

Repository.propTypes = {
  match: Proptypes.shape({
    params: Proptypes.shape({
      repository: Proptypes.string
    })
  }).isRequired
}
