"use strict";

// Import CSS
import 'semantic-ui';

import {Observable} from 'rxjs/Observable';
import {WebSocketSubject} from 'rxjs/observable/dom/webSocket';
import 'rxjs/rx';

import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, Control} from 'angular2/common';

import {SpotifyService, EchonestService, AnalyzedTrack} from './spotify';

@Component({
    selector: 'app',
    templateUrl: 'lib/app.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class AppComponent {
    messages: Observable<any>;
    search: Control = new Control('');
    suggestions: SpotifyApi.TrackObjectFull[] = [];
    playlist: { track: SpotifyApi.TrackObjectFull, bpm: number }[] = [];
    selectedTrack: string;
    
    constructor(private spotify: SpotifyService, private echonest: EchonestService) {
        this.messages = WebSocketSubject.create<any>('ws://1fc30902.ngrok.io');
        this.messages.subscribe(m => { 
            if (m.gait) {
                let item = this.findItemWithClosestBpm(m.gait);
                this.selectedTrack = item ? item.track.id : undefined;
            }
        })
        
        let searchSuggestions = Observable.from(this.search.valueChanges)
            .debounceTime(400)
            .distinctUntilChanged()
            .flatMap(term => this.spotify.search(term))
            .subscribe(r => this.suggestions = r.tracks.items);
    }
    
    addItem(suggest: SpotifyApi.TrackObjectFull) {
        let search = this.echonest.search(suggest);
        let item = { 
            track: suggest,
            bpm: undefined
        };
        search.map(r => r.analysis.response.track.audio_summary.tempo).subscribe(bpm => item.bpm = bpm);

        this.playlist.push(item);
    }
    
    getArtistString(track: SpotifyApi.TrackObjectFull) {
        return track.artists.map(a => a.name).join(", ");
    }
    
    trackInPlaylist(track: SpotifyApi.TrackObjectFull) {
        return this.playlist.any(i => i.track.id === track.id);
    }
    
    findItemWithClosestBpm(gait: string) {
        let results = this.playlist.filter(c => {
            if (gait === "standing")
                return c.bpm < 100;
            if (gait === "walking")
                return c.bpm < 150;
            if (gait === "running")
                return c.bpm < 220;
        });
        let rnd = Math.floor(Math.random() * results.length);
        return results[rnd];
    }
}

interface Message {
    data: string;
}

interface GaitInfo {
    gait: string;
}