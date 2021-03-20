const fse  = require('fs-extra');
const path = require('path');
const { Command } = require('commander');

const templatePackage = require('./template/package.json');
const thisPackage     = require('./package.json');

let projectName = '', projectPath = null;

const patternValidProjectName = /^([A-Za-z\-\_\d])+$/;

const cmd = new Command(thisPackage.name)
  .version(thisPackage.version)
  .arguments('<project-name>')
  .usage('<project-name>')
  .action(name => { projectName = name; });

cmd.parse(process.argv);

run(projectName);

async function run(projectName) {
  try {
    console.log('run() ...');

    checkProjectName(projectName);
    
    projectPath = path.resolve(projectName);
    console.log(' * project path', projectPath);
    
    await copyTemplate();

    console.log(' * project is ready');
    console.log(' * edit package.json, update "name"');

    console.log(' * review dependencies and run: npm install');
    console.log(' * thanks for using this project template!');
    console.log('run() ... done!');
    process.exit(0);
  } catch (err) {
    console.error(' * ERROR', err.message);
    console.log('run() ... failed!');
    process.exit(1);
  }
}

async function copyTemplate() {
  console.log(' * copyTemplate() ...');
  
  // copy template dir with subdirs
  await fse.copy(templateDir(), projectPath);

  // rename gitignore
  await fse.move(projectFile('_gitignore'), projectFile('.gitignore'));
  
  // update contents of package.json
  templatePackage.name = projectName;
  await updateNewPackageJson();
  
  console.log(' * copyTemplate() ... done!');
}

async function updateNewPackageJson() {
  console.log(' ** updateNewPackageJson (name) ...');
  const text = JSON.stringify(templatePackage, null, ' ');
  await fse.writeFile(projectFile('package.json'), text);
  console.log(' ** updateNewPackageJson (name) ... done!');
}

function checkProjectName(projectName) {
  console.log(' * checkProjectName() ...');
  if (typeof projectName === 'string') {
    projectName = projectName.trim();
  }

  if (!projectName || projectName === '' || !patternValidProjectName.test(projectName)) {
    console.log(' * checkProjectName() ... error!');
    throw new Error('Please enter a valid project name');
  }

  console.log(' * checkProjectName() ... done!');
  return true;
}

function templateDir() {
  return path.join(__dirname, 'template');
}

function templateFile(file) {
  return path.join(__dirname, 'template', file);
}

function projectFile(file) {
  return path.join(projectPath, file);
}
