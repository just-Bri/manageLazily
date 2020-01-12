import React from 'react';
import { db, auth } from './firebase';

const FirebaseContext = React.createContext({
  user: {
    name: null,
    role: null,
    email: null,
    org: null
  },
  employees: [],
  projects: [],
  project_managers: [],
  jobs: [],
  loading: true,
  initState: () => {},
  setLoading: () => {},
  getJobs: () => {},
  setJobsState: () => {},
  getProjects: () => {},
  setProjectState: () => {},
  getEmployees: () => {},
  setEmployeeState: () => {},
  createUserInorg: () => {},
  newSetUser: () => {},
  getOrgName: () => {},
  getProjectManagers: () => {},
  setProjectManagersState: () => {},
  setNewJob: () => {},
  watchAuth: () => {},
  doCreateUserWithEmailAndPassword: () => {},
  doSignInWithEmailAndPassword: () => {},
  doSignOut: () => {},
  doPasswordReset: () => {},
  doPasswordUpdate: () => {}

  // DEPRECATED
  // setUser: () => {},
  // setProjects: () => {},
  // setJobs: () => {},
  // doGetProject: () => {},
  // doGetProjectJobs: () => {},
});

export default FirebaseContext;

export class ContextProvider extends React.Component {
  state = {
    user: {
      id: '',
      name: '',
      org: ''
    },
    employees: [],
    projects: [],
    project_managers: [],
    jobs: []
  };

  setLoading = bool => {
    this.setState({ loading: bool });
  };

  initState = () => {
    let emps = [],
      projs = [],
      jobs = [],
      pms = [];
    this.getProjects('orgOne')
      .then(snapshot => {
        snapshot.forEach(async proj => {
          projs.push(proj.data());
          await this.getJobs('orgOne', proj.id).then(snap => snap.forEach(job => jobs.push(job.data())));
        });
      })
      .then(() => this.getEmployees('orgOne'))
      .then(snapshot => snapshot.forEach(emp => emps.push(emp.data())))
      .then(() => this.getProjectManagers('orgOne'))
      .then(snapshot => snapshot.forEach(pm => pms.push(pm.data())))
      .then(() => {
        this.setState({
          projects: projs,
          jobs: jobs,
          employees: emps,
          project_managers: pms
        });
      });
  };

  getJobs = (org, id) => {
    //console.log(org, id);
    return db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(id)
      .collection('jobs')
      .get();
  };

  setJobsState = jobs => {
    this.setState({ jobs: jobs });
  };

  getProjects = org => {
    return db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .get();
  };
  setProjectState = projs => {
    this.setState({ projects: projs });
  };

  getEmployees = org => {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project worker')
      .get();
  };

  setEmployeeState = emps => {
    this.setState({ employees: emps });
  };

  getProjectManagers = org => {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project manager')
      .get();
  };

  setProjectManagersState = pms => {
    this.setState({ project_managers: pms });
  };

  createUserInOrg = (newUser, org) => {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .doc(newUser.email)
      .set(newUser);
  };

  newSetUser = (email, org) => {
    db.collection('organizations')
      .doc(org)
      .collection('users')
      .doc(email)
      .onSnapshot(snapshot => {
        this.setState({
          user: {
            email: snapshot.data().email,
            name: snapshot.data().name,
            role: snapshot.data().role,
            org: org
          }
        });
      });
  };

  getOrgName = org => {
    // console.log(org);
    return db
      .collection('organizations')
      .doc(org)
      .get()
      .then(snapshot => {
        // console.log(snapshot.data());
        return snapshot.data().name;
      })
      .catch(error => console.log(error));
  };

  addProject = newProject => {
    db.collection(`organization/${this.state.user.org.id}/projects`).add(newProject);
  };

  setNewJob = job => {
    this.setState({
      jobs: [...this.state.jobs, job]
    });
  };

  addJob = (newJob, project_id) => {
    db.collection(`organizations/${this.state.user.org.id}/projects/${project_id}/jobs`)
      .add(newJob)
      .then(() => {
        this.setState(
          {
            jobs: [...this.state.jobs, newJob]
          },
          () => 'success'
        );
        //return newJob
      })
      .catch(error => {
        console.log(error);
      });
  };

  addUser = newUser => {
    db.collection('users').add(newUser);
  };

  addProject = newProject => {
    db.collection(`organizations/${this.state.user.org.id}/projects`).add(newProject);
  };

  addUser = newUser => {
    db.collection('users').add(newUser);
  };

  watchAuth = () => this.auth.onAuthStateChanged(user => user);

  doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => auth.signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    auth
      .signOut()
      .then(res => this.setState({ user: null, projects: [], employees: [], jobs: [] }))
      .catch(error => console.log(error));

  doPasswordReset = email => auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => auth.currentUser.updatePassword(password);

  doGetProject = (org_id = 'HkeHO8n1eIaJSu6mnsd5') => {
    return db
      .collection('organizations')
      .doc(org_id)
      .collection('projects')
      .get();
  };

  // DEPRECATED
  // setUser = (email, org) => {
  //   return db
  //     .collection("organizations")
  //     .where("name", "==", org)
  //     .get()
  //     .then(snapshot => {
  //       let orgId = 0;
  //       snapshot.forEach(doc => (orgId = doc.id));
  //       return orgId;
  //     })
  //     .then(orgId => {
  //       db.collection("users")
  //         .where("email", "==", email)
  //         .get()
  //         .then(snapshot => {
  //           snapshot.forEach(doc => {
  //             console.log("current user:");
  //             console.log(doc.data());
  //             this.setState({
  //               user: {
  //                 id: doc.id,
  //                 name: doc.data().name,
  //                 email: doc.data().email,
  //                 org: { name: doc.data().org.name, id: orgId },
  //                 role: doc.data().role,
  //               },
  //             });
  //           });
  //         })
  //         .catch(error => console.log(error));
  //     });
  // };

