import React from "react"
import Paper from "@material-ui/core/Paper"
import { TopKeyword } from "./props/TopKeyword"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


interface TopKeywordProps {
  topKeyword: Array<TopKeyword>
}
interface TopKeywordState {
}
export default class TopKeywordTable extends React.Component<TopKeywordProps, TopKeywordState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    if (this.props.topKeyword == null || this.props.topKeyword.length < 1) return (null)
    return (
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row"><h3>인기검색어 Top 10</h3></TableCell>
              <TableCell style={{ width: 100 }} align="center"><h3>검색 수</h3></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.topKeyword.map((row) => (
              <TableRow key={row.keyword}>
                <TableCell component="th" scope="row">
                  {row.keyword}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}