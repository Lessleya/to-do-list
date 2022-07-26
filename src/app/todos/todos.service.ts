import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import {Router} from "@angular/router"
import { Todo } from "./todo.model";

@Injectable({ providedIn: "root" })
export class TodosService {
  private todos: Todo[] = [];
  private todosUpdated = new Subject<Todo[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getTodos() {
    this.http
      .get<{ message: string; todos: any }>(
        "http://localhost:3000/api/todos"
      )
      .pipe(map((todoData) => {
        return todoData.todos.map(todo => {
          return {
            title: todo.title,
            content: todo.content,
            id: todo._id
          };
        });
      }))
      .subscribe(transformedTodos => {
        this.todos = transformedTodos;
        this.todosUpdated.next([...this.todos]);
      });
  }

  getTodoUpdateListener() {
    return this.todosUpdated.asObservable();
  }

  getTodo(id: string) {

    return this.http.get<{ _id: string; title: string; content: string }>(

      "http://localhost:3000/api/todos/" + id

    );

  }

  addTodo(title: string, content: string) {
    const todo: Todo = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, todoId: string }>("http://localhost:3000/api/todos", todo)
      .subscribe(responseData => {
        const id = responseData.todoId;
        todo.id = id;
        this.todos.push(todo);
        this.todosUpdated.next([...this.todos]);
        this.router.navigate(["/"]);
      });
  }

  updateTodo(id: string, title: string, content: string){
    console.log('hello');
    
    const todo: Todo = {id: id, title: title, content: content};
    this.http
      .put("http://localhost:3000/api/todos/" + id, todo)
      .subscribe(response => {

        const updatedTodos = [...this.todos];

        const oldTodoIndex = updatedTodos.findIndex(p => p.id === todo.id);

        updatedTodos[oldTodoIndex] = todo;

        this.todos = updatedTodos;

        this.todosUpdated.next([...this.todos]);

        this.router.navigate(["/"]);

      });
  }

  deleteTodo(todoId: string) {
    this.http.delete("http://localhost:3000/api/todos/" + todoId)
      .subscribe(() => {
        const updatedTodos = this.todos.filter(todo => todo.id !== todoId);
        this.todos = updatedTodos;
        this.todosUpdated.next([...this.todos]);
      });
  }
}
