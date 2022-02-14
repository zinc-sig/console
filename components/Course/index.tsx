import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useZinc } from "../../contexts/zinc";
import { GET_TEACHING_COURSES } from "../../graphql/queries/user";


export function Courses() {
  const { activeSemester, user } = useZinc();
  const { data, loading , error} = useQuery(GET_TEACHING_COURSES, {
    variables: {
      userId: user,
      semesterId: activeSemester
    }
  });
  // console.log(data, error)
  if(loading) {
    return <div>loading</div>;
  }
  return (
    data.user.courses.map(({ course }) => (
      <Link href={`/courses/${course.id}`} key={course.id}>
        <a>
          <CourseCard course={course} key={course.code}/>
        </a>
      </Link>
    ))
  )
}

export function CourseCard({ course }) {
  return (
    <li className="col-span-1 bg-white rounded-lg shadow">
      <div className="w-full flex items-center justify-between p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-gray-900 text-base leading-5 font-medium">{course.code}</h3>
          </div>
          <p className="mt-1 text-gray-500 text-sm leading-5">{course.name}</p>
        </div>
      </div>
    </li>
  )
}