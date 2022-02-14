import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FileStructureValidationStageReport {
  isMatched: boolean
  stderr: Array<string>
  missingPaths: Array<string>
  extraPaths: Array<string>
}

export function FileStructureValidationStageReportView({ reports }) {
  const [viewingIndex, setViewingIndex] = useState(0);

  return (
    <div className="bg-white shadow rounded-lg border">
      <header className="bg-gray-100 w-full px-4 py-3 rounded-tl-lg rounded-tr-lg border-b flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium leading-5">
            File Structure Validation
            <span
              aria-label={reports[viewingIndex].isMatched?'Submission matches with specification':'Submission does not match with specification'}
              data-flow="up"
              className="ml-2"
            >
              <FontAwesomeIcon className={`text-${reports[viewingIndex].isMatched?'green':'red'}-500`} icon={['far', reports[viewingIndex].isMatched?'check':'times']}/>
            </span>
          </h3>
          <h6 className="text-xs text-gray-600">Checks if the submitted filename tree follows specification</h6>
        </div>
        <span
          aria-label={reports[viewingIndex].toolName}
          data-flow="left"
          className="bg-yellow-300 w-10 h-10 rounded-full flex justify-center items-center shadow">
          <FontAwesomeIcon className="text-white" icon={['fad', 'folder-tree']}/>
        </span>
      </header>
      <div className="px-4 py-3 flex flex-col justify-between">
        <div>
          <nav className="flex items-center">
            <a className="px-3 py-1 flex-shrink font-medium text-xs tracking-widest uppercase leading-5 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:bg-gray-200">
              Info
            </a>
            <a className="ml-4 px-3 py-1.5 font-medium text-xs tracking-widest uppercase leading-5 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 focus:bg-gray-200">
              Stderr
            </a>
          </nav>
        </div>
        {/* <div className="my-4 rounded-md bg-gray-700 border p-3 text-white font-mono max-h-32 overflow-y-auto">
        { reports[viewingIndex].stderr.map(line => (
          <p>{line}</p>
        )) }
        </div> */}
        <div className="my-4">
          <div>
            {
              reports[viewingIndex].extraPaths.length > 0 && (
                <>
                  <label htmlFor="" className="font-medium text-sm">
                    Extra Files:
                  </label>
                  <ul>
                    {
                      reports[viewingIndex].extraPaths.map(path => (<li key={path}>{path}</li>))
                    }
                    
                  </ul>
                </>
              )
            }
            {
              reports[viewingIndex].extraPaths.length===0 && (
                <span className="font-medium text-sm text-gray-700">
                  <FontAwesomeIcon className="text-green-500 mr-2" icon={['far', 'check']}/>
                  No extra files found
                </span>
              )
            }
          </div>
          <div>
            {
              reports[viewingIndex].missingPaths.length > 0 && (
                <>
                  <label htmlFor="" className="font-medium text-sm">
                    Missing Files:
                  </label>
                  <ul>
                    {
                      reports[viewingIndex].missingPaths.map(path => (<li key={path}>{path}</li>))
                    }
                  </ul>
                </>
              )
            }
            {
              reports[viewingIndex].extraPaths.length===0 && (
                <span className="font-medium text-sm text-gray-700">
                  <FontAwesomeIcon className="text-green-500 mr-2" icon={['far', 'check']}/>
                  All required files are submitted
                </span>
              )
            }
          </div>
        </div>
        <div>
          <span className="relative z-0 inline-flex shadow-sm">
            <button
              onClick={() => setViewingIndex(viewingIndex===0?viewingIndex:viewingIndex-1)}
              type="button"
              className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Previous">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewingIndex(viewingIndex===(reports.length-1)?viewingIndex:viewingIndex+1)}
              type="button"
              className="-ml-px relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Next">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}