import React from "react"
import axios from "axios"
import PlaceTable from "./PlaceTable"
import TopKeywordTable from "./TopKeywordTable"
import Paper from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import InputBase from "@material-ui/core/InputBase"
import Divider from "@material-ui/core/Divider"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import { PlaceDetail } from "./props/PlaceDetail"
import { TopKeyword } from "./props/TopKeyword"
import jwt_token from "jwt-decode"
import {path} from "ramda"

const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: 5,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}

interface PlaceProps {
  accessToken: string,
  refreshToken: string,
  setNewToken: Function,
}
interface PlaceState {
  keyword: string,
  page: number,
  size: number,
  totalCount: number,
  data: Array<PlaceDetail>,
  topKeyword: Array<TopKeyword>,
}

class Place extends React.Component<PlaceProps, PlaceState> {
  constructor(props) {
    super(props)
    this.state = {
      keyword: "",
      page: 1,
      totalCount: 0,
      size: 5,
      data: null,
      topKeyword: null,
    }
  }
  intervalID = null

  componentDidMount () {
    this.getTopKeyword()
    this.intervalID = setInterval(this.getTopKeyword, 10000)
  }
  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  changePage = (page) => this.searchPlace(this.state.keyword, page, this.state.size)
  changeSizePerPage = (size) => this.searchPlace(this.state.keyword, 1, size)

  searchPlace = async (keyword, page, size) => {
    await this.checkAndIssueNewAccessToken()
    const response = await axios.get("http://localhost:8080/place/keyword", {params: {keyword, page, size}, headers: {"Authorization": "Bearer " + this.props.accessToken}})

    this.setState({data: path(["data","documents"], response) || [], page, size, totalCount: path(["data","totalCount"], response) || 0})
  }

  getTopKeyword = async () => {
    await this.checkAndIssueNewAccessToken()
    const response = await axios.get("http://localhost:8080/place/keyword/top", {headers: {"Authorization": "Bearer " + this.props.accessToken}})
    if (path(["data", "documents"])) {
      this.setState({topKeyword: response.data.documents})
    }
  }

  checkAndIssueNewAccessToken = async () => {
    const encodedAccessToken = jwt_token(this.props.accessToken)
    const expTime = (Date.now() / 1000)
    if (encodedAccessToken.exp > expTime) return

    const response = await axios.get("http://localhost:8080/member/token/access", { headers: {"Authorization": "Bearer " + this.props.refreshToken}})
    if (path(["data", "accessToken"], response)) {
      this.props.setNewToken(response.data.accessToken)
    }
  }
  
  render() {
    return (
      <div style={{flex: 1, marginTop: 100}}>
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="flex-start">
          <Box flexDirection="column" >
            <Box m={5}>
              <Paper component="div" style={styles.root}>
                <InputBase
                  style={styles.input}
                  onChange={(event) => this.setState({keyword: event.target.value})}
                  onKeyDown={(event) => {if (event.keyCode != 13) return; this.searchPlace(this.state.keyword, 1, this.state.size)}}
                  placeholder="장소 검색"
                  inputProps={{ "aria-label": "장소 검색", maxLength: 50 }}
                />
                <IconButton onClick={() => this.searchPlace(this.state.keyword, 1, this.state.size)} style={styles.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <Divider style={styles.divider} orientation="vertical" />
              </Paper>
            </Box>
            <Box maxWidth={500} m={5} bgcolor="background.paper">
              <TopKeywordTable topKeyword={this.state.topKeyword}/>
            </Box>
          </Box>
          <Box justifyContent="center" m={5} bgcolor="background.paper">
            <PlaceTable
              data={this.state.data}
              page={this.state.page}
              size={this.state.size}
              totalCount={this.state.totalCount}
              changePage={this.changePage}
              changeSizePerPage={this.changeSizePerPage}
            />
          </Box>

          <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-end">
            <Button variant="contained" color="secondary" onClick={() => this.props.setNewToken("", "")}>
              로그아웃
            </Button>
          </Box>
        </Box>
      </div>
    )
  }
}
export default Place