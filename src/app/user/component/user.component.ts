import { Component }          from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../service/user.service';
@Component({
    selector: 'user-form',
    templateUrl: './app/user/user.tmpl.html',
    styleUrls: ['./app/user/css/user.css'],
    providers: [UserService]
})
export class UserComponent {
    constructor(private _userService: UserService) {}
    displayName: string = '';
    user: User;
    isShow: string = 'block';
    onSubmit(event, userName, password) {
        alert(userName);
        event.preventDefault();
        // $('.user').removeClass('clicked').addClass('loading');
        let _userUrl: User;
        this._userService.getLoginDetails(userName, password).subscribe(
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