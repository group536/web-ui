"use strict";

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app';
import {SpotifyService, EchonestService} from './spotify';

export default function main() {
    bootstrap(AppComponent, [SpotifyService, EchonestService, HTTP_PROVIDERS]);
}