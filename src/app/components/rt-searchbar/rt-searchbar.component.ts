/**
 * @license
 * Copyright Alejandro Rivera. All Rights Reserved.
 * Twitter: @rtalexk https://twitter.com/rtalexk
 * Github: rtalexk https://github.com/rtalexk
 *
 * Use of this source code is governed by an MIT license.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rt-searchbar',
  templateUrl: './rt-searchbar.component.html',
  styleUrls: ['./rt-searchbar.component.scss']
})
export class RtSearchbarComponent {

  /**
    Time to wait to search after user finish typing
  */
  @Input('wait') waitTime = 1000;
  @Input('showLoader') isSearching: boolean;
  @Input('placeholder') placeholder = 'Buscar';
  @Input('textLength') textLength = 1;
  @Output('search') searchEmitter = new EventEmitter();

  timer: any;
  isSearchFocused: boolean;

  constructor() { }

  onSearch(ev, val) {
    const query: string = val.trim();
    if (query.length === 0) {
      this._emitEvent(true, ev);
    }
    if (query.length < this.textLength) { return; }
    if (this.timer) { clearTimeout(this.timer); }
    this.timer = setTimeout(() => {
      this._emitEvent(false, ev);
    }, this.waitTime);
  }

  clearSearchbar(ev, input) {
    ev.stopPropagation();
    input.value = '';
    this.onSearch(ev, input.value);
  }

  private _emitEvent(clear: boolean, event: any) {
    this.searchEmitter.emit({
      clear: clear,
      event: event,
      value: event.target.value
    });
  }

}

export interface SearchEvent {
  clear: boolean;
  event: any;
  value: string;
}
