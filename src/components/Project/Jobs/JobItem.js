import React, { Component } from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import JobForm from "../JobForm/JobForm";
import dbServices from "../../../services/dbServices";
import WorkerEditForm from "../WorkerEditForm/WorkerEditForm";
import { AuthContext } from "../../../services/Auth";
import StyleIcon from '../../StyleIcon/StyleIcon';
import dateConversions from "../../../services/dateConversions";
import Swal from "sweetalert2";

class JobItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandJob: false,
      showEditForm: false,
      showWorkerEditForm: false
    };
  }

  static contextType = AuthContext;

  handleApprovalSubmit = async (id, status, approval = false) => {
    try {
      await dbServices.updateJobStatus(
        id,
        status,
        this.props.job.project_id,
        approval,
        this.props.job.organization
      )
    } catch (error) {
      console.warn(error)
      Swal.fire({
        title: "Error!",
        text: 'There was an issue approving this task - please refresh the page and try again.',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };

  renderEmployeeList = jobWorkers => {
    if (!jobWorkers || jobWorkers.length === 0) return <h5>No Workers Assigned</h5>;
    return jobWorkers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderProjectButtons(approval, total_hours, hours_completed, id, status) {
    const progress = Math.floor((hours_completed / total_hours) * 100);
    if (this.context.currentUser.role === 'project worker') {
      if (status === 'completed') return <span>Project Completed</span>;
      if (status === 'submitted' || status === 'completed') return <></>;
      if (approval || progress !== 100) {
        return (
          <>
            <button disabled>Submit for Approval</button>
            {(status !== 'completed' || status !== 'submitted') && status !== 'edit request' ? (
              <button onClick={e => this.showWorkerEditForm()}>Request Edit</button>
            ) : (
              <></>
            )}
          </>
        );
      } else {
        return (
          <>
            {status === 'revisions' ? <span>Revision Requested</span> : <></>}
            <button onClick={e => this.handleApprovalSubmit(id, 'submitted', false)}>
              Submit for Approval
            </button>
          </>
        );
      }
    }

    if (
      this.context.currentUser.role === "project manager" ||
      this.context.currentUser.role === "owner"
    ) {
      if (status === "completed") return <span>Task Completed</span>;
      return (
        <>
          {!approval && progress === 100 && status !== 'revisions' ? <span>AWAITING APPROVAL</span> : <></>}
          {!approval && progress === 100 && status === 'revisions' ? <span>Revision Requested</span> : <></>}
          <div className="JobItem__edit" onClick={this.showEditForm}>
            {StyleIcon({ style: 'edit' })}
          </div>
          {status === 'submitted' ? (
            <div>
              <button onClick={e => this.handleApprovalSubmit(id, 'completed', true)}>Approve</button>{' '}
              <button onClick={e => this.handleApprovalSubmit(id, 'revisions')}>Request Revision</button>
            </div>
          ) : (
            <></>
          )}
        </>
      );
    }
  }

  toggleExpand = () => {
    this.setState({
      expandJob: !this.state.expandJob
    });
  };

  showEditForm = () => {
    this.setState({
      showEditForm: !this.state.showEditForm
    });
  };

  showWorkerEditForm = () => {
    this.setState({
      showWorkerEditForm: !this.state.showWorkerEditForm
    });
  };

  render() {
    const job = this.props.job;
    const progress = Math.floor((job.hours_completed / job.total_hours) * 100);
    return (
      <li className="JobItem" key={job.id} id={job.id} onClick={this.toggleExpand}>
        <div className="JobItem__container">
          <div className="JobItem__icon">
            {StyleIcon({
              style: `${this.state.expandJob ? 'expand' : 'collapse'}`
            })}
          </div>
          <span className="JobItem__name">{job.name}</span>
          <div className="JobItem__details">
            <span>Details:</span>
            <div className="JobItem__details_text">{job.description}</div>
          </div>
          <div className="JobItem__progress">
            <div>
              <span>Est. Progress</span>
              <ProgressBar percentage={progress} />
            </div>
            <span className="JobItem__date">Due: {dateConversions.TStoDisplayDate(job.deadline)}</span>
          {job.status !== 'completed' ? (dateConversions.dateDiff(job.deadline)
             && `Overdue by ${dateConversions.dateDiff(job.deadline)} days`) : ''}
          </div>
          <div className="JobItem__buttons">
            {this.renderProjectButtons(
              job.approval,
              job.total_hours,
              job.hours_completed,
              job.id,
              job.status
            )}
          </div>
        </div>
        {this.state.expandJob && <ul>{this.renderEmployeeList(job.project_workers)}</ul>}
        <div className="JobItem__form_container">
          {this.state.showEditForm && (
            <div className="JobItem__form">
              <JobForm showJobForm={this.showEditForm} job={job} />
            </div>
          )}
          {this.state.showWorkerEditForm && this.context.currentUser.role === 'project worker' && (
            <WorkerEditForm
              job={job}
              renderEditForm={this.showWorkerEditForm}
              handleStatus={this.handleApprovalSubmit}
            />
          )}
        </div>
      </li>
    );
  }
}

export default JobItem;