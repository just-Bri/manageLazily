import React, { useContext, useState } from 'react'
import Dropdown from '../../Dropdown/Dropdown'
import { Input, Label, Textarea } from '../../Form/Form'
import dbServices from '../../../services/dbServices'
import { AuthContext } from '../../../services/Auth'
import useFormValidation from '../../../hooks/useFormValidation'
import validateInput from '../../../hooks/validateInput'
import './JobForm.css'
import dateConversions from '../../../services/dateConversions'
import Swal from 'sweetalert2'

const NewJob = props => {
  const [selected, setSelected] = useState(0)

  const { currentUser } = useContext(AuthContext)

  const getEmployees = () => {
    if (props.job) {
      let workers = []
      props.job.project_workers.forEach(worker =>
        workers.push({ value: worker, label: worker })
      )
      return workers
    }
  }

  const INITIAL_STATE = {
    name: props.job ? props.job.name : '',
    description: props.job ? props.job.description : '',
    deadline: props.job ? dateConversions.TStoFormDate(props.job.deadline) : '',
    total_hours: props.job ? props.job.total_hours : '',
  }

  const handleSubmitForm = async e => {
    const { name, description, total_hours, deadline } = values
    let employees = props.job
      ? [props.job.project_manager]
      : [props.project.project_manager]
    if (selected)
      selected.map(itm => {
        if (itm.value !== employees[0]) {
          employees.push(itm.value)
        }
      })

    let projectId = props.job ? props.job.project_id : props.projectId
    let projectManager = props.job
      ? props.job.project_manager
      : props.project.project_manager
    let id = props.job ? props.job.id : null
    let approval = props.job ? props.job.approval : false
    let date_created = props.job ? props.job.date_created : new Date()
    let hours_completed = props.job ? props.job.hours_completed : 0
    let status = 'in progress'
    let edit = null
    let alert = []
    let employee_hours = props.job
      ? props.job.employee_hours
      : [{ name: props.project.project_manager, hours: 0 }]

    if (props.job) {
      if (props.job.status === 'edit request') status = 'in progress'
      else status = props.job.status

      employees.map(employee => {
        if (!props.job.project_workers.includes(employee))
          return alert.push(employee)
        else return null
      })

      employees.forEach(employee => {
        let hoursObj = props.job.employee_hours.find(
          ({ name }) => name === employee
        )
        if (!hoursObj) {
          return employee_hours.push({ name: employee, hours: 0 })
        } else return null
      })
    } else {
      employees.map(employee => {
        return alert.push(employee)
      })

      employees.forEach(emp => {
        if (emp !== props.project.project_manager) {
          employee_hours.push({ name: emp, hours: 0 })
        }
      })
    }

    const jobObj = {
      approval,
      date_created,
      deadline: dateConversions.dateToTimestamp(new Date(deadline)),
      description,
      name,
      organization: currentUser.org,
      total_hours,
      hours_completed,
      project_id: projectId,
      project_manager: projectManager,
      project_workers: employees,
      status,
      id,
      edit,
      alert,
      employee_hours,
    }
    console.log(jobObj)
    if (props.job) {
      try {
        console.log(jobObj)
        await dbServices.editJob(id, jobObj)
      } catch (error) {
        console.warn(error)
        Swal.fire({
          title: 'Error!',
          text:
            'There was an issue editing this task - please refresh the page and try again. 1',
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }
    } else {
      try {
        await dbServices.addJob(jobObj, projectId)
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue - please refresh the page and try again. 2',
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }
    }

    let updatedProjectWorkers = null

    if (props.job) {
      let projects = []
      try {
        await dbServices
          .getProjectById(props.job.project_id, currentUser.org)
          .then(project => projects.push(project.data()))
      } catch (error) {
        console.warn(error)
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }
      let project = projects[0]
      updatedProjectWorkers = project.project_workers
    } else {
      updatedProjectWorkers = props.project.project_workers
    }

    jobObj.project_workers.map(worker => {
      if (!updatedProjectWorkers.includes(worker)) {
        return updatedProjectWorkers.push(worker)
      } else return null
    })

    try {
      await dbServices
        .updateProjectWorkers(projectId, updatedProjectWorkers, currentUser.org)
        .then(() => {
          props.showJobForm(e)
        })
    } catch (error) {
      console.warn(error)
      Swal.fire({
        title: 'Error!',
        text:
          'There was an issue assigning employees to this project - please refresh the page and try again.',
        icon: 'error',
        confirmButtonText: 'Close',
      })
    }
  }

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(
    INITIAL_STATE,
    validateInput.validateJobForm,
    handleSubmitForm
  )

  return (
    <>
      <form onSubmit={handleSubmit} className="Form">
        <legend>{props.projectId ? 'Add New Task' : 'Edit Task'}</legend>
        <div className="input">
          <Label htmlFor="name">Task Name: </Label>
          <Input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={values.name}
            onBlur={handleBlur}
          />
          {errors.name && <p>*{errors.name}</p>}
        </div>
        <div className="input">
          <Label htmlFor="description">Details: </Label>
          <Textarea
            name="description"
            id="description"
            onChange={handleChange}
            value={values.description}
            onBlur={handleBlur}
          />
          {errors.description && <p>*{errors.description}</p>}
        </div>
        <div className="input">
          <Label htmlFor="total_hours">Total Hours: </Label>
          <input
            type="number"
            name="total_hours"
            id="total_hours"
            onChange={handleChange}
            value={values.total_hours}
            onBlur={handleBlur}
          />
          {errors.total_hours && <p>*{errors.total_hours}</p>}
        </div>
        <div className="input">
          <Label htmlFor="deadline">Deadline: </Label>
          <input
            type="date"
            name="deadline"
            id="deadline"
            onChange={handleChange}
            value={values.deadline}
            onBlur={handleBlur}
          />
          {errors.deadline && <p>*{errors.deadline}</p>}
        </div>
        <Dropdown
          isMulti={true}
          setSelected={setSelected}
          defaultValue={getEmployees()}
          placeholder="Assign Employees"
        />
        <button className="btn_secondary_color" onClick={props.showJobForm}>
          Cancel
        </button>
        <button
          className="btn_highlight_color"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </>
  )
}

export default NewJob
