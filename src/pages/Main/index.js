import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Container from '../../components/container'
import { Form, SubmitButton, List, Error } from './styles'

class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newRepo: '',
      repositories: [],
      loading: false,
      error: false,
      errorMessage: ''
    }
  }

  async componentDidMount() {
    const repos = await localStorage.getItem('repos')
    if (repos) {
      this.setState({ repositories: JSON.parse(repos) })
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state

    if (prevState.repositorie !== repositories) {
      localStorage.setItem('repos', JSON.stringify(repositories))
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()
    const errormsg = document.getElementById('errormsg')
    const timebar = document.getElementById('timebar')
    const input = document.getElementById('input')
    const { newRepo, repositories } = this.state
    this.setState({ loading: true })

    try {
      errormsg.classList.remove('error')
      timebar.classList.remove('error')
      input.classList.remove('error')
      const response = await api.get(`/repos/${newRepo}`)
      const data = {
        name: response.data.full_name
      }

      if (repositories.find(repo => repo.name === data.name)) {
        throw new Error()
      }

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        error: false,
        errorMessage: ''
      })
    } catch (error) {
      errormsg.classList.add('error')
      timebar.classList.add('error')
      input.classList.add('error')
      this.setState({
        loading: false,
        error: true,
        errorMessage: error.message.startsWith('Request')
          ? 'Repositório inválido'
          : 'Repositório já carregado'
      })
    }
  }

  render() {
    const { newRepo, loading, repositories, error, errorMessage } = this.state
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Error id="errormsg">
          {errorMessage}
          <div id="timebar" />
        </Error>
        <Form onSubmit={e => this.handleSubmit(e)} error={error}>
          <input
            id="input"
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    )
  }
}

export default Main
