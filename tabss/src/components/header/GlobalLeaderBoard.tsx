import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { useGetLeaderboardQuery } from '../../redux/api/gameResult';

// Sort highest → lowest score

const GlobalLeaderBoard = () => {
  const {data} = useGetLeaderboardQuery()
  if (!data) return;
  const sortedData = data.map((val)=> ({
    playerName: val.username,
    dataset: val.datasetName,
    score: val.score
  })).sort(
    (a, b) => b.score - a.score
  );
  return (
    <TableContainer component={Paper} elevation={1} sx={{paddingRight:"20px"}}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Leaderboard
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Dataset</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={`${row.playerName}-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.playerName}</TableCell>
              <TableCell>{row.dataset}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GlobalLeaderBoard;
