import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { TimeoutBanner } from "../TimeoutBanner";

function ValgrindResultStatus({ allPasses, timedOut }) {
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
      aria-label={allPasses?'No memory leakage found':'Memory leakage or errors found'}
      data-flow="up"
      className="ml-2"
    >
      <FontAwesomeIcon className={`${allPasses?'text-green-500':'text-red-500'}`} icon={['far', allPasses?'check':'times']}/>
    </span>
  )
}

export function ValgrindStageView ({ reports }) {
  const dispatch = useLayoutDispatch();
  const [viewingIndex, setViewingIndex] = useState(0)

  return (
    <div className="bg-white shadow rounded-lg border py-3">
      <header className="w-full px-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium leading-5">
            Valgrind Check
            <ValgrindResultStatus
              allPasses={reports.filter(({isSuccess}: any) => isSuccess).length===reports.length}
              timedOut={reports[viewingIndex]['hasTimedOut']}
            />
          </h3>
          <h6 className="text-xs text-gray-600"></h6>
        </div>
        <span
          className="bg-green-400 w-10 h-10 rounded-full flex justify-center items-center shadow">
          <FontAwesomeIcon className="text-white" icon={['fad', 'memory']}/>
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
                  <FontAwesomeIcon className={`mr-2 ${testCase.isSuccess?'text-green-500':'text-red-500'}`} icon={['far', testCase.isSuccess?'check':'times']}/>
                  <span className="text-sm">Test #{testCase.id}</span>
                </div>
                <span className="inline-flex rounded-md shadow-sm">
                  <button onClick={() => dispatch({ type: 'viewValgrindReport', payload: testCase })} className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
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

export function ValgrindDetailView() {

  const dispatch = useLayoutDispatch()
  const { valgrindTestCase } = useLayoutState();
  const [viewingMode, setViewingMode] = useState('stdout')
  console.log(valgrindTestCase)
  return (
    <>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1 w-full">
            <div className="flex justify-between">
              <h3 className="flex flex-col text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Test Case #{valgrindTestCase.id}
                {
                  valgrindTestCase.score && (
                    <h4 className="font-normal text-sm">
                      Score: {valgrindTestCase.score.score} / { valgrindTestCase.score.total }
                    </h4>
                  )
                }
              </h3>
              <div>
                <nav className="flex">
                  <button
                    onClick={() => setViewingMode('stdout')}
                    className={`px-3 py-2 tracking-wider font-medium text-sm leading-5 rounded-md ${viewingMode==='stdout'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none`}>
                    STDOUT
                  </button>
                  <button
                    onClick={() => setViewingMode('stderr')}
                    className={`ml-4 flex px-3 py-2 tracking-wider font-medium text-sm leading-5 rounded-md ${viewingMode==='stderr'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none`}>
                    {
                      valgrindTestCase.stderr.length>0 && (
                        <svg className="mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                      )
                    }
                    STDERR
                  </button>
                  <button
                    onClick={() => setViewingMode('errors')}
                    className={`ml-4 px-3 py-2 tracking-wider font-medium text-sm leading-5 rounded-md ${viewingMode==='errors'?'text-gray-700 bg-gray-100 focus:bg-gray-200':' text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100'} focus:outline-none`}
                    >
                    Errors
                  </button>
                </nav>
              </div>
            </div>
            {
              viewingMode==='stdout' && (
                <div className="mt-4 rounded-lg bg-gray-700 shadow-inner border p-3 text-white font-mono h-56 overflow-y-auto w-full">
                  {
                    valgrindTestCase.stdout.length>0 && valgrindTestCase.stdout.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  }
                  {
                    valgrindTestCase.stdout.length===0 && (
                      <span>No Output</span>
                    )
                  }
                </div>
              )
            }
            {
              viewingMode==='stderr' && (
                <div className="mt-4 rounded-lg bg-gray-700 shadow-inner border p-3 text-white font-mono h-56 overflow-y-auto w-full">
                  {
                    valgrindTestCase.stderr.length>0 && valgrindTestCase.stderr.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  }
                  {
                    valgrindTestCase.stderr.length===0 && (
                      <span>No Output</span>
                    )
                  }
                </div>
              )
            }
            {
              viewingMode==='errors' && (
                <ValgrindErrorViewer errors={valgrindTestCase.errors}/>
              )
            }
          </div>
        </div>
        <TimeoutBanner stageName="Valgrind Check" hidden={!valgrindTestCase.hasTimedOut}/>
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

export function ValgrindErrorViewer({ errors }) {

  const [index, setIndex] = useState(0);

  if(errors.length===0) {
    return (
      <div className="mt-4 shadow-inner rounded-lg bg-gray-300 border p-6 text-center flex flex-col items-center justify-center h-32 overflow-y-auto w-full">
        <FontAwesomeIcon className="text-gray-600 mb-2" icon={['fad', 'empty-set']} size="2x" />
        <h5 className="font-medium text-gray-600">No errors emitted from Valgrind</h5>
      </div>
    )
  }
  return (
    <div className="mt-6 flex flex-col justify-between">
      <div className="w-full mb-4 ">
        <select
          onChange={(e) => setIndex(parseInt(e.target.value, 10))}
          value={index}
          className="mt-1 form-select block pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
          {
            errors.map((error, i) => (
              <option key={i} value={i}>{error.kind}</option>
            ))
          }
        </select>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 flex flex-col bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Function
                      <span className="text-xs font-light text-gray-400">
                        Instruction Pointer
                      </span>
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Parent Directory
                      <div className="text-xs text-gray-400">
                      File
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Object File
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Line Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    errors[index]['what'][0]['stack'].map((issue, j) => (
                      <tr key={issue.fn} className={`${j%2==0?'bg-white':'bg-gray-50'}`}>
                        <td className="px-6 py-4 flex flex-col whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
                          { issue.fn }
                          <span className="text-gray-500 font-light font-mono">
                            { issue.ip }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          { issue.dir }
                          <div className="text-gray-500">
                          ⎣ { issue.file }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap truncate max-w-xs text-sm leading-5 text-gray-500">
                          { issue.obj}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          { issue.line }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
