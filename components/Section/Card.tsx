import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function Sections({ sections }) {
  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Course Sections</h2>
      {
        sections.length>0 && (
          <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            { sections.map((section, i) => (
              <SectionCard key={section.name} section={section} index={i}/>
            ))}
          </ul>
        )
      }
      {
        sections.length===0 && (
          <div className="w-full h-44 bg-gray-100 flex flex-col mt-4 justify-center items-center rounded-md">
            <FontAwesomeIcon className="text-gray-400 mb-4" icon={['fad', 'users-class']} size="3x"/>
            <h3 className="font-medium text-gray-600">No Sections Assigned</h3>
            <p className="text-sm text-gray-500">System will perform enrollment record syncing from CS System everyday at midnight.</p>
          </div>
        )
      }
    </div>
  )
}

export function SectionCard({ section, index }) {
  return (
    <li className="col-span-1 flex shadow-sm rounded-md">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-16 bg-section-${index} text-white text-sm leading-5 font-medium rounded-l-md`}>
        { section.name }
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm leading-5 truncate">
          <Link href="/">
            <a className="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150"></a>
          </Link>
          <p className="text-gray-500">{section.users_aggregate.aggregate.count} Students</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  )
}