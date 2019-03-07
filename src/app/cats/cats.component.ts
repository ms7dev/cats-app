import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CatsService } from '../cats.service';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit, OnDestroy {

  catsList;
  getCatsSub: Subscription;
  searchFieldSub: Subscription;

  @ViewChild('searchField') searchField: ElementRef;

  constructor(private service: CatsService) { }

  ngOnInit() {
    this.getCats('');

    this.searchFieldSub = fromEvent(this.searchField.nativeElement, 'keyup')
      .pipe(
        map((searchField: any) => searchField.target.value),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((term) => {
        this.getCats(term);
      });
  }

  getCats(term) {
    this.getCatsSub = this.service.getCats(term)
      .subscribe((data) => {
        this.catsList = data;
    });
  }

  ngOnDestroy() {
    if (this.searchFieldSub) {
      this.searchFieldSub.unsubscribe();
    }
    if (this.getCatsSub) {
      this.getCatsSub.unsubscribe();
    }
  }
}
