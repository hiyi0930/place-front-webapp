import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { PlaceDetail } from './props/PlaceDetail';


interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{flexShrink: 0, marginLeft: theme.spacing(2.5)}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

interface PlaceProps {
  data: Array<PlaceDetail>,
  page: number,
  totalCount: number,
  size: number,
  changePage: Function,
  changeSizePerPage: Function
}
interface PlaceState {
}
export default class PlaceTable extends React.Component<PlaceProps, PlaceState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  render () {
    const page = this.props.page - 1
    const size = this.props.size
    const data = this.props.data || []
    const emptyRows = size - data.length
    return (
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.placeId}>
                <TableCell style={{ width: 300 }} component="th" scope="row">
                  <h2>{row.placeName}</h2>
                  <div>
                    <p style={{fontSize: "14px"}}>{row.roadAddressName}</p>
                    <p style={{fontSize: "12px", color: "#919191"}}>(지번){row.addressName}</p>
                  </div>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <p style={{color: "#288756", fontSize: "15px"}}>{row.phone}</p>
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  <a href={"https://place.map.kakao.com/" + row.placeId} data-id="moreview" style={{color: "#3d75cc", fontSize: "15px"}} target="_blank">상세보기</a>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                colSpan={3}
                count={this.props.totalCount}
                rowsPerPage={size}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={(event, page) => this.props.changePage(page + 1)}
                onChangeRowsPerPage={(event) => this.props.changeSizePerPage(parseInt(event.target.value))}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    )
  }
}
