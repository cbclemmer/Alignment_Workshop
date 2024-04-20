import fs from 'fs'
import _ from "lodash"
import { spawn } from "child_process"

import { IMessage, Completion, IFormat } from "./types.js"
import { Database } from 'sqlite3'

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

export function createTuneFile(messages: IMessage[], format: IFormat): string {
  return _.chain(messages)
    .groupBy('conversation_id')
    .values()
    .flatMap((conversation: IMessage[]) => {
      const completions: Completion[] = []
      let currentThread = format.systemMessage + '\n'
      conversation.map((m: IMessage, index: number) => {
        if (!m.isUser && index !== 0) {
          completions.push({
            input: currentThread + '\n\n####\n\n',
            output: m.text_data + '\n\n#####\n\n'
          })
        }
        const notation = m.isUser ? format.userNotation : format.assistantNotation
        currentThread += notation + m.text_data + '\n'
      })
      return completions
    })
    .reduce((acc: string, c: Completion) => acc + JSON.stringify(c) + '\n', '')
    .value()
}

export function getConfig() {
  var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
  if (config.pwd === undefined) {
    throw new Error('Could not find pwd in config file')
  }
  return config
}