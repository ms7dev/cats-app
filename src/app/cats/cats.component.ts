import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatsService } from '../cats.service';
import {Subscription, Subject, combineLatest, merge, timer, zip, forkJoin} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, map, filter, take, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit, OnDestroy {
  searchTerm;
  catsList;
  getCatsSub: Subscription;
  searchTextSub: Subscription;
  searchTextChanged: Subject<string> = new Subject();
  searchButton: Subject<string> = new Subject();

  constructor(private service: CatsService) { }

  ngOnInit() {

    const timer1 = timer(1000, 1000).pipe(map(i => 'a: ' + i), take(4));
    const timer2 = timer(2000, 1000).pipe(map(i => 'b: ' + i), take(2));
    // ----a:0-------a:1---------a:2----------a:3|.
    // ---------b:0-----b:1|.

    // combineLatest(timer1, timer2).subscribe((result) => console.log(result));

      // ["a: 1", "b: 0"]
      // ["a: 2", "b: 0"]
      // ["a: 2", "b: 1"]
      // ["a: 3", "b: 1"]


    // zip(timer1, timer2).subscribe((result) => console.log(result));

      // ["a: 0", "b: 0"]
      // ["a: 1", "b: 1"]

    // const result = timer1.pipe(withLatestFrom(timer2));
    // result.subscribe((value) => console.log(value));

      // ["a: 1", "b: 0"]
      // ["a: 2", "b: 0"]
      // ["a: 3", "b: 1"]

    // const result = timer2.pipe(withLatestFrom(timer1));
    // result.subscribe((value) => console.log(value));

      // ["b: 0", "a: 1"]
      // ["a: 1", "a: 2"]

    forkJoin(timer1, timer2).subscribe((result) => console.log(result));

      // ["a: 3", "b: 1"]

    this.searchTextSub = merge(
        this.searchTextChanged
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter((term) => term.length >= 3)
        ),
          this.searchButton)
        .pipe(
          switchMap((term) => this.service.getCats(term))
        )
        .subscribe((data) => {
          this.catsList = data;
        });

    this.searchTextChanged.next('');
  }

  onSearch() {
    this.searchButton.next(this.searchTerm);
  }

  ngOnDestroy() {
    if (this.getCatsSub) {
      this.getCatsSub.unsubscribe();
    }
    if (this.searchTextSub) {
      this.searchTextSub.unsubscribe();
    }
  }
}
