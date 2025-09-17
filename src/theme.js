import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#283593" },
    secondary: { main: "#43a047" },
    background: { default: "#f4f6fb" }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } }
  },
  typography: {
    fontFamily: [
      'Inter', 'Segoe UI', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'
    ].join(','),
  }
});

export default theme;