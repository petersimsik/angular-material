import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';
import {merge, fromEvent} from "rxjs";
import { Lesson } from '../model/lesson';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course:Course;

    lessons : Lesson[] = [];
    dataLoading : boolean = false;
    
    @ViewChild(MatPaginator)
    paginator : MatPaginator;

    @ViewChild(MatSort)
    sort : MatSort;

    expandedLesson : Lesson = null;

    displayedColumns = ['select', 'seqNo', 'description', 'duration'];

    selection = new SelectionModel(true, []); //multiple rows, initial selection

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {

        this.course = this.route.snapshot.data["course"];
        this.loadLessonsPage();

    }

    toggleLessonSelection(lesson : Lesson) {
      this.selection.toggle(lesson);
      console.log(this.selection.selected);
    }

    toggleAllLessonsSelection() {
      this.lessons.forEach(lesson => this.selection.toggle(lesson));
    }

    isAllSelected() : boolean {
      return this.selection.selected?.length == this.lessons?.length;
    }

    expandLesson(lesson : Lesson) {
      if (this.expandedLesson === lesson)
        this.expandedLesson = null;
      else
        this.expandedLesson = lesson;
    }

    loadLessonsPage() {
      this.dataLoading = true;
      this.coursesService.findLessons(
                            this.course.id, 
                            this.sort?.direction ?? 'asc', 
                            this.paginator?.pageIndex ?? 0, 
                            this.paginator?.pageSize ?? 3,
                            this.sort?.active ?? 'seqNo').subscribe({
        next : (data) => {
          console.log('have data');
          this.dataLoading = false;
          this.lessons = data;
        },
        error: (error) => {
          this.dataLoading = false;
          console.log('Ups error');
        }
      })
    }

    ngAfterViewInit() {

      this.sort.sortChange.subscribe({
        next: () => {
          this.paginator.pageIndex = 0;
        }
      });

      merge(this.paginator.page, this.sort.sortChange).subscribe({
        next: (page) => {
          this.loadLessonsPage();
        },
        error : (error) => {
          console.log('paginator error');
        }
      });
    }

}
