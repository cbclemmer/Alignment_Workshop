import { spawn } from "child_process";

export function callPythonScript(inputString: string): Promise<string> {
  return new Promise<string>((res, rej) => {
    const pythonScript = spawn('python3', ['oob_api.py', inputString]);
  
    pythonScript.stdout.on('data', (data: any) => {
      console.log('API request successful')
      res(data)
    });
  
    pythonScript.stderr.on('data', (data: any) => {
      console.error('API request failure')
      rej(data.toString())
    });
  
    pythonScript.on('close', (code: any) => { });
  })
}