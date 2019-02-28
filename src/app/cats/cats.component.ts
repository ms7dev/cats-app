import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatsService } from '../cats.service';
import { Subscription, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit, OnDestroy {

  catsList;
  sub: Subscription;
  searchTextChanged: Subject<string> = new Subject();

  constructor(private service: CatsService) { }

  ngOnInit() {
   this.getCats('hta');

    this.searchTextChanged
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe((term) => {
        this.getCats(term);
      });
  }

  getCats(term) {
    this.service.getCats(term)
      .subscribe((data) => {
        this.catsList = data;
    });;
  }

  onChange(term) {
    this.searchTextChanged.next(term);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
