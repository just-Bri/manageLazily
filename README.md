# ManageLazily

> A project management application built with small businesses in mind. Users can create,
> update, assign, track, and analyze their businesses projects securely on the cloud from
> any location with access to the web.

ManageLazily enables company owners, project managers, and employees to have a one-stop
project management hub where they can create projects, track project completion and due dates,
add tasks to projects, log hours worked on project tasks, and more. Built with simplicity
and usability in mind, ManageLazily is a great alternative to more complex (and expensive)
project management software.

[See the Live App Here](https://managelazily.com/)

[Demo Logins available here](https://github.com/reifnotreef/manageLazily/blob/master/DEMO_LOGINS.md)

[Screenshots below](#Screenshots)

## Development setup

- Clone this repo and move to the new directory:

  ```bash
  git clone https://github.com/reifnotreef/manageLazily.git YOUR_PROJECT_NAME

  cd YOUR_PROJECT_NAME
  ```

- Make a fresh start of the git history for this project and install node dependencies:

  ```bash
  rm -rf .git && git init

  npm install
  ```

- Move the example Environment file to .env:
  ```bash
  mv example.env .env
  ```
- Edit the contents of the package.json to use your new project's name:
  ```JSON
  "name": "YOUR_APP_NAME"
  ```

Firebase Setup:

- Create a Firebase project
- Register your app with Firebase
- Add Firebase project configuration to your .env:

  ```
  REACT_APP_API_KEY = YOUR_KEY_HERE
  REACT_APP_AUTH_DOMAIN = YOUR_APP.firebaseapp.com
  REACT_APP_DATABASE_URL = https://YOUR_APP.firebaseio.com/
  REACT_APP_PROJECT_ID = YOUR_APP_ID
  REACT_APP_STORAGE_BUCKET = YOUR_APP.appspot.com
  REACT_APP_MESSAGING_SENDER_ID = YOUR_SENDER_ID
  REACT_APP_APP_ID = YOUR_FIREBASE_APP_ID
  REACT_APP_MEASUREMENT_ID = YOUR_FIREBASWE_MESUREMENT_ID
  ```

- Create Cloud Firestore database via the Firebase console - see [Cloud Firestore Setup](https://firebase.google.com/docs/firestore/quickstart)
- Enable email authentication via the Firebase console
- For in-depth instructions, please visit [Firebase Docs](https://firebase.google.com/docs/web/setup)

## Scripts

Start the application:

```bash
npm start
```

Run the tests:

- First create a Service Account for your Firebase project, instructions [here.](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- Place that file in the root of your project directory and add it to your `.gitignore` file.

```bash
npm run test:open
```

## Cloud Functions

- This app utilizes Google Cloud Functions for adding and promoting users.
- To see the function code please look [here.](https://github.com/reifnotreef/manageLazily/blob/master/functions/index.js)

## Release History

- 0.0.1
  - Work in progress

## Contributors

| Name | Role | Github Profile |
| :-------------: |:-------------:|:-------------:|
| Adam Newhouser | Marketing and DBA | [link](https://github.com/AdamNewhouser) |
| Alex Bannow | Marketing and QA | [link](https://github.com/rbannal86) |
| Balay Aydemir | Project Manager | [link](https://github.com/balayaydemir) |
| Bridger Hammond | Product Manager | [link](https://github.com/reifnotreef) |
| Dan Wagar | UI/UX Design | [link](https://github.com/danWagar) |

# Screenshots

| Landing Page | Dashboard|
| :-------------: |:-------------:|
| <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/landing_page.png" width='80%' height='auto'> | <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/dashboard.png" width='80%' height='auto'> |
| Login | Register|
| <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/login_page.png" width='80%' height='auto'> | <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/register.png" width='80%' height='auto'> |
| Add Project | Edit Project|
| <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/add_project.png" width='80%' height='auto'> | <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/edit_project.png" width='80%' height='auto'> |
| Add Task | Edit Task|
| <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/add_task.png" width='80%' height='auto'> | <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/edit_task.png" width='80%' height='auto'> |
| Project View | Log Hours|
| <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/project_view.png" width='80%' height='auto'> | <img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/log_hours.png" width='80%' height='auto'> |
| Profile View | Catch All Page |
|<img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/user_profile.png" width='80%' height='auto'>|<img src="https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/screenshots/catchall.png" width='80%' height='auto'>|


## License

Distributed under the MIT license. See [LICENSE.md](https://github.com/reifnotreef/manageLazily/blob/master/LICENSE) for more information.

## [Contributing](https://github.com/reifnotreef/manageLazily/blob/master/CONTRIBUTING.md)

1.  [Fork this](https://github.com/reifnotreef/manageLazily)
2. Clone your fork and create your feature branch (`git checkout -b fooBar`)
3.  Commit your changes (`git commit -m 'Add some fooBar'`)
4.  Push to the branch (`git push`)
5.  Create a [New Pull Request](https://github.com/reifnotreef/manageLazily/pull/new/master)

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
