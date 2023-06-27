import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { createProbateRecordCollection } from '../../state/probate-record-collection.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-probate-record-collection',
  templateUrl: './create-probate-record-collection.component.html',
  styleUrls: ['./create-probate-record-collection.component.sass'],
})
export class CreateProbateRecordCollectionComponent implements OnInit {
  createForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit() {
    if (this.createForm.invalid) {
      return;
    }

    const { title, description } = this.createForm.value;

    this.store.dispatch(
      createProbateRecordCollection({ title, description })
    );

    this.router.navigateByUrl('/collections');
  }
}
