import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "@kunukn/react-collapse";

function GTestStatus({ allPassed }) {
  return (
    <span
      aria-label={allPassed?'All test cases passed':'One or more test cases have failed'}
      data-flow="right"
      className="ml-2"
    >
      <FontAwesomeIcon className={`${allPassed?'text-green-500':'text-red-500'}`} icon={['far', allPassed?'check':'times']}/>
    </span>
  )
}

function GTestTestStatus({ allPassed, name }) {
  return (
    <div className="flex">
      <div className="w-6">
        <FontAwesomeIcon className={`${allPassed?'text-green-500':'text-red-500'}`} icon={['far', allPassed?'check':'times']}/>
      </div>
      <span className="text-sm">{name}</span>
    </div>
  )
}

function GTestTestSuiteRowItem({ testsuite }) {

  const [expandTestCases, setExpand] = useState(false);
  const visibleTestCases = testsuite.testcases
                            .filter(
                              testcase => 
                                !(testcase.failures.length!==0 && testcase.failures.filter(failure => failure.category==='SKIPPED').length>0)
                            );
  return (
    <li className="my-2">
      <div className="flex items-center justify-between">
        <GTestTestStatus name={testsuite.displayName} allPassed={testsuite.errors+testsuite.failures===0}/>
        <span className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setExpand(!expandTestCases)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
            <FontAwesomeIcon icon={['far', 'chevron-right']} {...expandTestCases&&{ rotation: 90 }}/>
          </button>
        </span>
      </div>
      <Collapse isOpen={expandTestCases}>
        <ul>
          {
            visibleTestCases.map(testcase => (
              <div key={testcase.displayName} className="my-2 ml-4 flex items-center justify-between">
                <GTestTestStatus name={testcase.displayName} allPassed={testcase.failures.length===0}/>
                {/* <span className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setExpand(!expandTestCases)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
                    Details
                  </button>
                </span> */}
              </div>
            ))
          }
        </ul>
      </Collapse>
    </li>
  )
}

export function GTestStageReportView({ reports }) {
  const [viewingIndex, setViewingIndex] = useState(0);

  return (
    <div className="bg-white shadow rounded-lg border">
      <header className="bg-gray-100 w-full px-4 py-3 rounded-tl-lg rounded-tr-lg border-b flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium leading-5">
            GTest
            <GTestStatus allPassed={reports[viewingIndex]['isSuccess']}/>
          </h3>
          <h6 className="text-xs text-gray-600">Score:
            {
              reports[viewingIndex]['score']===null?0:(
                <span className="ml-1 font-medium">{reports[viewingIndex]['score']['score'].toFixed(1)}/{reports[viewingIndex]['score']['total']}</span>
              )
            }
          </h6>
        </div>
        <span
          className="bg-blue-400 w-10 h-10 rounded-full flex justify-center items-center shadow">
          <FontAwesomeIcon className="text-white" icon={['fad', 'tasks']}/>
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
        {
          reports[viewingIndex]['report']===null?(
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm leading-5 font-medium text-red-800">
                    An error ocurred during the execution of this stage
                  </h3>
                  <div className="mt-2 text-sm leading-5 text-red-700">
                    <ul className="list-disc pl-5">
                      <li>
                        The report for this stage is unavailable due to:
                      </li>
                      <li>
                        Automatic grader ran into a problem while running GTest
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ):(
            <ul>
              {
                reports[viewingIndex]['report']['testsuites'].map((testsuite) => (
                  <GTestTestSuiteRowItem
                    testsuite={testsuite}
                    key={testsuite.displayName}
                  />
                ))
              }
            </ul>
          )
        }
      </div>
    </div>
  )
}