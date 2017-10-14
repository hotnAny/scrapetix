const { spawn } = require('child_process');

const fixedInterval = 100000
const flexibleInterval = 100000

let run = () => {
    let ls = spawn('./phantomjs', ['scrapetix.js'])
    
    ls.stdout.on('data', (data) => {
      console.log(`${data}`)
    })
    
    ls.stderr.on('data', (data) => {
      console.log(`ERROR: ${data}`)
    })
    
    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      run()
    })
}

run()