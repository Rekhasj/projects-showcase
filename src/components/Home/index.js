import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    projectList: [],
    apiStatus: apiStatusConstants.initial,
    activeCategoryId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectList()
  }

  onChangeOption = event => {
    this.getProjectList()
    this.setState({activeCategoryId: event.target.value})
  }

  onClickRetry = () => {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    console.log(apiUrl)

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProjectList = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))

      this.setState({
        projectList: updatedProjectList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div
      className="products-loader-container"
      // testid="loader"
    >
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {projectList} = this.state
    return (
      <ul className="project-container">
        {projectList.map(eachProject => (
          <ProjectItem key={eachProject.id} eachProjectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, projectList} = this.state
    console.log(activeCategoryId)
    console.log(projectList)

    return (
      <div className="main-container">
        <div className="header-container">
          <img
            alt="website logo"
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </div>
        <div className="select-container">
          <select
            className="select-card"
            value={activeCategoryId}
            onChange={this.onChangeOption}
          >
            {categoriesList.map(eachList => (
              <option value={eachList.id} key={eachList.id}>
                {eachList.displayText}
              </option>
            ))}
          </select>
          {this.renderAllProducts()}
        </div>
      </div>
    )
  }
}

export default Home
