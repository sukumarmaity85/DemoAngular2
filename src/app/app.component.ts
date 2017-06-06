import { Component }          from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';

@Component({
  selector: 'app',
  template: '<user-form></user-form>'
})
export class AppComponent {
}