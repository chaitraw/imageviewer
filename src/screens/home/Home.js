import React, { Component } from 'react';
import { Grid, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Header from '../../common/header/Header';
import profileImage from "../../assets/upgrad.svg"
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite';
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom'

import "./Home.css";

const styles = (theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },

    grid: {
        padding: "20px",
        "margin-left": "10%",
        "margin-right": "10%",
    },

    card: {
        maxWidth: "100%",
    },

    media: {
        height: "56.25%",
        width: "100%",
    },

    avatar: {
        margin: 10,
        width: 60,
        height: 60,
    },

    title: {
        'font-weight': '600',
    },

    addCommentBtn: {
        "margin-left": "15px",
    },

    comment: {
        "flex-direction": "row",
        "margin-top": "25px",
        "align-items": "baseline",
        "justify-content": "center",
    },

    commentUsername: {
        fontSize: "inherit"
    }

}));

class Home extends Component {


    constructor() {
        super()
        this.state = {
            images: [],
            comments: [],
            profile_picture: "",
            userName: "",
            commentText: "",
            searchOn: false,
            originalImageArr: {},
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            accessToken: sessionStorage.getItem("access-token"),
            count: 1,
        };
    }

    //Method to collect data from all the APIs provided
    UNSAFE_componentWillMount() {

        //Get the profile details of the user when he/she is logged in
        let that = this;
        if (this.state.isLoggedIn) {
            let data = null;
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    that.setState({
                        profile_picture: JSON.parse(this.responseText).data.profile_picture,
                        userName: JSON.parse(this.responseText).data.username

                    });
                };
            });
            xhr.open("GET", this.props.baseUrl + "?access_token=" + that.state.accessToken);
            xhr.send(data);
        }

        // Get all images data when user is Logged in
        if (this.state.isLoggedIn) {
            let xhrImages = new XMLHttpRequest();
            xhrImages.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {

                    let imageArr = JSON.parse(this.responseText).data

                    imageArr.forEach(element => {
                        var date = parseInt(element.created_time, 10);
                        date = new Date(date * 1000);
                        element.created_time = date.toLocaleString()

                    });

                    that.loadHomePage(imageArr);

                }
            })
            xhrImages.open("GET", this.props.baseUrl + "media/recent?access_token=" + that.state.accessToken);
            xhrImages.send();
        }
    }

    onCommentTextChangeHandler = (event, imageId) => {
        var comment = {
            id: imageId,
            text: event.target.value,
        }
        this.setState({
            ...this.state,
            commentText: comment,
        });
    }

    onClickAddButtonHandler = (imageId) => {
        var count = this.state.count
        var comment = {
            id: count,
            imageId: imageId,
            username: this.state.userName,
            text: this.state.commentText.text,
        }
        count++;
        var comments = [...this.state.comments, comment];
        this.setState({
            ...this.state,
            count: count,
            comments: comments,
            commentText: "",
        })
    }

    loadHomePage = (imageArr) => {
        this.setState({
            ...this.state,
            images: imageArr
        });
    }

    likeButtonClickHandler = (imageId) => {
        var i = 0
        var imageArray = this.state.images
        for (i; i < imageArray.length; i++) {
            if (imageArray[i].id === imageId) {
                if (imageArray[i].user_has_liked === true) {
                    imageArray[i].user_has_liked = false;
                    imageArray[i].likes.count--;
                    this.setState({
                        images: imageArray
                    });
                    break;
                }
                else {
                    imageArray[i].user_has_liked = true;
                    imageArray[i].likes.count++;
                    this.setState({
                        images: imageArray
                    });
                    break;
                }
            }
        }
    };

    onSearchTextChangeHandler = (keyword) => {
        if (!(keyword === "")) {
            var originalImageArr = [];
            this.state.searchOn ? originalImageArr = this.state.originalImageArr : originalImageArr = this.state.images;
            var updatedImageArr = [];
            var searchOn = true;
            keyword = keyword.toLowerCase();
            originalImageArr.forEach((element) => {
                var caption = element.caption.text.split("\n")[0];
                caption.toLowerCase();
                if (caption.includes(keyword)) {
                    updatedImageArr.push(element);
                }
            })

            if (!this.state.searchOn) {
                this.setState({
                    ...this.state,
                    searchOn: searchOn,
                    images: updatedImageArr,
                    originalImageArr: originalImageArr,

                })
            }
            else {
                this.setState({
                    ...this.state,
                    images: updatedImageArr
                })
            }
        }
        else {
            searchOn = false
            this.setState({
                ...this.state,
                searchOn: searchOn,
                images: this.state.originalImageArr,
                originalImageArr: [],
            })
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Header profile_picture={this.state.profile_picture} showSearchBox={this.state.isLoggedIn ? true : false} showProfileIcon={this.state.isLoggedIn ? true : false} onSearchTextChangeHandler={this.onSearchTextChangeHandler} showMyAccount={true} />
                {this.state.isLoggedIn === true ?
                    <div className="flex-container">
                        <Grid container spacing={3} wrap="wrap" alignContent="center" className={classes.grid}>
                            {this.state.images.map(image => (
                                <Grid key={image.id} item xs={12} sm={6} className="grid-item">
                                    <Card className={classes.card}>
                                        <CardHeader
                                            classes={{
                                                title: classes.title,
                                            }}
                                            avatar={
                                                <Avatar src={image.caption.from.profile_picture} className={classes.avatar}></Avatar>
                                            }
                                            title={image.caption.from.username}
                                            subheader={image.created_time}
                                            className={classes.cardheader}
                                        />

                                        <CardContent>
                                            <img src={image.images.standard_resolution.url} alt={profileImage} className={classes.media} />
                                            <div className="horizontal-rule"></div>
                                            <div className="image-caption">
                                                {image.caption.text.split("\n")[0]}
                                            </div>
                                            <div className="image-hashtags">
                                                {image.caption.text.split("\n")[1]}
                                            </div>
                                            <div>
                                                <IconButton className="like-button" aria-label="like-button" onClick={() => this.likeButtonClickHandler(image.id)}>
                                                    {image.user_has_liked ? <FavoriteIcon className="image-liked-icon" fontSize="large" /> : <FavoriteBorderIcon className="image-like-icon" fontSize="large" />}
                                                </IconButton>

                                                {image.likes.count === 1 ?
                                                    <span>
                                                        {image.likes.count} like
                                                </span>
                                                    : <span>
                                                        {image.likes.count} likes
                                                </span>
                                                }
                                            </div>
                                            {this.state.comments.map(comment => (

                                                image.id === comment.imageId ?
                                                    <div className="comment-display" key={comment.id}>
                                                        <Typography variant="subtitle2" className={classes.commentUsername} gutterbottom="true" >
                                                            {comment.username}:
                                                        </Typography>
                                                        <Typography variant="body1" className="comment-text" gutterbottom="true">
                                                            {comment.text}
                                                        </Typography>
                                                    </div>
                                                    : ""

                                            ))}

                                            <FormControl className={classes.comment} fullWidth={true}>
                                                <InputLabel htmlFor="comment" >Add a comment</InputLabel>
                                                <Input id="comment" className="comment-text" name="commentText" onChange={(event) => this.onCommentTextChangeHandler(event, image.id)} value={image.id === this.state.commentText.id ? this.state.commentText.text : ""} />
                                                <Button variant="contained" color="primary" className={classes.addCommentBtn} onClick={() => this.onClickAddButtonHandler(image.id)}>
                                                    ADD
                                                </Button>
                                            </FormControl>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                    : <Redirect to="/" />
                }
            </div>
        )
    }
}

export default withStyles(styles)(Home);