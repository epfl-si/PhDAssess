import React from "react";
import {matchPath, useLocation, Link} from "react-router";


type BreadcrumbItem = {
  link: string,
  anchor: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  return <>
    <div className="breadcrumb-container">
      <nav aria-label="breadcrumb" className="breadcrumb-wrapper">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" style={ { marginRight: '0.4em' } }><a href="https://www.epfl.ch" target="_blank">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={ "#icon-home" }>
                <svg id="icon-home" viewBox="0 0 11 12">
                  <path d="M0 5l5.25-5 5.25 5v7H0z" fill-rule="evenodd"></path>
                </svg>
              </use>
            </svg>
          </a></li>
          { items.map(item =>
              <li
                style={ { marginRight: '0.4em' } }
                className="breadcrumb-item">
                <Link to={ item.link }>{ item.anchor }</Link>
              </li>
            )
          }
        </ol>
      </nav>
    </div>
  </>
}

export function PhDBreadcrumb() {
  const breadcrumbs = [
    { link: "https://www.epfl.ch/education/phd/", anchor: "Doctoral School" },
    { link: "/", anchor: "Annual Report" }
  ]

  const { pathname } = useLocation()

  matchPath("/", pathname) && breadcrumbs.push({ link: "/", anchor: "Tasks list" })
  matchPath("tasks/*", pathname) && breadcrumbs.push({ link: "/", anchor: "Tasks" }) && breadcrumbs.push({ link: pathname, anchor: "Proceeding" })
  matchPath("/dashboard", pathname) && breadcrumbs.push({ link: "/dashboard", anchor: "Tasks dashboard" })
  matchPath("/doctoral-programs", pathname) && breadcrumbs.push({ link: "/doctoral-programs", anchor: "Doctoral programs administration" })
  matchPath("/import-scipers", pathname) && breadcrumbs.push({ link: "/import-scipers", anchor: "Import scipers" })

  return <Breadcrumbs items={ breadcrumbs }/>
}
