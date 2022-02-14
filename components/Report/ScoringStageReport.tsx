import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function ScoringStageView ({ report }) {
  console.log(report)
  const [viewingIndex, setViewingIndex] = useState(0)

  return (
    <div className="bg-white shadow rounded-lg border py-3">
      <header className="w-full px-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium leading-5">
            Total Score
          </h3>
          <h6 className="text-xs text-gray-600"></h6>
        </div>
        <span
          className="font-medium text-lg">
          {report['score']}/{report['maxTotal']}
        </span>
      </header>
    </div>
  )
}