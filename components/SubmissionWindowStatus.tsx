
export function SubmissionWindowStatus({ closed }) {
  if (closed) {
    return (
      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-red-100 text-red-800">
        Closed
      </span>
    )
  } else {
    return (
      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-green-100 text-green-800">
        Open
      </span>
    )
  }
}