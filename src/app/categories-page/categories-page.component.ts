import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {Category} from "../shared/interfaces";


@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit {

  loading = false
  categories!: Category[]

  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.loading = true
    //TODO fix ts-ignore
    this.categoriesService.fetch().subscribe(categories => {

      // @ts-ignore
      this.categories = categories["categories"] as Category[]
      this.loading = false
    })
  }

}
