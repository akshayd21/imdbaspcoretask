import "../Resources/css/jquery.dataTables.css";
import React from "react";
import { Link } from "react-router-dom";
import firebase from "../Firebase";
import Header from "./Header";
import plusImage from "../Resources/Images/plus_button.png";
import { Button } from "react-bootstrap";
const $ = require("jquery");
$.DataTable = require("datatables.net");

export const firebaseLooper = snapshot => {
  let data = [];

  snapshot.forEach(childSnapshot => {
    console.log(childSnapshot.val(), "here");
    data.push({
      ...childSnapshot.val(),
      moviekey: childSnapshot.key
    });
  });
  return data;
};
const styles = {
  saveButton: {
    float: "Right",
    marginTop: 15,
    marginBottom: 15,
    marginRight: 15
  }
};
class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagerecordsdata: []
    };
  }
  componentWillMount() {
    let imagerecordsdata = [];
    firebase
      .database()
      .ref(`movies`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);

        for (var i = 0; i < data.length; i++) {
          if (data[i]) var objcast = [];
          var cast = data[i].cast;
          for (let index in cast) {
            objcast[index] = cast[index].replace(/ *\([^)]*\) */g, "");
          }

          imagerecordsdata.push({
            imagefileurl: data[i].imagefileurl,
            yearofrelease: data[i].yearofrelease,
            moviename: data[i].moviename,
            plot: data[i].plot,
            cast: objcast,
            editurl: "/editmovie/" + data[i].moviekey + ""
          });
        }

        var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

        var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
          imagerecordsdatael => Object.values(imagerecordsdatael)
        );

        this.setState({
          imagerecordsdata: imagerecordsdatatotables
        });
      });
  }

  componentDidUpdate() {
    this.callDataTableImage();
  }
  callDataTableImage() {
    // if (this.state.stockdata != null) {
    console.log(this.state.imagerecordsdata, "this.state.imagerecordsdata");
    if (!this.imagerecordsdatael) return;
    this.$imagerecordsdatael = $(this.imagerecordsdatael);
    this.$imagerecordsdatael.DataTable({
      data: this.state.imagerecordsdata,
      columns: [
        {
          title: "Poster",
          render: function(data) {
            return '<img height=150 width=100 src="' + data + '">';
          }
        },

        { title: "Year Of Release" },
        { title: "Movie Name" },
        { title: "Plot" },
        { title: "Cast" },

        {
          title: "EDIT",
          render: function(data, type) {
            if (type === "display") {
              data = '<a href="' + data + '"class="link_button">EDIT</a>';
            }
            return data;
          }
        }
      ],
      destroy: true
      //  ordering: false
    });
    //}
  }
  render() {
    return (
      <div>
        <Header />
        <br/>
        <h3>&nbsp;Movies List</h3>
        <Link to="createmovie" style={{ textDecoration: "none" }}>
          <Button style={styles.saveButton} primary>
            <img src={plusImage} height="20" width="20" />
            &nbsp; Movie
          </Button>
        </Link>
        <table
          className="display"
          width="100%"
          ref={imagerecordsdatael =>
            (this.imagerecordsdatael = imagerecordsdatael)
          }
        />
      </div>
    );
  }
}

export default Movies;
