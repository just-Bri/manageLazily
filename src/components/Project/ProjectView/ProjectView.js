import React, { Component } from 'react'
import { ProgressBar } from '../../ProgressBar/ProgressBar'
import './ProjectView.css'
import Loading from '../../Loading/Loading'
import { AuthContext } from '../../../services/Auth.js'
import Jobs from '../Jobs/Jobs'
import Statistics from '../../Statistics/Statistics'
import Sidebar from '../../Sidebar/Sidebar'
import JobForm from '../JobForm/JobForm'
import dbServices from '../../../services/dbServices'
import dateConversions from '../../../services/dateConversions'
import Swal from 'sweetalert2'
import StyleIcon from '../../StyleIcon/StyleIcon'
import { CatchAll } from '../../CatchAll/CatchAll'
import ProjectBar from '../../Project/ProjectBar/ProjectBar'

export default class ProjectView extends Component {
  constructor(props) {
    super(props)
    this.unsubscribe = null
    this.state = {
      project: null,
      showJobForm: false,
      loading: true,
      toggleState: false,
      progress: 0,
      total: 0,
      error: null,
      expandStats: true,
      expandJobs: true,
      expandPersonnel: true,
    }
  }

  static contextType = AuthContext

  updateProject = data => {
    this.setState({
      project: data,
      loading: false,
    })
  }

  getProgress = (jobProg, jobTotal, job) => {
    let currentProgress = 0
    let currentTotal = 0
    let newProject = this.state.project

    currentProgress = currentProgress + jobProg
    currentTotal = currentTotal + jobTotal
    if (currentProgress === 0) {
      this.setState({
        progress: 0,
      })
    } else {
      this.setState({
        progress: parseInt(currentProgress),
        total: currentTotal,
      })

      newProject.progress = parseInt(
        ((currentProgress / currentTotal) * 100).toFixed(2)
      )
      dbServices.updateProject(newProject)
      this.setState({
        project: newProject,
      })
    }
  }

  async componentDidMount() {
    try {
      this.unsubscribe = dbServices
        .projectsListener(this.context.currentUser.org, this.props.id)
        .onSnapshot(doc => {
          this.updateProject(doc.data())
        })
    } catch (error) {
      this.setState({
        error: 'Error',
      })
      console.warn(error)
      Swal.fire({
        title: 'Error!',
        text:
          "There was an issue loading this project's information - please refresh the page and try again.",
        icon: 'error',
        confirmButtonText: 'Close',
      })
    }
  }

  autoComplete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text:
        'By clicking the button below, you will automatically mark this project as complete along with any unfinished tasks.',
      icon: 'question',
      confirmButtonText: "I'm sure!",
      showCancelButton: true,
    }).then(value => {
      console.log(value)
      if (value.dismiss === 'cancel') return null
      else {
        let proj = this.state.project
        proj.autoComplete = true
        proj.alert = true
        proj.date_completed = dateConversions.dateToTimestamp(new Date())
        dbServices.updateProject(proj)
      }
    })
  }

  approveProject = async () => {
    let proj = this.state.project
    proj.date_completed = dateConversions.dateToTimestamp(new Date())
    proj.alert = true
    await dbServices.updateProject(proj)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  showJobForm = e => {
    e.stopPropagation()
    if (this.state.showJobForm)
      this.setState({ showJobForm: false, expandJobs: true })
    else
      this.setState({
        showJobForm: true,
        expandJobs: false,
      })
  }

  expandStats = () => {
    this.setState({
      expandStats: !this.state.expandStats,
    })
  }

  expandJobs = () => {
    this.setState({
      expandJobs: !this.state.expandJobs,
    })
  }

  toggleExpandPersonnel = e => {
    e.stopPropagation()
    this.setState({ expandPersonnel: !this.state.expandPersonnel })
  }

  render() {
    const { project, showJobForm } = this.state
    const user = this.context.currentUser

    if (this.state.loading && !this.state.error) {
      return <Loading />
    } else if (this.state.error) {
      return <h2>Project was unable to load</h2>
    } else {
      return (
        <section>
          <div test-id="projectContainer" test-data={project.id}>
            <header className="App__org_header">
              <h2 id="companyName">{this.context.currentUser.org}</h2>
              <span id="currentDate">{new Date().toDateString()}</span>
            </header>
            <div className="projectbar_container App__separate_bottom">
              <ProjectBar
                proj={project}
                role={this.context.currentUser.role}
                // projectManagers={this.state.projectManagers}
                // updatePM={this.updatePM}
                // updateProjInState={this.updateProjInState}
              />
            </div>
          </div>
          <div id="projectView_main">
            <div className="ProjectView__jobs_stats">
              {user.role === 'project worker' ? (
                <></>
              ) : (
                <div className="ProjectView__stats">
                  <div
                    className="App__section_header"
                    onClick={() => this.expandStats()}
                  >
                    <div className="App__fa_h1">
                      {StyleIcon({
                        style: `${this.state.expandStats ? 'minus' : 'plus'}`,
                      })}
                      <h3>Statistics</h3>
                    </div>
                  </div>
                  {this.state.expandStats && (
                    <div className="ProjectView__stats_container">
                      <Statistics {...this.props} />
                    </div>
                  )}
                </div>
              )}
              <div
                className="App__section_header App__separate_top_always"
                onClick={() => this.expandJobs()}
              >
                <div className="App__fa_h1">
                  {' '}
                  {StyleIcon({
                    style: `${this.state.expandJobs ? 'minus' : 'plus'}`,
                  })}
                  {user.role === 'project worker' ? (
                    <h3>Your Tasks</h3>
                  ) : (
                    <h3>Tasks</h3>
                  )}
                </div>

                {user.role === 'project worker' ? (
                  ''
                ) : (
                  <button
                    className="ProjectView__add"
                    onClick={this.showJobForm}
                    test-id="add-task"
                  >
                    Add Task
                  </button>
                )}
              </div>
              {showJobForm && (
                <JobForm
                  {...this.props}
                  setJob={this.setJob}
                  project={project}
                  showJobForm={this.showJobForm}
                  projectId={this.props.id}
                />
              )}
              {this.state.expandJobs && (
                <Jobs
                  projectId={this.props.id}
                  getProgress={this.getProgress}
                />
              )}
            </div>

            <section className="App__personnel App__separate_top App__separate_bottom">
              <div
                className="App__section_header App__separate_top"
                onClick={this.toggleExpandPersonnel}
              >
                <div className="App__fa_h1">
                  {StyleIcon({
                    style: `${this.state.expandPersonnel ? 'minus' : 'plus'}`,
                  })}
                  <h1>Personnel</h1>
                </div>
              </div>
              {this.state.expandPersonnel && (
                <Sidebar view="project" project={this.state.project} />
              )}
            </section>
          </div>
        </section>
      )
    }
  }
}
