import { HashRouter, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeControllerProvider } from "./components/theme/themeContext";
import Home from "./components/home";
import Header from "./components/header";
import { Box } from "@mui/material";

function App() {

  return (
    <HashRouter>
      <ThemeControllerProvider>
        <Provider store={store}>
            <Header />
            <Box padding={2}>
            <Routes>
              <Route index path="/" element={<Home/>}/>
              <Route path="/*" element={<>not found</>} />
            </Routes>
          </Box>
        </Provider>
      </ThemeControllerProvider>
    </HashRouter>
  )
}

export default App
