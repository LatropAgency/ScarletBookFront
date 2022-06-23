import style from "../styles/SearchItem.module.scss";
import Box from "@mui/material/Box";
import classNames from "classnames";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import {TextField} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";

<BootstrapTabP  value={value} index={0}>
    <div className={style.section2} style={{margin: '5px 0'}}>
        <div className={style.container2} style={{margin: '5px 0'}}>
            <Box className={style.storyBlock}>
                {marks.map(map => {
                    return (
                        <div className={classNames(style.storyOne,map.orientation === 'get' ? style.forGet : map.orientation === 'slesh' ? style.forSlesh : style.forFem)}>
                            <div className={style.imageStory}><img
                                src={'http://localhost:9000/' + map.image}/></div>
                            <div className={style.descriptionStory}><h3
                                onClick={() => router.push('/story/' + map.id)}>{map.name}</h3>
                                <div className={style.likes}>
                                    {map.isActive ?
                                        <FavoriteIcon onClick={() => addLike(map.id)}
                                                      sx={{color: 'red', cursor: 'pointer'}}/> :
                                        <FavoriteIcon onClick={() => addLike(map.id)}
                                                      sx={{color: '#C9C9C9', cursor: 'pointer'}}/>}
                                    <div>{map.count}</div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: '0 8px 0 0'
                                    }}><ListIcon sx={{color: '#C9C9C9'}}/>
                                        <div>{map.chapters.length}</div>
                                    </div>
                                    <div className={style.status}>{map.status}</div>
                                </div>
                                <div className="descriptionSt">
                                    {map.description}
                                </div>
                                <div className={style.ganresStory}>
                                    <div>{map.genres.map(genre => genre.name)}</div>
                                </div>
                                <div className={style.readMark}>
                                    <button className={style.btn}
                                            onClick={() => router.push('/story/' + map.id)}>Читать
                                    </button>
                                    <BookmarkIcon onClick={() => addMark(map.id)} sx={{color: 'red'}}/>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Box>
        </div>
    </div>
</BootstrapTabP>

<Table sx={{minWidth: 700}} aria-label="customized table">
    <TableHead>
        <TableRow>
            <StyledTableCell>Название</StyledTableCell>
            <StyledTableCell>Описание</StyledTableCell>
            <StyledTableCell>Картинка</StyledTableCell>
            <StyledTableCell></StyledTableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {requests.map((row) => (
            <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                    {value === row.name ? <TextField inputRef={valueName} id="standard-basic" variant="standard" error defaultValue={row.name}/> : row.name}
                </StyledTableCell>
                <StyledTableCell>{value === row.name ? <TextField inputRef={valueDescription} id="standard-basic" variant="standard" error defaultValue={row.description}/> :row.description}</StyledTableCell>
                <StyledTableCell>{value === row.name ? <FileUploadIcon/> :<img style={{height: '100px', width: '100px', objectFit:'cover'}} src='https://picsum.photos/800/304/?random' alt=""/>}</StyledTableCell>
                <StyledTableCell>
                    {value !== row.name ?<EditIcon onClick={() => edit(row.name, row.description)}/>:<DoneIcon onClick={saveFields}/>}
                    <DeleteIcon onClick={() => handleClickOpen(row.user.id)}/>
                </StyledTableCell>
            </StyledTableRow>
        ))}
    </TableBody>
</Table>