import {Component} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';


@Component({
  selector: "create-course-step-1",
  templateUrl:"create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  LONG_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dignissim semper est nec gravida. Phasellus bibendum tempor lacus vitae aliquet. Donec sit amet quam commodo elit vehicula dapibus. Proin sit amet arcu consequat, placerat dui lacinia, pharetra mauris. Curabitur pulvinar elit ac faucibus sollicitudin. Ut imperdiet diam enim, vel suscipit augue accumsan id. Donec eget urna nec felis sollicitudin feugiat ut sed arcu. Phasellus a pharetra leo. ';

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: [this.LONG_TEXT, [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: UntypedFormBuilder) {

  }

  get courseTitle() {
    return this.form.controls['title'];
  }

  dateClass : MatCalendarCellClassFunction<Date>  = (cellDate, view) => {
    const date = cellDate.getDate();
    if (view == 'month') {
      return (date == 1) ? 'highlight-red' : '';
    }

    return '';
  }
}
