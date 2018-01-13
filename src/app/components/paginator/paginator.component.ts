import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toArray';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  // Start of showed rows
  @Input('offset') offset = 0;
  // Number of showed rows
  @Input('limit') limit = 1;
  // Total of rows in whole table
  @Input('size') size = 1;
  // Buttons after and before of current one
  @Input('slack') slack = 1;

  @Output('pageChanged') pageChanged = new EventEmitter();

  currentPage: number;
  totalPages: number;
  pages: Observable<Array<number>>;

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.size);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  selectPage(page: number) {
    if (
      !this._isValidPage(page, this.totalPages)
      || page === this.currentPage
    ) { return; }

    this._emitPageChanged(page);
  }

  previousPage() {
    this.selectPage(this.currentPage - 1);
  }

  nextPage() {
    this.selectPage(this.currentPage + 1);
  }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this._getCurrentPage(offset, limit);
    this.totalPages = this._getTotalPages(limit, size);
    this.pages = Observable.range(-this.slack, this.slack * 2 + 1)
      .map(page => this.currentPage + page)
      .filter(page => this._isValidPage(page, this.totalPages))
      .toArray();
  }

  private _emitPageChanged(page: number) {
    console.log('emit:paginator');
    this.pageChanged.emit({
      currentPage: page,
      currentOffset: (page - 1) * this.limit,
      previousOffset: this.offset,
      limit: this.limit,
      size: this.size,
      slack: this.slack
    });
  }

  private _getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  private _getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  private _isValidPage(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

}

export interface PageChangedEvent {
  currentPage: number;
  currentOffset: number;
  previousOffset: number;
  limit: number;
  size: number;
  slack: number;
}
