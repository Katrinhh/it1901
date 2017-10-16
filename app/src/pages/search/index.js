import React, { Component } from 'react';
import NavComponent from '../../components/navbar/navbar'
import './style.css';
import database from '../../database';
import Artist from '../../components/artist/Artist';

import * as SpotifyWebApi from 'spotify-web-api-node';


export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      currentSearchInput: "",
      artists: [],
    }

    this.handleChange = this.handleChange.bind(this);
    
    this.spotifyApi = new SpotifyWebApi({
      redirectUri : 'http://localhost:3000/callback'
    });
  }

  componentWillMount() {
    this.fetchToken();



  }
  
  fetchToken() {
    var myHeaders = new Headers();
    var myInit = { method: 'GET',
                   headers: myHeaders,
                   mode: 'cors',
                   cache: 'default' };
    var myRequest = new Request('https://us-central1-festival-180609.cloudfunctions.net/spotifyToken/', myInit);
    fetch(myRequest).then(response => {
      response.json().then(file => {
        console.log("Token is", file["token"]);
        this.spotifyApi.setAccessToken(file["token"]);
      })
    })
  }


  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    },
    () => {
      if (this.state.currentSearchInput.length > 1) {
        this.spotifyApi.searchArtists(this.state.currentSearchInput, {country: 'NO', locale: 'no_NO'})
        .then(function(data) {
          var artistsToShow = []
          data.body.artists.items.map(artist => {
            artistsToShow.push(artist)
          })
          return artistsToShow;
        }, function(err) {
          console.error(err)
        })
        .then((artistsToShow) => {
          this.setState({artists:artistsToShow})
        })
      } else {
        this.setState({artists:[]})
      }
    })
  }

  render(){
    return(
      <div className="App">
        <NavComponent/>

        <h1> Lets search </h1>

        <form>
          <h2> Søk etter artist her </h2>
          <input type="text" name="currentSearchInput" value={this.state.currentSearchInput} onChange={this.handleChange}/>
        </form>

        <div className="Artists">
          {
            this.state.artists.map(artist => {
              return (
                <Artist name={artist.name} popularity={artist.popularity} followers={artist.followers.total} genres={artist.genres} key={artist.uri} />
              )
            })
          }
        </div>

      </div>
    )
  }
}
