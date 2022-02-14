import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { ReactGhLikeDiff } from "react-gh-like-diff";
import { TimeoutBanner } from "../TimeoutBanner"

const signal = {
  1: 'SIGHUP',
  2: 'SIGINT',
  3: 'SIGQUIT',
  4: 'SIGILL',
  5: 'SIGTRAP',
  6: 'SIGABRT/SIGIOT',
  7: 'SIGBUS',
  8: 'SIGEMT',
  9: 'SIGKILL',
  10: 'SIGUSR1',
  11: 'SIGSEGV',
  12: 'SIGUSR2',
  13: 'SIGPIPE',
  14: 'SIGALRM',
  15: 'SIGTERM',
  16: 'SIGSTKFLT',
  17: 'SIGHLD',
  18: 'SIGCONT',
  19: 'SIGSTOP',
  20: 'SIGTSTP',
  21: 'SIGTTIN',
  22: 'SIGTTOU',
  23: 'SIGURG',
  24: 'SIGXCPU',
  25: 'SIGXFSZ',
  26: 'SIGVTALRM',
  27: 'SIGPROF',
  28: 'SIGWINCH',
  29: 'SIGIO',
  30: 'SIGPWR',
  31: 'SIGSYS/SIGUNUSED'


}

function StdioTestStatus({ allPassed }) {
  return (
    <span
      aria-label={allPassed?'All test cases passed':'One or more test cases have failed'}
      data-flow="up"
      className="ml-2"
    >
      <FontAwesomeIcon className={`${allPassed?'text-green-500':'text-red-500'}`} icon={['far', allPassed?'check':'times']}/>
    </span>
  )
}

