import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {of, switchMap} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  isNew = true
  form!: FormGroup

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
    this.form.disable()
    this.route.params
      .pipe(switchMap((params: Params) => {
        if (params['id']) {
          this.isNew = false
          return this.categoriesService.getById(params['id'])
        }
        return of(null)
      })).subscribe(
      category => {
        if (category) {
          //TODO fix ts-ignore
          this.form.patchValue({
            // @ts-ignore
            name: category.category.name
          })
          MaterialService.updateTextInputs()
        }
        this.form.enable()
      },
      error => MaterialService.toast(error.error.message)
    )
  }

  onSubmit() {

  }

}
