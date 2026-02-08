import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Layout from "./components/layout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

export default App;