export function StdioTestStageReportView({ reports }) {

  const dispatch = useLayoutDispatch()
  const [viewingIndex, setViewingIndex] = useState(0);
  const [viewingTestCase, setViewingTestCase] = useState(0);

  return (
    <div className="bg-white shadow rounded-lg border">
      <header className="bg-gray-100 w-full px-4 py-3 rounded-tl-lg rounded-tr-lg border-b flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium leading-5">
            Standard I/O Test
            <StdioTestStatus allPassed={reports.filter(({isCorrect}) => !isCorrect).length === 0}/>
          </h3>
          {/*
          <h6 className="text-xs text-gray-600">On file:
            <span className="ml-1 font-medium">{reports[viewingIndex]['file']}</span>
          </h6> */ }
        </div>
        <span
          className="bg-indigo-500 w-10 h-10 rounded-full flex justify-center items-center shadow">
          <FontAwesomeIcon className="text-white" icon={['fad', 'terminal']}/>
        </span>
      </header>
      <div className="px-4 py-3 flex flex-col justify-between">
        <div className="mb-4">
          <nav className="flex items-center">
            <button
              className={`px-3 py-1 font-medium text-xs tracking-wider uppercase leading-5 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:bg-gray-200`}>
              Test Cases
            </button>
          </nav>
        </div>
        <ul>
          {
            reports.map((testCase, i) => (
              <li className="flex items-center justify-between my-2" key={i}>
                <div>
                  <FontAwesomeIcon className={`mr-2 ${testCase.isCorrect?'text-green-500':'text-red-500'}`} icon={['far', testCase.isCorrect?'check':'times']}/>
                  <span className="text-sm">Test #{testCase.id}</span>
                </div>
                <span className="inline-flex rounded-md shadow-sm">
                  <button onClick={() => dispatch({ type: 'viewStdioComparison', payload: testCase })} className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
                    Details
                  </button>
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export function StdioTestDetailView() {

  const dispatch = useLayoutDispatch()
  const { stdioTestCase } = useLayoutState();
  console.log(stdioTestCase)
  const [viewingMode, setViewingMode] = useState('single')

  return (
    <>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1 w-full">
            <div className="flex justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                <FontAwesomeIcon className={`${stdioTestCase.isSuccess?'text-green-500':'text-red-500'} mr-2`} icon={['far', stdioTestCase.isSuccess?'check':'times']}/>
                Test Case #{stdioTestCase.id} - Standard IO
              </h3>
              {
                stdioTestCase.score && (
                  <h4>
                    Score: {stdioTestCase.score.score} / { stdioTestCase.score.total }
                  </h4>
                )
              }
            </div>
            <div className="mt-2">
              <div className="sm:hidden">
                {/* <select aria-label="Selected tab" className="form-select block w-full">
                  <option>My Account</option>
                  <option>Company</option>
                  <option selected>Team Members</option>
                  <option>Billing</option>
                </select> */}
              </div>
              <div className="hidden sm:block">
                <nav className="flex">
                  <button
                    onClick={() => setViewingMode('single')}
                    className={`px-3 py-2 font-medium text-sm leading-5 rounded-md ${viewingMode==='single'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none`}>
                    Your Output
                  </button>
                  {
                    stdioTestCase.stderr.length!==0 && <button
                      onClick={() => setViewingMode('error')}
                      className={`ml-4 px-3 py-2 flex items-center font-medium text-sm leading-5 rounded-md ${viewingMode==='error'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none`}>
                      <svg className="mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Errors
                    </button>
                  }
                  <button
                    onClick={() => setViewingMode('split')}
                    className={`ml-4 px-3 py-2 font-medium text-sm leading-5 rounded-md ${viewingMode==='split'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none`}>
                    Split-View Comparison
                  </button>
                  <button
                    onClick={() => setViewingMode('unified')}
                    className={`ml-4 px-3 py-2 font-medium text-sm leading-5 rounded-md ${viewingMode==='unified'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none `} aria-current="page">
                    Unified Comparison
                  </button>
                </nav>
              </div>
            </div>
            {
              viewingMode==='error' && (
                <div className="mt-4 rounded-lg bg-gray-700 shadow-inner border p-3 text-white font-mono h-56 overflow-y-auto w-full">
                  {
                    stdioTestCase.stderr.map((line, i) => (
                      <pre key={i}>{line}</pre>
                    ))
                  }
                </div>
              )
            }
            {
              viewingMode==='single' && (
                <div className="flex flex-col">
                  <div className="mt-4 rounded-lg bg-gray-700 shadow-inner border p-3 text-white font-mono h-56 overflow-y-auto w-full">
                    {
                      stdioTestCase.stdout.map((line, i) => (
                        <pre key={i}>{line}</pre>
                      ))
                    }
                  </div>
                  {
                    !stdioTestCase.isSuccess && stdioTestCase.hasOwnProperty('exeExitCode') && stdioTestCase.exeExitCode!==0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium leading-5 bg-gray-100 text-gray-800">
                          ▶ Process terminated with non-zero exit code: 
                          <span className="ml-1 font-mono">
                            { stdioTestCase.exeExitCode }
                            <a href="https://man7.org/linux/man-pages/man7/signal.7.html" className="ml-1">
                              ({ stdioTestCase.exitCode>128?signal[stdioTestCase.exitCode-128]:signal[stdioTestCase.exeExitCode] })
                              <FontAwesomeIcon className="ml-1" icon={['fad', 'question-circle']}/>
                            </a>
                          </span>
                        </span>
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              viewingMode==='split' && (
                <div className="mt-4">
                  {
                    stdioTestCase.visibility==='ALWAYS_VISIBLE'? (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <span className="flex justify-center items-center font-medium text-xs tracking-wider uppercase bg-gray-100 py-1.5 px-3 text-gray-500 rounded-lg">Expected output</span>
                          <span className="flex justify-center items-center font-medium text-xs tracking-wider uppercase bg-gray-100 py-1.5 px-3 text-gray-500 rounded-lg">Program output</span>
                        </div>
                        <ReactGhLikeDiff
                          options={{
                            originalFileName: 'Your Output',
                            updatedFileName: 'Expected Output',
                            outputFormat: 'side-by-side'
                          }}
                          diffString={stdioTestCase.diff.join('\n')}
                        />
                      </div>
                    ):<div className="mt-4 shadow-inner rounded-lg bg-gray-300 border p-6 text-center flex flex-col items-center justify-center h-32 overflow-y-auto w-full">
                        <FontAwesomeIcon className="text-gray-600 mb-2" icon={['fad', 'eye-slash']} size="2x" />
                        <h5 className="font-medium text-gray-600">Expected output is not available for this test case</h5>
                    </div>
                  }
                </div>
              )
            }
            {
              viewingMode==='unified' && (
                <div className="mt-4">
                  {
                    stdioTestCase.visibility==='ALWAYS_VISIBLE'? (
                      <ReactGhLikeDiff
                        options={{
                          originalFileName: 'Your Output',
                          updatedFileName: 'Expected Output',
                          outputFormat: 'line-by-line'
                        }}
                        diffString={stdioTestCase.diff.join('\n')}
                      />
                    ):<div className="mt-4 shadow-inner rounded-lg bg-gray-300 border p-6 text-center flex flex-col items-center justify-center h-32 overflow-y-auto w-full">
                        <FontAwesomeIcon className="text-gray-600 mb-2" icon={['fad', 'eye-slash']} size="2x" />
                        <h5 className="font-medium text-gray-600">Expected output is not available for this test case</h5>
                    </div>
                  }
                </div>
              )
            }
          </div>
        </div>
        <TimeoutBanner stageName="Standard IO Test" hidden={!stdioTestCase.hasTimedOut}/>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button onClick={() => dispatch({ type: 'closeModal' })} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Close
          </button>
        </span>
      </div>
    </>
  )
}
