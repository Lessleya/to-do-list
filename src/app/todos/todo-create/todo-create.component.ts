import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Todo } from "../todo.model";
import { TodosService } from "../todos.service";

@Component({
  selector: "app-todo-create",
  templateUrl: "./todo-create.component.html",
  styleUrls: ["./todo-create.component.css"]
})
export class TodoCreateComponent {
  enteredTitle = "";
  enteredContent = "";
  todo: Todo;
  isLoading = false;
  private mode = "create";
  private todoId: string;

  constructor(public todosService: TodosService, public route:ActivatedRoute) {}

  onAddTodo(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.todosService.addTodo(form.value.title, form.value.content);
    form.resetForm();
  }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      console.log(JSON.stringify(paramMap))

      if (paramMap.has("todoId")) {

        this.mode = "edit";

        this.todoId = paramMap.get("todoId");

        this.isLoading = true;

        this.todosService.getTodo(this.todoId).subscribe(todoData => {

          this.isLoading = false;

          this.todo = {id: todoData._id, title: todoData.title, content: todoData.content};

        });

      } else {

        this.mode = "create";

        this.todoId = null;

      }

    });

  }
  onSaveTodo(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;
    console.log(this.mode);

    if (this.mode === "create") {

      this.todosService.addTodo(form.value.title, form.value.content);

    } else {

      this.todosService.updateTodo(

        this.todoId,

        form.value.title,

        form.value.content

      );

    }

    form.resetForm();

  }

}

