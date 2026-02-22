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
          <button onClick={() =>{ 
            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              "user": {
                "email": "andycole@test.com",
                "password": "AAAaaa@123"
              }
            });

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow"
            };

            fetch("http://localhost:5000/users/sign_in", requestOptions)
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.error(error));

          } }>SIGN IN</button>

          <button onClick={() =>{ 
            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              "user": {
                "email": "andycole@test.com"
              }
            });

            const requestOptions = {
              method: "DELETE",
              headers: myHeaders,
              body: raw,
              redirect: "follow"
            };

            fetch("http://localhost:5000/users/sign_out", requestOptions)
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.error(error));

          } }>SIGN OUT</button>
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
