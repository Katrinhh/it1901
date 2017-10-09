import React, { Component } from 'react';
import NavComponent from '../../components/navbar/navbar'
import Concert from '../../components/concert/Concert'

import './style.css';

import database from '../../database';

export default class BandDatabase extends Component {

  constructor() {
    super();

    this.state = {
      concerts: [],
      genres: [],
      genreOptions: [<option value="ShowAll" key="ShowALl"> Show All </option>],

      selectedGenre: "ShowAll",
    }


    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
    
  }

  componentWillMount() {
    var previousGenreOptions = this.state.genreOptions;
    var previousGenres = this.state.genres;
    var previousConcerts = this.state.concerts;

    // Gå gjennom alle festivalene
    database.ref().on('value', snapshot => {
      snapshot.forEach(festivalSnapshot => {

        // Hvis festivalen != festival17:
        if (festivalSnapshot.key != "festival17") {

          // For hver konsert
          festivalSnapshot.child('concerts').forEach(concertSnapshot => {

            // Tar vare på alle konsertene man finner
            previousConcerts.push(concertSnapshot);

            // Tar vare på alle sjangre man finner
            var genre = concertSnapshot.val().genre
            if (!previousGenres.includes(genre)) {
              previousGenreOptions.push(
                <option value={genre} key={concertSnapshot.key}> {genre} </option>
              )
              previousGenres.push(genre)
            }
          })
        }
      })
      this.setState({
        genreOptions: previousGenreOptions,
        genres: previousGenres,
        concerts: previousConcerts,
      })
    })
  }

  render() {
    return (
      <div className="App">
        <NavComponent />
        <h1>
          Band Database
        </h1>
        <p> Her kan man sjekke alle tidligere konserter innen en sjanger </p>

        <select name="selectedGenre" value={this.state.selectedGenre} onChange={this.handleChange}>
          {this.state.genreOptions}
        </select>

        <div>
          {
            this.state.concerts.map(concert => {

              var match = false;

              if (this.state.selectedGenre == "ShowAll") {
                match = true;
              }

              else if (this.state.selectedGenre == concert.val().genre) {
                match = true;
              }

              if (match) {
                return(
                <div key={concert.key}>
                  <h1> {String(concert.ref.parent.parent.key)} </h1>
                  <Concert name={concert.val().name} sales={concert.val().sales} genre={concert.val().genre} key={concert.key}/>
                </div>
              )
              }
              
            })
          }
        </div>
      </div>
    );
  }
}