import React from "react"
import { Drawer, Logo } from "epfl-elements-react"
import {UserAuthInfo} from "/imports/ui/components/UserAuthInfo";

export function PhDHeader() {
  return (
    <header role="banner" className="header">
      <Drawer contents={{link: "https://www.epfl.ch", anchor: "Go to main site"}} />
      <Logo />
      <nav className='ml-auto'>
        <UserAuthInfo />
      </nav>
    </header>
  )
}
