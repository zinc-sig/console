import Link from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps {
  href: string
  children: React.ReactNode
}

function ActiveLink({ children, href }: ActiveLinkProps) {
  const router = useRouter();
  const semesterPrefixedUrl = `${router.query.semesterId&&!href.includes('admin')?`/semesters/${router.query.semesterId}${href}`:href}`

  const isActive = router.pathname===semesterPrefixedUrl;
  const baseClass='group flex items-center px-2 py-2.5 text-sm leading-5 font-medium rounded-md transition ease-in-out duration-150'
  const activeClass='text-gray-900 bg-gray-200 '
  const inactiveClass='text-gray-700 hover:text-gray-900 hover:bg-gray-50'
  return (
    <Link href={semesterPrefixedUrl}>
      <a 
        className={`${baseClass} ${isActive?activeClass:inactiveClass}`}>
        { children }
      </a>
    </Link>
  )
}

export default ActiveLink