require('babel-polyfill')
import isEmpty from 'lodash/isEmpty'

function getWorld() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('World');
      }, 2000);
    });
}
  
async function helloWorld(req, res){
  let name;
  await getWorld().then(a => {name = a});
  res.send(`Hello ${name}!`)
};

export {helloWorld}