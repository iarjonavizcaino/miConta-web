/**
 * @license
 * Copyright Alejandro Rivera. All Rights Reserved.
 * Twitter: @rtalexk https://twitter.com/rtalexk
 * Github: rtalexk https://github.com/rtalexk
 *
 * Use of this source code is governed by an MIT license.
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { PageChangedEvent } from '../paginator/paginator.component';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import * as accounting from 'accounting-js';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rt-datatable',
  templateUrl: './rt-datatable.component.html',
  styleUrls: ['./rt-datatable.component.scss']
})
export class RtDatatableComponent implements OnInit, OnDestroy {

  accounting = accounting;
  moment = moment;

  // tslint:disable-next-line:no-input-rename
  @Input('showRowNumber') isRowNumber = true;
  // tslint:disable-next-line:no-input-rename
  @Input('lazyness') isLazyness: boolean;
  @Input('searchWait') searchWait = 1000;

  // tslint:disable-next-line:no-output-rename
  @Output('checked') checkEmitter = new EventEmitter();
  // tslint:disable-next-line:no-output-rename
  @Output('changed') changeEmitter = new EventEmitter();
  // tslint:disable-next-line:no-output-rename
  @Output('search') searchEmitter = new EventEmitter();
  // tslint:disable-next-line:no-output-rename
  @Output('selected') rowSelectionEmitter = new EventEmitter();

  @Input('headers') headers: Array<RtHeader>;
  @Input('data') data: Array<any>;

  @Input('action') action: Subject<RtAction>;
  actionSubscription: Subscription;

  backup: Array<any> = [];
  isBackedUp = false;

  selectedRowIndex: number;
  selectedRowData: any;
  isSearching: boolean;
  readonly: boolean;
  emptyInput: boolean;

  skip = 0;
  limit = 5;
  entries = [5, 10, 15, 20, 30];

  /**
   * Es necesario implementar esta comunicación porque, cuando un elemento
   * es borrado, tiene que ser eliminado tanto del backup como de los datos
   * mostrados actualmente, ya sean todos los datos o los resultados de
   * la búsqueda.
   */
  ngOnInit() {
    if (!this.action) {
      throw new Error('You must provide an RtAction Subject as input in RtDatatable');
    }
    this.actionSubscription = this.action.subscribe(action => {
      switch (action.name) {
        case RtActionName.DELETE:
          this._removeItem(action.itemId);
          break;
        case RtActionName.UPDATE:
          this._updateItem(action.itemId, action.newItem);
          break;
        case RtActionName.CREATE:
          this._createItem(action.newItem, action.order);
          break;
        default:
          console.error('unexpected RtActionName in RtDatatable');
      }
    });

    this.readonly = this.isReadonly();
  }

  ngOnDestroy() {
    if (this.actionSubscription) { this.actionSubscription.unsubscribe(); }
  }

  private _removeItem(_id: string) {
    let index: number;
    index = this.data.findIndex(item => item._id === _id);
    this.data.splice(index, 1);
    index = this.backup.findIndex(item => item._id === _id);
    this.backup.splice(index, 1);

    this.clearSelected();
  }

  private _updateItem(_id: string, newItem: any) {
    let index: number;
    index = this.data.findIndex(item => item._id === _id);
    this.data.splice(index, 1);
    this.data.splice(index, 0, newItem);
    index = this.backup.findIndex(item => item._id === _id);
    this.backup.splice(index, 1);
    this.backup.splice(index, 0, newItem);
  }

  private _createItem(newItem: any, order: string) {
    if (!order) {
      this.data.push(newItem);
      this.backup.push(newItem);
    } else {
      this.data.splice(0, 0, newItem);
      this.backup.splice(0, 0, newItem);
    }
  }

  onRowSelected(ev, index, data) {
    ev.stopPropagation();
    if (index === this.selectedRowIndex) {
      this.clearSelected();
    } else {
      this.selectedRowIndex = index;
      this.selectedRowData = data;
      this._emitSelected();
    }
  }

  onPageChanged(ev: PageChangedEvent) {
    this.skip = ev.currentOffset;
  }

  onSearch(ev) {
    this.skip = 0;
    if (this.isLazyness) {
      return this.searchEmitter.emit(ev);
    }

    this.isSearching = true;

    if (!this.isBackedUp) {
      this.backup = this.data;
      this.isBackedUp = true;
    }

    if (ev.clear) {
      this.data = this.backup.slice();
      this.isSearching = false;
      return;
    }

    const query: string = ev.event.target.value.trim().toLowerCase();
    this.data = this._fnSearch(query);
    this.isSearching = false;
  }

  clearSelected() {
    this.selectedRowData = null;
    this.selectedRowIndex = null;
    this._emitSelected();
  }

  private _fnSearch(query: string): Array<any> {
    const validProps = this.headers.map(header => header.prop);
    const results = [];

    const words = query.split(' ');
    for (let i = 0; i < this.backup.length; i++) {
      const row = this.backup[i];
      const rowString = this._fnGetRowValue(row, validProps);
      if (this._fnFindWordsInRow(words, rowString)) {
        results.push(row);
      }
    }
    return results.slice();
  }

  private _fnFindWordsInRow(words: Array<string>, row: string): boolean {
    return words.every(word => this._fnFindWordInRow(word, row));
  }

  private _fnFindWordInRow(word: string, row: string): boolean {
    return row.indexOf(this._removeAccents(word)) !== -1;
  }

  private _fnGetRowValue(row: any, validProps: Array<string>): string {
    let rowString = '';
    let cellValue: string;
    for (const prop in row) {
      if (validProps.indexOf(prop) !== -1) {
        cellValue = this._fnGetCellValue(row, prop);
        rowString += cellValue.toLowerCase() + ' ';
      } else {
        validProps.forEach(validProp => {
          if (validProp.includes(prop + '.')) {
            cellValue = this._fnGetCellValue(row, validProp);
            rowString += cellValue.toLowerCase() + ' ';
            return;
          }
        });
      }
    }
    return rowString;
  }

  onCheckboxChanged(row: any, header: RtHeader) {
    this.checkEmitter.emit({
      item: row,
      header: header
    });
  }

  onInputChanged(row: any) {
    this.changeEmitter.emit({ data: row });
    if (row.quantity === '' || row.quantity === 0) {
      this.emptyInput = true;
    } else { this.emptyInput = false; }
  }

  private _fnGetCellValue(row: any, prop: string): string {
    if (!isNaN(row[prop])) {
      return row[prop].toString();
    }
    // TESTING
    const header = this.headers.find(h => h.prop === prop);
    if (row[prop] && header.moment) {
      return this._removeAccents(this.moment(row[prop]).fromNow())
        + ' '
        + this._removeAccents(this.moment(row[prop]).format('DD/MMMM/YYYY'));
    }
    if (!prop.includes('.')) {
      return row[prop]
        ? this._removeAccents(row[prop])
        : this._removeAccents(header.default);
    }
    const props = prop.split('.');
    let value = row[props[0]];
    for (let i = 1; i < props.length; i++) {
      value = value[props[i]];
    }
    return value
      ? this._removeAccents(value)
      : this._removeAccents(header.default);
  }

  private _removeAccents(word: string): string {
    word = word + '';
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private _emitSelected() {
    this.rowSelectionEmitter.emit({ data: this.selectedRowData });
  }

  isReadonly(): boolean {
    let n = 0;
    const size = this.headers.length;
    for (let i = 0; i < size; i++) {
      if (this.headers[i].name === 'Activa' || this.headers[i].name === 'Activo') {
        n++;
      }
    }
    return (n > 0);
  }

  isNegative (value) {
    if (value.includes('-')) {
      return true;
    } else {
      return false;
    }
  }

  value(row: any, header: RtHeader, isBoolean: boolean): string {
    const strProp = header.prop;
    const valueToReturnIfError: any = isBoolean ? false : '########';

    if (!strProp.includes('.')) { return row[strProp]; }
    const props = strProp.split('.');
    if (this._areInvalidProps(props)) {
      return valueToReturnIfError;
    }
    let value = row[props[0]];
    for (let i = 1; i < props.length; i++) {
      value = value[props[i]];
      if (value === undefined) {
        return header.default;
      }
    }
    return value;
  }

  private _areInvalidProps(props: Array<string>): boolean {
    for (const prop of props) {
      if (prop.length === 0) { return true; }
    }
    return false;
  }
}

export interface RtHeader {
  name: string;
  prop: string;
  default?: any;
  input?: string;
  placeholder?: string;
  align?: string;
  priceSymbol?: boolean;
  percentSymbol?: boolean;
  width?: string;
  disabled?: boolean;
  accounting?: boolean;
  moment?: boolean;
  color?: boolean;
  number?: boolean;
  chip?: boolean;
  link?: boolean;
}

export interface RtAction {
  name: RtActionName;
  itemId?: string;
  newItem?: any;
  order?: string;
}

export interface RtCheckEvent {
  item: any;
  header: RtHeader;
}

export enum RtActionName { CREATE = 1, DELETE = 2, UPDATE = 3, }
