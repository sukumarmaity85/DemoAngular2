import {Component, OnInit} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';
import {FormControl} from '@angular/forms';
import {User} from '../model/user';
import {LookupWrapper} from '../model/lookup.wrapper';
import {UserService} from '../service/user.service';
import {UserWrapper} from '../model/user.wrapper';
@Pipe({
    name: 'guardfilter',
    pure: false
})

export class GuardFilterPipe implements PipeTransform {
    transform(users: any, filter: any): any {
        if (filter && Array.isArray(users)) {
            let filterKeys = Object.keys(filter);
            return users.filter(user =>
                filterKeys.reduce((memo, keyName) =>
                (memo && (new RegExp(filter[keyName], 'gi').test(user['name']) ||
                new RegExp(filter[keyName], 'gi').test(user['email'])
                || new RegExp(filter[keyName], 'gi').test(user['mobile'])) ) || filter[keyName] === "", true));
        } else {
            return users;
        }
    }
}
@Component({
    selector: 'user-form',
    templateUrl: './app/user/user.tmpl.html',
    styleUrls: ['./app/user/css/user.css'],
    providers: [UserService]
})
export class UserComponent {
    constructor(private _userService: UserService) {
    }

    userWapper: UserWrapper;
    userLook: LookupWrapper;
    users: Array<User> = new Array<User>();
    user = new User(null, '', '', '', '', '', '', '');
    public filterText: string = '';
    public filterInput = new FormControl();
    isImageChanged = false;
    file1: Blob;
    countries: Array<string>;
    qualificatons: Array<string>;

    fileChange(input) {
        this.readFiles(input.files);
    }

    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    public file_srcs: string[] = [];
    public pro_src: string = "http://sangelit.com/images/demo/user.jpg";

    readFiles(files, index = 0) {
        // Create the file reader
        let reader = new FileReader();
        // If there is a file
        if index in files{
            this.readFile(files[index], reader, (result) => {

                var img = document.createElement("img");
                img.src = result;

                this.resize(img, 140, 140, (resized_jpeg, before, after) => {
                    this.file_srcs.push(resized_jpeg);
                    this.pro_src = resized_jpeg;
                    this.readFiles(files, index + 1);
                });
            });
        }
        ;
    }

    resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
        // This will wait until the img is loaded before calling this function
        return img.onload = () => {
            console.log("img loaded");
            // Get the images current width and height
            var width = img.width;
            var height = img.height;

            // Set the WxH to fit the Max values (but maintain proportions)
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            // create a canvas object
            var canvas = document.createElement("canvas");

            // Set the canvas to the new calculated dimensions
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            var dataUrl = canvas.toDataURL('image/jpeg');
            var byteString = atob(dataUrl.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            this.file1 = new Blob([ab], {type: 'image/jpeg'});
            this.isImageChanged = true;
            callback(dataUrl, img.src.length, dataUrl.length);
        };
    }

    ngOnInit() {
        this._userService.getAlluser().subscribe(
            userWrapper => this.extata(userWrapper),
            error => this.errorMessage(<any>error));
        this._userService.getCountry().subscribe(
            userLook => this.extata1(userLook),
            error => this.errorMessage(<any>error));
        this._userService.getQualification().subscribe(
            userLook => this.extata2(userLook),
            error => this.errorMessage(<any>error));
        /*this.filterInput
         .valueChanges
         .debounceTime(200)
         .subscribe(term => {
         this.filterText = term;
         });*/
    }


    public editUser(user: User) {
        this.user = user;

    }

    public newMember() {
        this.user = new User(null, 0, '', '', '', '', '', '');
    }


    onSubmit() {

        let userId = this.user.userId;
        this._userService.addEdituser(this.user).subscribe(
            userWrapper => this.extractGuard(userWrapper, userId),
            error => this.errorMessage(<any>error));


    }

    deleteUser(userId: number) {
        let deleteUser = window.confirm('Are you sure you want to delete the Guard?');
        if (deleteUser) {
            this._userService.deleteUser(userId).subscribe(
                userWrapper => this.extractGuard(userWrapper, -1),
                error => this.errorMessage(<any>error));
        }

    }

    private extata(userWrapper: UserWrapper) {
        if (userWrapper.responseStatus === 'VALID') {
            this.users = userWrapper.demoUsers;
        } else if (userWrapper.responseStatus === 'SERVERERROR') {
            alert('server error , please try later');
        }
    }

    private extata1(lookup: LookupWrapper) {
        this.countries = lookup.listData;
    }

    private extata2(lookup: LookupWrapper) {
        this.qualificatons = lookup.listData;
    }

    private extractGuard(userWrapper: UserWrapper, userId: number) {

        if (userWrapper.responseStatus === 'VALID') {
            this.user = userWrapper.demoUser;
            if (userId === null) {
                this.users.unshift(this.user);
            }
            if (userId === -1) {
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].userId === this.user.userId) {
                        this.users.splice(i, 1);
                        break;
                    }
                }
            }
            if (userId !== -1) {
                if (this.isImageChanged && this.user.userId !== null) {
                    let form = new FormData();
                    let name = "image.jpg";
                    form.append("file", this.file1, name);
                    form.append("userid", this.user.userId);
                    this._userService.fileUoload(form).subscribe(
                        userWrapper => this.extractUser(userWrapper),
                        error => this.errorMessage(<any>error));
                }
            }

        } else if (userWrapper.responseStatus === 'SERVERERROR') {
            alert('Server error');
        }
    }

    private errorMessage(message: string) {
        alert('Server error, please try later');
    }

    private showListScreen() {
    }


    private extractUser(userWrapper: UserWrapper) {
        if (userWrapper.responseStatus === 'VALID') {
            this.user = userWrapper.demoUser;
        } else if (userWrapper.responseStatus === 'SERVERERROR') {
            alert('server error , please try later');
        }
    }

}