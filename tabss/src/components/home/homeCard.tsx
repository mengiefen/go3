import { Button, Grid, Paper, Typography } from "@mui/material"

const HomeCard = ({
  cardText,
  buttonText,
  action
}: {
  cardText: string;
  buttonText: string;
  action: () => void;
}) => {

  return (
    <Grid size={4}>
      <Paper elevation={3} sx={{ minHeight: "300px", p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="body1">{cardText}</Typography>
        <Button variant="contained" onClick={action}>{buttonText}</Button>
      </Paper>
    </Grid>
  )
}

export default HomeCard