import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#000000' },
        secondary: { main: '#dd1356' },
        error: { main: '#dd1356' },
        action: { active: '#ff000' },
    },
});

export default theme;