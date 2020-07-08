import React, { useState } from 'react'
import axios from "axios"
import qs from "qs"
import { Redirect } from 'react-router-dom'
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import {path} from "ramda"

function Login({accessToken, setLoginToken}) {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")

  if (accessToken) return <Redirect to={{pathname: "/"}} />;

  return (
    <div className="App">
        <div style={{marginTop: 200}}>
          <div>
              <TextField variant={"outlined"} label={"아이디"} value={userId} onChange={e => setUserId(e.target.value)} inputProps={{maxLength: 30}}/>
          </div>
          <div style={{marginTop: 10}}>
            <TextField variant={"outlined"} type={"password"}label={"비밀번호"} value={password} onChange={e => setPassword(e.target.value)} inputProps={{maxLength: 30}}/>
          </div>
          <div style={{marginTop: 10}}>
            <Button variant={"contained"} color={"primary"} onClick={() => checkLogin(userId, password, setLoginToken)}>
              로그인
            </Button>
          </div>
        </div>
    </div>
  );
}
async function checkLogin(loginId: String, password: String, setAccessToken: Function) {
  try {
    const response = await axios.post("http://localhost:8080/member/login", qs.stringify({loginId, password}))
    if (!path(["data", "accessToken"], response)) {
      return alert(path(["data", "resultMessage"], response) || "잠시 후 다시 시도해 주세요.")
    }
    setAccessToken(response.data.accessToken, response.data.refreshToken)
  } catch(ex) {
    return alert("잠시 후 다시 시도해 주세요.")
  }
}
export default Login;
