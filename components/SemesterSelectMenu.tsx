import { Fragment, useState } from "react";
import Link from "next/link";
import { Menu, Transition } from '@headlessui/react'
import { useZinc } from "../contexts/zinc";
import { useRouter } from "next/router";
import { SelectorIcon } from '@heroicons/react/solid'

interface Semester {
  id: number
  name: string
}

interface SemesterSelectMenuProps {
  semesters: Semester[]
}

function SelectMenu({ semesters=[] }: SemesterSelectMenuProps) {
  const { currentSemester, activeSemester } = useZinc();
  const [showMenu, setShowMenu] = useState(false);
  const [dismissInterrupted, setDismissInterrupt] = useState(false);
  const router = useRouter();
  const toggleSelectMenu = () => {
    setTimeout(() => {
      if(!dismissInterrupted) {
        setShowMenu(!showMenu);
      }
    }, 10);
  }

  return (
    <div className="space-y-3">
      <label id="listbox-label" className="block text-xs leading-5 font-semibold text-gray-700 uppercase tracking-wider">
        Semester
      </label>
      <div className="relative">
        <Menu>
          <Menu.Button aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
              className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <span className="block truncate">
                { semesters.find(semester => semester.id===activeSemester)?.name }
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className="h-5 w-5 text-gray-400"></SelectorIcon>              
            </span>
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="absolute mt-1 w-52 rounded-md bg-white shadow-lg"
          >
              <Menu.Items as="ul"
                role="listbox"
                aria-labelledby="listbox-label"
                aria-activedescendant="listbox-item-3"
                className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                {
                  semesters.map((semester) => (
                    <MenuOption
                      key={semester.id}
                      title={semester.name}
                      href={semester.id===currentSemester?`/${router.pathname.replace('/semesters/[semesterId]', '')}`:`/semesters/${semester.id}${router.pathname.replace('/semesters/[semesterId]', '')}`}
                      selected={semester.id===activeSemester}
                    />
                  ))
                }
              </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

interface MenuOptionProps {
  title: string
  href: string
  selected: boolean
}

function MenuOption ({ title, selected, href }: MenuOptionProps) {
  const [highlighted, setHighlighted] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <Menu.Item as="li"
      id="listbox-option-0"
      role="option"
      className={`${highlighted?'text-white bg-cse-600':'text-gray-900'} cursor-pointer select-none relative py-2 pl-3 pr-9`}>
        <Link href={href.includes('//')?href.replace('//', '/'):href}>
          <span className={`${selected?'font-semibold':'font-normal'} block truncate transition duration-150 ease-in-out`}>
            { title }
          </span>
        </Link>

        {
          selected && (
            <span className={`${highlighted?'text-white':'text-cse-600'} absolute inset-y-0 right-0 flex items-center pr-4`}>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )
        }
      </Menu.Item>
    </div>
  )
}

export default SelectMenu;