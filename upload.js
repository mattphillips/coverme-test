const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const shell = require('shelljs');

const p = path.resolve(__dirname, 'coverage/lcov-report');

const repoName = process.argv[3];
const sha = shell.exec('git rev-parse HEAD').substring(0, 7);

const getAllFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

const files = getAllFiles(p).map(file => ({ relative: file.replace(p, ''), absolute: file }));

const formData = new FormData();
files.forEach(file => {
  formData.append(file.relative, fs.createReadStream(file.absolute));
});

formData.append('repo', repoName);
formData.append('sha', sha);

fetch('https://coverme-test.now.sh/coverage', {
  method: 'POST',
  body: formData,
})
  .then(res => res.text())
  .then(text => console.log(text));


