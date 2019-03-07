import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatsService } from '../cats.service';
import { Subscription, Subject, combineLatest, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';

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
