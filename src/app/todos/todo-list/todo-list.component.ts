import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Todo } from "../todo.model";
import { TodosService } from "../todos.service";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.css"]
})
export class TodoListComponent implements OnInit, OnDestroy {
  // todos = [
  //   { title: "First Todo", content: "This is the first todo's content" },
  //   { title: "Second Todo", content: "This is the second todo's content" },
  //   { title: "Third Todo", content: "This is the third todo's content" }
  // ];
  todos: Todo[] = [];
  private todosSub: Subscription;

  constructor(public todosService: TodosService) {}

  ngOnInit() {
    this.todosService.getTodos();
    this.todosSub = this.todosService.getTodoUpdateListener()
    .subscribe((todos: Todo[]) => {
        console.log('getTodos');
        this.todos = todos;
      });
  }

  onDelete(todoId: string) {
    console.log(todoId);
    this.todosService.deleteTodo(todoId);
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
  }
}
