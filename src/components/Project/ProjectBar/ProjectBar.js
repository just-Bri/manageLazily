import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import dbServices from '../../../services/dbServices'
import dateConversions from '../../../services/dateConversions'
import { ProgressBar } from '../../ProgressBar/ProgressBar'
import ProjectForm from '../ProjectForm/ProjectForm'
import StyleIcon from '../../StyleIcon/StyleIcon'
import Swal from 'sweetalert2'
import './ProjectBar.css'

const ProjectBar = props => {
  const [edit, setEdit] = useState(false)

  const toggleEdit = () => {
    setEdit(!edit)
  }

  const approveProject = async () => {
    let proj = props.project
    proj.date_completed = dateConversions.dateToTimestamp(new Date())
    proj.alert = true
    await dbServices.updateProject(proj)
    props.updateProjInState(proj)
  }

  const autoComplete = () => {
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
        let proj = props.proj
        proj.autoComplete = true
        proj.alert = true
        proj.date_completed = dateConversions.dateToTimestamp(new Date())
        dbServices.updateProject(proj)
        props.updateProjInState(proj)
      }
    })
  }

  return (
    <div className="ProjectBar__project_container">
      <Link
        className="ProjectBar__link_wrapper"
        to={`/project/${props.proj.id}`}
        key={props.proj.id}
      >
        <div className="ProjectBar__header">
          <span className="ProjectBar__proj_name" test-id="project-link">
            {props.proj.name}
          </span>
          <span className="ProjectBar__proj_mgr">
            Manager: {props.proj.project_manager}
          </span>
        </div>
        <div className="ProjectBar__description">
          <span>Description:</span>
          <div className="ProjectBar__description_text">
            {props.proj.description}
          </div>
        </div>
        <div className="ProjectBar__proj_prog_date">
          {props.proj.date_completed ? (
            <p>
              Project Completed on{' '}
              {props.proj.date_completed &&
                dateConversions.TStoDisplayDate(props.proj.date_completed)}
            </p>
          ) : (
            <>
              <div className="ProjectBar__proj_prog">
                Est. Progress <ProgressBar percentage={props.proj.progress} />
              </div>
              <div className="ProjectBar__deadline">
                <div>
                  <span className="ProjectBar__deadline_first">Deadline:</span>
                  <span className="ProjectBar__deadline_second">
                    {dateConversions.TStoDisplayDate(props.proj.deadline)}
                  </span>
                </div>
                <span className="ProjectBar__overdue">
                  {props.proj.progress !== 100 &&
                    dateConversions.dateDiff(props.proj.deadline) &&
                    `Overdue by ${dateConversions.dateDiff(
                      props.proj.deadline
                    )} days`}
                </span>
              </div>
            </>
          )}
        </div>
      </Link>
      {props.role !== 'project worker' && (
        <div className="ProjectBar__buttons">
          {props.role === 'owner' && (
            <div className="ProjectBar__fa" onClick={toggleEdit}>
              {StyleIcon({ style: 'edit' })}
            </div>
          )}
          {props.proj.date_completed ? (
            <></>
          ) : (
            <div>
              {!props.proj.autoComplete && props.proj.progress !== 100 ? (
                <div className="ProjectBar__fa" onClick={autoComplete}>
                  {StyleIcon({ style: 'complete' })}
                </div>
              ) : (
                <div className="ProjectBar__fa" onClick={approveProject}>
                  {StyleIcon({ style: 'approve' })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {edit && (
        <ProjectForm
          org={props.proj.org_id}
          updateProjInState={props.updateProjInState}
          toggleForm={toggleEdit}
          proj={props.proj}
        />
      )}
    </div>
  )
}

export default ProjectBar
