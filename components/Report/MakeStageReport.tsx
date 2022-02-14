import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CompileStageReport {
  isSuccess: boolean
  stderr: Array<string>
  stdout: Array<string>
  toolName?: string
  hasTimedOut: boolean
  exitCode: number
}

function CompilationStatus({ success, timedOut }) {
  if(timedOut) {
    return (
      <span
        aria-label="Compilation has timed out"
        data-flow="right"
        className="ml-2"
      >
        <FontAwesomeIcon className="text-red-500" icon={['far', 'alarm-exclamation']}/>
      </span>
    )
  }
  return (
    <span
      aria-label={success?'Stage executed successfully':'Stage exection has failed'}
      data-flow="right"
      className="ml-2"
    >
      <FontAwesomeIcon className={`${success?'text-green-500':'text-red-500'}`} icon={['far', success?'check':'times']}/>
    </span>
  )
} 

export function MakeStageReportView({ reports }) {
  
  const [logView, setLogView] = useState('stdout');
  const [viewingIndex, setViewingIndex] = useState(0);
  console.log(reports);

  return (
    <div className="bg-white shadow rounded-lg border">
      <header className="bg-gray-100 w-full px-4 py-3 rounded-tl-lg rounded-tr-lg border-b flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium leading-5">
            Make
            <CompilationStatus success={reports[viewingIndex].isSuccess} timedOut={reports[viewingIndex].hasTimedOut}/>
          </h3>
          <h6 className="text-xs text-gray-600">Makefile compilation stage</h6>
        </div>
        <span
          className="bg-teal-400 w-10 h-10 rounded-full flex justify-center items-center shadow">
          <FontAwesomeIcon className="text-white" icon={['fad', 'cogs']}/>
        </span>
      </header>
      <div className="px-4 py-3 flex flex-col justify-between">
        <div>
          <nav className="flex items-center">
            <button
              onClick={() => setLogView('stdout')}
              className={`px-3 py-1 font-medium text-xs tracking-wider uppercase leading-5 rounded-md ${logView==='stdout'?'text-gray-700 bg-gray-100': 'text-gray-600 hover:text-gray-800 focus:text-gray-800'}  focus:outline-none focus:bg-gray-200`}>
              STDOUT
            </button>
            <button
              onClick={() => setLogView('stderr')}
              className={`ml-4 px-3 py-1 flex items-center font-medium text-xs tracking-wider uppercase leading-5 rounded-md ${logView==='stderr'?'text-gray-700 bg-gray-100': 'text-gray-600 hover:text-gray-800 focus:text-gray-800'} focus:outline-none  focus:bg-gray-200`}>
              { reports[viewingIndex]['stderr'].length !== 0 && (
                <svg className="mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              STDERR
            </button>
          </nav>
        </div>
        <div className="my-4 rounded-md bg-gray-700 border p-3 text-white font-mono h-32 overflow-y-auto">
          { 
            reports[viewingIndex][logView].length>0 && reports[viewingIndex][logView].map((line, i) => (
              <p key={i}>{line}</p>
            )) 
          }
          {
            reports[viewingIndex][logView].length===0 && (<p className="text-center">No logged output</p>) 
          }
        </div>
      </div>
    </div>
  )
}