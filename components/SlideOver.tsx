import { useLayoutState } from "../contexts/layout";
import { Transition } from "@headlessui/react";

interface SlideOverProps {
  children: React.ReactNode
}

export function SlideOver({ children }: SlideOverProps) {
  const { showSlideOver } = useLayoutState();
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 overflow-hidden">
        <section className="absolute inset-y-0 pl-16 max-w-full right-0 flex">
          <Transition
            show={showSlideOver}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
            className="w-screen max-w-md pointer-events-auto"
          >
            { children }
          </Transition>
        </section>
      </div>
    </div>
  )
}