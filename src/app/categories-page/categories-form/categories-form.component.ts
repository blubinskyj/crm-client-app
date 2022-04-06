import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {of, switchMap} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef!: ElementRef
  image!: File
  imagePreview: string | ArrayBuffer | null = ''
  isNew = true
  form!: FormGroup
  category!: Category

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
          this.category = category
          //TODO fix ts-ignore
          this.form.patchValue({
            // @ts-ignore
            name: category.category.name
          })
          // @ts-ignore
          this.imagePreview = category.category.imageSrc
          MaterialService.updateTextInputs()
        }
        this.form.enable()
      },
      error => MaterialService.toast(error.error.message)
    )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)

  }

  onSubmit() {
    let obs$
    this.form.disable()
    console.log(this.form.value.name)
    console.log(this.image)
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      // @ts-ignore
      obs$ = this.categoriesService.update(this.category.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        // @ts-ignore
        this.category = category.category
        MaterialService.toast('Chang saved')
        this.form.enable()

      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
