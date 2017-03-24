import { Component }          from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {User} from './login/user';

@Component({
  selector: 'app',
  template: '<login-form></login-form>'
})
export class AppComponent {
}