  // DEPRECATED
  // setProjects = (role, name) => {
  //   return db
  //     .collection(`organizations/${this.state.user.org.id}/projects`)
  //     .get()
  //     .then(snapshot => {
  //       const projects = [];
  //       if (role === "project worker") {
  //         snapshot.forEach(doc => {
  //           if (doc.data().project_workers.includes(name)) {
  //             projects.push({ id: doc.id, ...doc.data() });
  //           }
  //         });
  //       } else if (role === "project manager") {
  //         snapshot.forEach(doc => {
  //           if (doc.data().project_manager === name) {
  //             const projectObj = {
  //               id: doc.id,
  //               date_created: doc.data().date_created,
  //               deadline: doc.data().deadline,
  //               description: doc.data().description,
  //               name: doc.data().name,
  //               org_id: doc.data().org_id,
  //               progress: doc.data().progress,
  //               project_manager: doc.data().project_manager,
  //               project_workers: doc.data().project_workers,
  //             };
  //             projects.push(projectObj);
  //           }
  //         });
  //       } else {
  //         snapshot.forEach(doc => {
  //           const projectObj = {
  //             id: doc.id,
  //             date_created: doc.data().date_created,
  //             deadline: doc.data().deadline,
  //             description: doc.data().description,
  //             name: doc.data().name,
  //             org_id: doc.data().org_id,
  //             progress: doc.data().progress,
  //             project_manager: doc.data().project_manager,
  //             project_workers: doc.data().project_workers,
  //           };
  //           projects.push(projectObj);
  //         });
  //       }
  //       this.setState({
  //         projects: projects,
  //       });
  //     })
  //     .then(() => {
  //       this.setJobs(role, name);
  //     })
  //     .catch(error => console.log(error));
  // };

  // DEPRECATED
  // setJobs = (role, name) => {
  //   // console.log(role, name);
  //   this.state.projects.forEach(project => {
  //     // console.log(
  //     //   `organization/${this.state.user.org.id}/projects/${project.id}/jobs`,
  //     // );
  //     db.collection(
  //       `organizations/${this.state.user.org.id}/projects/${project.id}/jobs`,
  //     )
  //       .get()
  //       .then(snapshot => {
  //         const jobs = [];
  //         if (role === "project worker") {
  //           // console.log("Getting jobs");
  //           // console.log(snapshot);
  //           snapshot.forEach(doc => {
  //             console.log(doc.data());
  //             if (doc.data().project_workers.includes(name)) {
  //               jobs.push({ id: doc.id, ...doc.data() });
  //             }
  //           });
  //         } else if (role === "project manager") {
  //           snapshot.forEach(doc => {
  //             console.log(doc.data());
  //             if (doc.data().project_manager === name) {
  //               jobs.push({ id: doc.id, ...doc.data() });
  //             }
  //           });
  //         } else {
  //           snapshot.forEach(doc => {
  //             jobs.push({ id: doc.id, ...doc.data() });
  //           });
  //         }

  //         console.log(jobs);
  //         console.log(this.state.jobs);

  //         this.setState({
  //           jobs: [...this.state.jobs, jobs],
  //         });
  //       })
  //       .catch(error => console.log(error));
  //   });
  // };

  // addJob = (newJob, project_id) => {
  //   console.log('adding job!')
  //   db.collection(
  //     `organizations/${this.state.user.org.id}/projects/${project_id}/jobs`,
  //   ).add(newJob).then(doc => {
  //     console.log(doc)
  //   })
  // };

  // DEPRECATED
  // doGetProjectJobs = (
  //   org_id = "HkeHO8n1eIaJSu6mnsd5",
  //   project_id = "FUFRX6873V2Llg9XQJBt",
  // ) => {
  //   return db
  //     .collection("organizations")
  //     .doc(org_id)
  //     .collection("projects")
  //     .doc(project_id)
  //     .collection("jobs")
  //     .get();
  // };

  render() {
    const value = {
      user: this.state.user,
      employees: this.state.employees,
      projects: this.state.projects,
      project_managers: this.state.project_managers,
      jobs: this.state.jobs,
      initState: this.initState,
      getOrgName: this.getOrgName,
      addProject: this.addProject,
      addJob: this.addJob,
      addUser: this.addUser,
      watchAuth: this.watchAuth,
      doCreateUserWithEmailAndPassword: this.doCreateUserWithEmailAndPassword,
      doSignInWithEmailAndPassword: this.doSignInWithEmailAndPassword,
      doSignOut: this.doSignOut,
      doPasswordReset: this.doPasswordReset,
      doPasswordUpdate: this.doPasswordUpdate,
      setNewJob: this.setNewJob,
      setLoading: this.setLoading,
      createUserInOrg: this.createUserInOrg,
      newSetUser: this.newSetUser,
      getProjects: this.getProjects,
      getEmployees: this.getEmployees,
      setEmployeeState: this.setEmployeeState,
      setProjectState: this.setProjectState,
      getJobs: this.getJobs,
      setJobsState: this.setJobsState,
      getProjectManagers: this.getProjectManagers,
      setProjectManagersState: this.setProjectManagersState

      // DEPRECATED
      // setProjects: this.setProjects,
      // setJobs: this.setJobs,
      // doGetProject: this.doGetProject,
      // doGetProjectJobs: this.doGetProjectJobs,
      // setUser: this.setUser,
    };
    return <FirebaseContext.Provider value={value}>{this.props.children}</FirebaseContext.Provider>;
  }
}
