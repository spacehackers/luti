import React from "react"
import classNames from "classnames"

import "./Page.scss"

const Page = props => {
  return (
    <div className={classNames("page", props.slug)}>
      <div className="wrapper">
        <h1>{props.title}</h1>
        <p>{props.children}</p>
      </div>
    </div>
  )
}
export default Page

