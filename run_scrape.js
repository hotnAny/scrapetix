const { spawn } = require('child_process');

const fixedInterval = 100000
const flexibleInterval = 100000

let run = () => {
    let ls = spawn('./phantomjs', ['scrapetix.js'])
    // let ls = spawn('cat', ['scrapetix.js'])
    
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })
    
    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      let interval = fixedInterval + Math.random() * flexibleInterval
      let min = (interval/1000/60) | 0
      let sec = ((interval - min * 60 * 1000)/1000) | 0
      console.log('running again in ' + min + ' min ' + sec + ' sec ...')
      setTimeout(run, interval)
    })
}

run()