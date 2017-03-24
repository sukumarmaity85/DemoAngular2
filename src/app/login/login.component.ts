import { Component }          from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {User} from './user';
import {LoginService} from './login.service';

@Component({
  selector: 'login-form',
  templateUrl: './app/www/index.html',
  styleUrls: ['./app/www/login1.css'],
  providers: [LoginService]
})
export class LoginComponent {
    constructor(private _loginService: LoginService) {}
    displayName: string = '';
    user: User;
    isShow: string = 'block';
     onSubmit(event, userName, password) {
         alert(userName);
         event.preventDefault();
        // $('.login').removeClass('clicked').addClass('loading');
        let _userUrl: User;
         this._loginService.getLoginDetails(userName, password).subscribe(
                 user => this.extata(user),
                 error =>  this.errorMessage(<any>error));
         }
    private extata(user: User) {
        alert(user.userId);
           this.user = user;
            console.log(this.user);
            this.isShow = 'none';
          }
     private errorMessage(message: string) {
         message = 'Server===' + message;
         console.log(message);
     }
}