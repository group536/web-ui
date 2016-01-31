import {Injectable} from 'angular2/core';
import {URLSearchParams, Http} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/rx';

@Injectable()
export class SpotifyService {
    constructor(private http: Http) {}
    search(name: string) {
        var search = new URLSearchParams();
        search.set('type', 'track');
        
        return Observable.from(this.http.get(`https://api.spotify.com/v1/search?q=track:${name.replace(' ', '+')}`, {search}))
            .map(r => r.json());
    }
}

@Injectable()
export class EchonestService {
    constructor(private http: Http) {}
    search(track: SpotifyApi.TrackObjectFull): Observable<AnalyzedTrack> {
        var search = new URLSearchParams();
        search.set('api_key', 'FX1FEUL6L9FYUNGTU');
        search.set('bucket', 'audio_summary');
        
        return Observable.from(this.http.get(`http://developer.echonest.com/api/v4/track/profile?id=spotify:track:${track.id}`, {search}))
            .map(r => ({ 
                track: track, 
                analysis: r.json() 
            }));
    }
}

export interface AnalyzedTrack {
    analysis: any;
    track: SpotifyApi.TrackObjectFull;
}
