// @ts-nocheck
import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { padding } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import {Button, Dialog } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

const StyledAutocomplete = styled(Autocomplete)({
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
        // Default transform is "translate(14px, 20px) scale(1)""
        // This lines up the label with the initial cursor position in the input
        // after changing its padding-left.
        transform: "translate(34px, 20px) scale(1);",
    },
    "& .MuiAutocomplete-inputRoot": {
        color: "purple",
        // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
        '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
            // Default left padding is 6px
            paddingLeft: 26,
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "green",
            boxShadow: "#a01010 0px 0px 20px 0px",
            backgroundColor: "#e3e3e33d",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "red",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple",
        },
    },
});

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        Жанр
                    </Typography>
                </ListItem>
                <ListItem >
                    <TextField
                        error
                        id="standard-error"
                        variant="standard"
                    />
                </ListItem>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        Описание
                    </Typography>
                </ListItem>
                <ListItem >
                    <TextField
                        error
                        id="standard-error"
                        variant="standard"
                    />
                </ListItem>
                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <TextField/>
                </ListItem>
            </List>
        </Dialog>
    );
}

const StyledChip = styled(Chip)({
    '& .MuiChip-label':{
        padding: '6px!important'
    }
})

export default function FilterBar() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('hi');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };
    return (
        <Stack spacing={3} sx={{ width: "75%", margin: "auto" }}>
            <Box
                sx={{
                    backgroundColor: "#e3e3e33d",
                    borderRadius: "10px",
                    padding: "0.5em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}
            >
                <Chip
                    label="Романтика"
                    component="a"
                    href="#basic-chip"
                    clickable
                    style={{ margin: "1em" }}
                />
                <Chip
                    label="Приключения"
                    component="a"
                    href="#basic-chip"
                    clickable
                    style={{ margin: "0.2em", boxShadow: "#a01010 0px 0px 15px 0px" }}
                />
                <Chip
                    label="Ужасы"
                    component="a"
                    href="#basic-chip"
                    clickable
                    style={{ margin: "1em" }}
                />
                <Chip
                    label="Трейлер"
                    component="a"
                    href="#basic-chip"
                    clickable
                    style={{ margin: "0.2em", boxShadow: "#a01010 0px 0px 15px 0px" }}
                />
                <Chip
                    label="Канон"
                    component="a"
                    href="#basic-chip"
                    clickable
                    style={{ margin: "1em" }}
                />
                <Chip
                    label="Детектив"
                    component="a"
                    href="#basic-chip"
                    clickable
                    style={{ margin: "0.2em", boxShadow: "#a01010 0px 0px 15px 0px" }}
                />
                <StyledChip
                    onClick={handleClickOpen}
                      clickable
                      style={{ margin: "0.3em"}}
                      icon={<AddIcon/>}/>
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />
            </Box>
        </Stack>
    );
}
