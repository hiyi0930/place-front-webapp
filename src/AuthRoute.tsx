import React from "react"
import { Route, Redirect } from "react-router-dom"

function AuthRoute({ accessToken, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        accessToken ? (
            render(props)
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  )
}

export default AuthRoute