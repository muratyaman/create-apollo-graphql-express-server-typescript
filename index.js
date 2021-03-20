const fs = require('fs');
const { Command } = require('commander');
// const templatePackage = require('./template/package.json');
const thisPackage = require('./package.json');

let projectName = '';

const patternValidProjectName = /^([A-Za-z\-\_\d])+$/;

const cmd = new Command(thisPackage.name)
  .version(thisPackage.version)
  .arguments('<project-name>')
  .usage('<project-name>')
  .action(name => { projectName = name; });

cmd.parse(process.argv);

run(projectName);

async function run(projectName) {
  checkProjectName(projectName);
  const projectPath = path.resolve(projectName);
  console.log('projectPath', projectPath);
  templateDir();
  await createProject(projectPath);
  await copyTemplate(projectName);

  // TODO: update contents of package.json after project is created
  // templatePackage.name = projectName;
  console.log('project is ready');
  console.log('edit package.json, update "name"');

  // TODO: run: npm i
  console.log('review dependencies and run: npm install');
  console.log('thanks for using this project template!');
  process.exit(0);
}

async function createProject(projectPath) {
  console.log('makeDir', projectPath, ' ...');
  await makeDir(projectPath);
  console.log('makeDir', projectPath, ' ... done!');
}

function copyTemplate(projectPath) {
  console.log('copyTemplate ...');
  fs.copySync(`${__dirname}/template`, projectPath);
  fs.move(`${projectPath}/_gitignore`, `${projectPath}/.gitignore`); // rename
  console.log('copyTemplate ... done!');
}

function checkProjectName(projectName) {
  console.log('checkProjectName ...');
  if (typeof projectName === 'string') {
    projectName = projectName.trim();
  }

  if (!projectName || projectName === '' || !patternValidProjectName.test(projectName)) {
    console.log();
    console.log('Please enter a valid project name');
    console.log();
    process.exit(1);
  }

  console.log('checkProjectName ... done!');
  return true;
}

async function makeDir(dir, options = { recursive: true }) {
  return fs.promises.mkdir(dir, options);
}

function templateDir() {
  const d = path.join(__dirname, 'template');
  console.log('templateDir()', d);
  return d;
}

function templateFile(file) {
  const f = path.join(__dirname, 'template', file);
  console.log('templateFile', f);
  return f;
}
