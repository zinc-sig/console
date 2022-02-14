import React from "react";
import Head from "next/head";
import { UserDropdown, Navigation, Toolbar } from "../components/Navigation/Desktop";
import axios from "axios";
import { MobileMenuToggle, Mobile } from "../components/Navigation/Mobile";

interface LayoutProps {
  children?: React.ReactNode
  title: string
}

export function Layout({ children, title }: LayoutProps) {

  const uploadFile = async (e) => {
    const files = e.target.files;
    const form = new FormData();
    for(const file of files) {
      form.append('files', file, file.name);
    }
    try {
      const { data } = await axios({
        method: 'post',
        url: '/api/submission',
        data: form,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col">
        <Head>
          <title>{title} - ZINC</title>
        </Head>
        <header className="flex flex-shrink-0 h-14">
          <UserDropdown/>
          <div className="flex-1 flex items-center justify-between px-6 bg-cse-700">
            <nav className="flex">
              <a href="#" className="inline-block ml-2 bg-cse-800 rounded-md px-3 py-2 leading-none text-sm font-medium text-white">All</a>
            </nav>
            {/* <MobileMenuToggle/> */}
            <Toolbar/>
          </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <Navigation/>
          <main className="flex-1 flex bg-gray-200">
            { children }
          </main>
        </div>
      </div>
      <Mobile/>
    </>
  )
}