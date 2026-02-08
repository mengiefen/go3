import { Box } from "@mui/material";
import TopBar from "./TopBar";

const Layout = () => {

  return (
    <Box sx={{ display: "flex", width: '100vw', height: '100vh', bgcolor: 'whitesmoke' }}>
      <TopBar />
    </Box>
  );
};

export default Layout;
