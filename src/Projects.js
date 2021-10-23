import React, { Component } from 'react';
import axios from 'axios';
import stage_config from './config';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';

import DeleteIcon from '@mui/icons-material/Delete';

import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import ProjectForm from './ProjectForm';


const useStyles = theme => ({
    site: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        width: '600px',
        backgroundColor: 'lightgray',
    },

    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'black',
    },

    background: {
        // backgroundColor: 'black',
    },

    text: {
        whiteSpace: 'pre-line',
    },

    root: {
        height: '100%',


    },

    breit: {
        width: '568px',
    },

    parentFlexRight: {
        display: "flex",
        justifyContent: "flex-end"
    },

    button: {
        backgroundColor: 'gray',
    }
    
});

var axiosInstance = axios.create({
    // baseURL: stage_config.apiGateway.URL
});

axiosInstance.interceptors.request.use(
    config => {
        const token = window.accessToken ? window.accessToken : 'dummy_token';
        config.headers['Authorization'] = 'Bearer ' + token;
        return config;
    },
    error => {
        Promise.reject(error)
    });

axiosInstance.interceptors.response.use((response) => {
    return response
}, function (error) {
    return Promise.reject(error);
});

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            projectList: [{}],
            isLoaded: true,
        };
    }

    componentDidMount() {
        axiosInstance.get(stage_config.apiGateway.URL + '/test2')
            .then(res => res.data)
            .then(
                (result) => {
                    if ("error" in result) {
                        this.setState({
                            error: { message: result.error },
                        });
                    } else {
                        console.log(result);
                        this.setState({
                            projectList: result,
                            isLoaded: false
                        });
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    createList(projectList) {
        const { classes } = this.props;
        let projectListHtml = [];

        // alert(JSON.stringify(projectList, null, "  "));

        for (let i = 0; i < projectList.length; i++) {
            console.log(projectList[i].title);

            var videoHtml = ""
            if (projectList[i].video) {
                videoHtml = <CardContent><iframe width="560" height="315" src={projectList[i].video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br /></CardContent>;
            }

            projectListHtml.push(
                // <li key={i}>
                <Card className={classes.site} key={i}>
                    <CardHeader title={projectList[i].title} />
                    <CardContent>
                        <span className={classes.text}>{projectList[i].text}</span>
                    </CardContent>
                    {videoHtml}
                    <CardContent className={classes.breit}>
                        <span>Website: <a href={projectList[i].url}>{projectList[i].url}</a></span><br />
                        <span>Contact: {projectList[i].contact.join(', ')}</span>
                    </CardContent>
                    <CardActions className={classes.breit +' '+ classes.parentFlexRight} >
                        <Button size="small" variant="outlined" color="primary">Edit</Button>
                        <Button size="small" variant="outlined" color="secondary" startIcon={<DeleteIcon />}>Delete</Button>
                    </CardActions>
                </Card>
                // </li>
            );
        }
        return projectListHtml;
    }

    render() {
        const { projectList, error, isLoaded } = this.state;
        const { classes } = this.props;

        if (error) {
            return <div >
                Error: {error.message}
            </div>;
        }

        if (isLoaded) {
            return <div >
                Loading...
            </div>;
        }

        if (projectList) {
            console.log("project, userdata: ", this.props.keycloak);
            return (

                <div className={classes.container +' '+ classes.background}>
                    <Card className={classes.site}>
                        <CardHeader title="IOT Project Overview" />
                        <CardContent>
                            <span className={classes.text}>Hey {this.props.keycloak.idTokenParsed.given_name} welcome on the Project overview page.<br></br>
                                Here you can find some IOT projects, or add a own one.</span>
                        </CardContent>
                    </Card>
                    {this.createList(projectList)}
                    <ProjectForm keycloak={this.props.keycloak} axiosInstance={axiosInstance} />
                </div>
            );
        }
    }

}

export default withStyles(useStyles)(Projects);