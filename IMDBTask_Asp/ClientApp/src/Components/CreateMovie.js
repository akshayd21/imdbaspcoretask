import Header from "./Header";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import DatePicker from "react-datepicker";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../Resources/css/styles.css";
import firebase from "../Firebase";
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Col,
  Row,
  Modal,
  Alert
} from "react-bootstrap";
import FileUploader from "react-firebase-file-uploader";
import plusImage from "../Resources/Images/plus_button.png";
export const optionsmaker = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    console.log();
    data.push({
      label: childSnapshot.val().actorname,
      value: childSnapshot.key
    });
  });
  return data;
};
const styles = {
  saveButton: {}
};

export const dataLooper = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key
    });
  });
  return data;
};

const initialactorstate = {
  imagefileurl: "",
  moviename: "",
  plot: "",
  cast: "",
  yearofrelease: ""
};
class CreateMovie extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitactordetails = this.submitactordetails.bind(this);
    this.submitmoviedetails = this.submitmoviedetails.bind(this);
    this.handleoptionsdata = this.handleoptionsdata.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.state = initialactorstate;
    this.state = {
      data: "",
      options: "",
      dateflag: true,
      avatar: "",
      movienameflag: false,
      actornameflag: false,
      success: false,
      isUploading: false,
      progress: 0,
      imagefileurl: "",
      show: false,
      selectedoptions: "",
      startDate: new Date()
    };
  }
  handleDate(date) {
    this.setState({
      startDate: date
    });
    if (new Date() == this.state.startDate) {
      this.setState({ dateflag: true }, () => {
        window.setTimeout(() => {
          this.setState({ dateflag: false });
        }, 2000);
      });
    }
  }
  handleClose() {
    this.setState({ show: false });
    this.setState({ actorname: "", sex: "", startDate: new Date(), bio: "" });
  }

  handleShow() {
    this.setState({ show: true });
  }
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("Posters")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ imagefileurl: url }));
  };
  componentDidUpdate() {
    firebase
      .database()
      .ref("actors")
      .once("value")
      .then(snapshot => {
        const options = optionsmaker(snapshot);

        this.setState({
          options: options
        });
      });
  }
  //desi
  submitactordetails(e) {
    e.preventDefault();

    if (!this.state.dateflag) {
      this.setState({ show: false });
      this.setState({ success: true }, () => {
        window.setTimeout(() => {
          this.setState({ success: false });
        }, 2000);
      });

      var ref = firebase.database().ref("actors");
      console.log(ref);
      var obj = {
        actorname: this.state.actorname,
        sex: this.state.sex,
        dateofbirth: this.state.startDate,
        bio: this.state.bio
      };
      console.log(obj);
      ref.push(obj);
      this.setState({ actorname: "", sex: "", startDate: new Date(), bio: "" });
    } else {
    }
  }
  handleoptionsdata(e) {
    console.log("i am here", e);
    this.setState({ selectedoptions: e });
  }
  submitmoviedetails(e) {
    e.preventDefault();
    this.setState({ show: false });
    this.setState({ success: true }, () => {
      window.setTimeout(() => {
        this.setState({ success: false });
      }, 2000);
    });

    var ref = firebase.database().ref("movies");

    var castobj = {};
    for (var i = 0; i < this.state.selectedoptions.length; i++) {
      castobj[i] =
        this.state.selectedoptions[i].label +
        "(" +
        this.state.selectedoptions[i].value +
        ")";
    }
    var obj = {
      imagefileurl: this.state.imagefileurl,
      moviename: this.state.moviename,
      plot: this.state.plot,
      cast: castobj,
      yearofrelease: this.state.yearofrelease
    };
    ref.push(obj);
    this.setState({
      imagefileurl: "",
      moviename: "",
      plot: "",
      cast: "",
      yearofrelease: ""
    });
    alert("Record added successfully");
    this.props.history.push("movies");
  }

  onCancelClick(e) {
    console.log(this.props.history.push("movies"), "HISSS");
    this.props.history.push("movies");
    this.setState({
      imagefileurl: "",
      moviename: "",
      plot: "",
      cast: "",
      yearofrelease: ""
    });
  }
  onSelectDate(e) {
    console.log(e, "SELEEEEEEEEEEEEEEEEEEEEEEEEEEE");

    this.setState({ dateflag: false });
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    var moviesref = firebase.database().ref("movies");
    var actorsref = firebase.database().ref("actors");
    if (e.target.name == "moviename") {
      moviesref.once("value").then(snapshot => {
        const data = dataLooper(snapshot);
        for (var i = 0; i < data.length; i++) {
          if (this.state.moviename == data[i].moviename) {
            this.setState({ movienameflag: true }, () => {
              window.setTimeout(() => {
                this.setState({ movienameflag: false });
              }, 2000);
            });
          }
        }
      });
    } else if (e.target.name == "actorname") {
      actorsref.once("value").then(snapshot => {
        const data = dataLooper(snapshot);
        for (var i = 0; i < data.length; i++) {
          if (this.state.actorname == data[i].actorname) {
            this.setState({ actornameflag: true }, () => {
              window.setTimeout(() => {
                this.setState({ actornameflag: false });
              }, 2000);
            });
          }
        }
      });
    }
  }

  render() {
    return (
      <div>
        <Header />
        <br />
        <br />
        <div id="moviecontainer">
          <h4>Add New Movie</h4>
          <br />
          {this.state.success ? (
            <Alert id="alert" variant="success">
              Data Recorded successfully!!
            </Alert>
          ) : null}
          <Form
            method="post"
            name="createnewactorform"
            onSubmit={this.submitmoviedetails}
          >
            <InputGroup>
              <Form.Label>Year of Release&nbsp;&nbsp;</Form.Label>

              <Form.Control
                type="number"
                name="yearofrelease"
                onChange={this.handleChange}
                placeholder="Enter year of release"
                width="50%"
                required
              />
            </InputGroup>
            <br />
            <InputGroup>
              <Form.Label>Movie Name &nbsp;&nbsp;</Form.Label>
              <Form.Control
                type="text"
                name="moviename"
                onChange={this.handleChange}
                placeholder="Enter name"
                required
              />
              {this.state.movienameflag ? (
                <Alert id="alert" variant="danger">
                  Movie is already present!
                </Alert>
              ) : null}
            </InputGroup>
            <br />
            <InputGroup>
              <Form.Label>Plot&nbsp;&nbsp;</Form.Label>
              <FormControl
                as="textarea"
                aria-label="With textarea"
                name="plot"
                onChange={this.handleChange}
                placeholder="Enter plot"
                required
              />
            </InputGroup>
            <br />
            <Form.Label>Poster&nbsp;&nbsp;</Form.Label>
            {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
            {this.state.imagefileurl && (
              <img src={this.state.imagefileurl} width="30px" height="80px" />
            )}
            <FileUploader
              accept="image/*"
              name="avatar"
              randomizeFilename
              storageRef={firebase.storage().ref("Posters")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              required
            />
            <br /> <br />
            <Row>
              <Col xs="1">
                <Form.Label>Cast</Form.Label>
              </Col>
              <Col xs="5">
                <ReactMultiSelectCheckboxes
                  options={this.state.options}
                  name="cast"
                  onChange={e => this.handleoptionsdata(e)}
                  value={this.state.cast}
                  width="70%"
                  required
                />
              </Col>
              <Col xs="1">
                <Button primary onClick={this.handleShow}>
                  <img src={plusImage} height="20" width="20" />
                  &nbsp; Actor
                </Button>
                <Modal
                  show={this.state.show}
                  onHide={this.handleClose}
                  dialogClassName="modal-90w"
                >
                  <Form
                    method="post"
                    name="createnewactorform"
                    onSubmit={this.submitactordetails}
                    id="mform"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add New Actor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row>
                        <InputGroup.Prepend>
                          <Form.Label>Actor Name&nbsp;&nbsp;</Form.Label>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="text"
                          placeholder="Enter the name"
                          id="modalinput"
                          name="actorname"
                          onChange={this.handleChange}
                          required
                        />

                        {this.state.actornameflag ? (
                          <Alert id="alert" variant="danger">
                            actor is already present!
                          </Alert>
                        ) : null}
                      </Row>
                      <br />
                      <Row>
                        <Col xs="1">
                          <Form.Label>Sex&nbsp;&nbsp;</Form.Label>
                        </Col>

                        <Row id="modalrow">
                          <InputGroup.Prepend>
                            <InputGroup.Radio
                              name="sex"
                              value="Male"
                              onChange={this.handleChange}
                              required
                            />
                          </InputGroup.Prepend>
                          &nbsp; Male &nbsp;&nbsp;
                          <InputGroup.Prepend>
                            <InputGroup.Radio
                              name="sex"
                              value="Female"
                              onChange={this.handleChange}
                              required
                            />
                          </InputGroup.Prepend>
                          &nbsp; Female &nbsp;&nbsp;
                          <InputGroup.Prepend>
                            <InputGroup.Radio
                              name="sex"
                              value="Others"
                              onChange={this.handleChange}
                              required
                            />
                          </InputGroup.Prepend>
                          &nbsp; Others &nbsp;&nbsp;
                        </Row>
                      </Row>
                      <br />
                      {this.state.dateflag ? (
                        <Alert id="alert" variant="primary" width="70%">
                          Please select date!
                        </Alert>
                      ) : null}
                      <Row>
                        {" "}
                        Date of Birth &nbsp;&nbsp;&nbsp;
                        <DatePicker
                          selected={this.state.startDate}
                          onChange={this.handleDate}
                          onSelect={this.onSelectDate}
                        />{" "}
                      </Row>
                      <br />
                      <InputGroup id="modaltextarea">
                        <InputGroup.Prepend>
                          <Form.Label>Bio&nbsp;&nbsp;</Form.Label>
                        </InputGroup.Prepend>

                        <FormControl
                          as="textarea"
                          name="bio"
                          onChange={this.handleChange}
                          placeholder="Enter bio"
                          required
                        />
                      </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        // onClick={this.handleClose}
                      >
                        Done
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                {/* <Link to="createactor" style={{ textDecoration: "none" }}> */}
                <Button variant="primary" type="submit">
                  &nbsp; Save
                </Button>
                {/* </Link> */}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {/* <Link to="createactor" style={{ textDecoration: "none" }}> */}
                <Button variant="secondary" onClick={this.onCancelClick}>
                  &nbsp; Cancel
                </Button>
                {/* </Link> */}
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default CreateMovie;
