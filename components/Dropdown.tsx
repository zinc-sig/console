import React, { useState, useContext } from "react";
import { Transition } from "@headlessui/react";

interface DropdownContextState {
  display: boolean
  toggleDropdown: () => void
}

interface DropdownProps {
  children: JSX.Element
  trigger: JSX.Element
  className: string
}

const DropdownContext = React.createContext({} as DropdownContextState);

export const useDropdown = () => useContext(DropdownContext);

export function Dropdown ({ children, trigger, className }: DropdownProps) {
  const [display, setDisplay] = useState(false);
  const [dismissInterrupted, setDismissInterrupt] = useState(false);

  const toggleDropdown = () => {
    setTimeout(() => {
      if(!dismissInterrupted) {
        setDisplay(!display);
      }
    }, 0)
  }

  return (
    <DropdownContext.Provider value={{
      display,
      toggleDropdown
    }}>
      { trigger }
      <Transition
        show={display}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className={className}
        onMouseOver={() => { setDismissInterrupt(true)}}
        onMouseOut={() => setDismissInterrupt(false)}
        onBlur={() => { toggleDropdown()}}
      >
        { children }
      </Transition>
    </DropdownContext.Provider>
  )
}
