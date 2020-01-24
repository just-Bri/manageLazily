import React, { useState } from 'react'
import useFormValidation from '../../../hooks/useFormValidation'
import validateInput from '../../../hooks/validateInput'
import { Input, Label, Textarea } from '../../Form/Form'
import dbServices from '../../../services/dbServices'
import dateConversions from '../../../services/dateConversions'
import Dropdown from '../../Dropdown/Dropdown'
import Swal from 'sweetalert2'

const ProjectForm = props => {
  const [error, setError] = useState(false)
  const proj = props.proj
  const [selected, setSelected] = useState(0)

  const INITIAL_STATE = {
    name: proj ? proj.name : '',
    description: proj ? proj.description : '',
    deadline: proj ? dateConversions.TStoFormDate(props.proj.deadline) : '',
  }

  const handleSubmitForm = async () => {
    const { name, description, deadline } = values
    let id = null
    if (props.proj) id = props.proj.id
    const data = {
      alert: true,
      name: name,
      description: description,
      project_manager: selected.value || 'Unassigned',
      deadline: dateConversions.dateToTimestamp(new Date(deadline)),
      date_created: dateConversions.dateToTimestamp(new Date()),
      org_id: props.org,
      progress: 0,
      project_workers: [],
      id: id,
    }
    try {
      if (!props.proj) {
        const docRef = await dbServices.addProject(data)
        await dbServices.setProjId(docRef.id, data.org_id)
        props.addToProjState({ ...data, id: docRef.id })
      } else {
        data.alert = false
        await dbServices.updateProject(data)
        props.updateProjInState({ ...data })
        props.toggleForm()
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Project failed to post!',
        icon: 'error',
        confirmButtonText: 'Close',
        onClose: setError(true),
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
    validateInput.validateProjectForm,
    handleSubmitForm
  )
  if (error) return null
  return (
    <form className="Form" onSubmit={handleSubmit}>
      <legend>{props.proj ? 'Update Project' : 'New Project'}</legend>
      {errors.name && <span className="error">{errors.name}</span>}
      <Label htmlFor="project_name">Name</Label>
      <Input
        name="name"
        id="project_name"
        test-id='project_name'
        type="text"
        placeholder="Project Name"
        onChange={handleChange}
        value={values.name}
        onBlur={handleBlur}
        required
      />
      {errors.description && (
        <span className="error">{errors.description}</span>
      )}
      <Label htmlFor="project_description">Description</Label>
      <Textarea
        name="description"
        id="project_description"
        test-id='project_desc'
        type="text"
        placeholder="Project Description"
        onChange={handleChange}
        value={values.description}
        onBlur={handleBlur}
      />
      <Label htmlFor="project_manager">Project Manager</Label>
      <Dropdown
        id="project_manager"
        test-id="project_man"
        pm={true}
        isMulti={false}
        setSelected={setSelected}
        defaultValue={proj && proj.project_manager}
      />
      {errors.deadline && <span className="error">{errors.deadline}</span>}
      <Label htmlFor="project_deadline">Deadline</Label>
      <input
        name="deadline"
        id="project_deadline"
        test-id='project_deadline'
        type="date"
        onChange={handleChange}
        value={values.deadline}
        onBlur={handleBlur}
      />
      <button className="btn_highlight_color" type="submit">
        Submit
      </button>
      <button className="btn_secondary_color" onClick={props.toggleForm}>
        Cancel
      </button>
    </form>
  )
}

export default ProjectForm
