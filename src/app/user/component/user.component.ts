import {Component, OnInit} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';
import {FormControl} from '@angular/forms';
import {User} from '../model/user';
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
                (memo && (new RegExp(filter[keyName], 'gi').test(user['userDetailsVo']['fullname']) ||
                new RegExp(filter[keyName], 'gi').test(user['gateNo'])
                || new RegExp(filter[keyName], 'gi').test(user['shiftTime'])) ) || filter[keyName] === "", true));
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
    constructor(private _userService: UserService) {}
    userWapper: UserWrapper;
    users: Array<User> = new Array<User>();
    user = new User(null, '', '', '', '', '', Gobal.loginWrapper.user.mappingId);
    public filterText: string = '';
    public filterInput = new FormControl();
    isImageChanged = false;
    file1: Blob;
    backBtnType = 'VIEW';
    todayDate = new Date().getTime();

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
    public pro_src: string = "http://sangelit.com/images/team/user.jpg";

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
        this.todayDate = new Date().getTime();
        document.getElementById('pageloader').style.display = "block";
        document.getElementById('pagetitle').innerHTML = "Guards";
        this.backBtnType = 'VIEW';
        this.divVisible = Gobal.divVisible;
        Gobal.divVisible.listview = false;
        Gobal.divVisible.formview = true;
        Gobal.divVisible.detailview = true;
        Gobal.hideBg();        
        this._guardService.getAlluser().subscribe(
            userWrapper => this.extata(userWrapper),
            error => this.errorMessage(<any>error));
        this.filterInput
            .valueChanges
            .debounceTime(200)
            .subscribe(term => {
                this.filterText = term;
            });
    }

    public viewUser(user: User) {
        this.backBtnType = 'VIEW';
        Gobal.showBg();
        this.divVisible.addbtn = true;
        this.divVisible.listview = true;
        this.divVisible.detailview = false;
        this.divVisible.formview = true;
        this.user = user;
        if (user.userDetailsVo.image !== '' || user.userDetailsVo.image !== null) {
            this.pro_src = "http://sangelit.com/images/team/" + user.userDetailsVo.image + '?' + new Date().getTime();
        }

    }

    public editUser(user: User) {
        Gobal.hideBg();
        this.backBtnType = 'EDIT';
        this.divVisible.addbtn = true;
        this.divVisible.listview = true;
        this.divVisible.detailview = true;
        this.divVisible.formview = false;
        this.user = user;
        this.checkValue('fullname');
        this.checkValue('mobile');
        this.checkValue('fulladdress');

    }

    public newMember() {
        Gobal.hideBg();
        this.backBtnType = 'VIEW';
        this.divVisible.addbtn = true;
        this.divVisible.listview = true;
        this.divVisible.detailview = true;
        this.divVisible.formview = false;
        let userDetailVo: UserDetailVo = new UserDetailVo(null, 0, Gobal.loginWrapper.user.mappingId, '', '', '', '', '', '', '', '', '');
        this.user = new User(null, 0, '', '', '', '', Gobal.loginWrapper.user.mappingId, userDetailVo, true, true);
        this.user.userDetailsVo = userDetailVo;       
        this.addValidation('fullname');
        this.addValidation('mobile');
        this.addValidation('fulladdress');
    }

    private addValidation(txt) {
        let inputdiv = document.getElementById(txt);
        inputdiv.classList.remove("input-green");
        inputdiv.classList.add("input-red");

    }

    onSubmit() {
        document.getElementById('pageloader').style.display = "block";
        let postDate = document.getElementById('shiftTime').value;
        this.user.userDetailsVo.shiftTime = postDate;
        let userId = this.user.userId;
        this._guardService.addEditGuard(this.user).subscribe(
            userWrapper => this.extractGuard(userWrapper, userId),
            error => this.errorMessage(<any>error));


    }

    deleteUser(user: User) {
        this.user = user;
        let deleteUser = window.confirm('Are you sure you want to delete the Guard?');
        if (deleteUser) {
            document.getElementById('pageloader').style.display = "block";
            this._guardService.deleteGuard(this.user).subscribe(
                userWrapper => this.extractGuard(userWrapper, -1),
                error => this.errorMessage(<any>error));
        }

    }

    private extata(userlistWrapper: UserListWrapper) {
        if (userlistWrapper.loginStatus === 'VALID') {
            this.users = userlistWrapper.users;
            this.message1.descr = "";
        } else if (userlistWrapper.loginStatus === 'EXPIRED') {
            this.message1.descr = 'Your memberId is expired, please contact admin';
        } else if (userlistWrapper.loginStatus === 'INVALID') {
            this.message1.descr = 'Your memberId or password is invalid';
        } else if (userlistWrapper.loginStatus === 'SERVERERROR') {
            this.message1.descr = 'server error , please try later';
        }
        document.getElementById('pageloader').style.display = "none";
    }

    private extractGuard(userWrapper: UserWrapper, userId: number) {

        if (userWrapper.loginStatus === 'VALID') {
            Gobal.showBg();
            this.divVisible.listview = true;
            this.divVisible.detailview = false;
            this.divVisible.formview = true;
            this.user = userWrapper.user;
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
                this.divVisible.listview = false;
                this.divVisible.detailview = true;
                this.divVisible.formview = true;
                Gobal.hideBg();
            }
            if (userId !== -1) {
                if (this.isImageChanged && this.user.userId !== null) {
                    document.getElementById('pageloader').style.display = "block";
                    let form = new FormData();
                    let name = "image.jpg";
                    form.append("file", this.file1, name);
                    form.append("userid", this.user.userId);
                    this._guardService.fileUoload(form).subscribe(
                        userWrapper => this.extractUser(userWrapper),
                        error => this.errorMessage(<any>error));
                }
            }

        } else if (userWrapper.loginStatus === 'EXPIRED') {
            alert('Your memberId is expired, please contact admin');
        } else if (userWrapper.loginStatus === 'INVALID') {
            alert('Your memberId or password is invalid');
        } else if (userWrapper.loginStatus === 'SERVERERROR') {
            alert('server error , please try later');
        }
        document.getElementById('pageloader').style.display = "none";
    }

    private errorMessage(message: string) {
        this.message1.descr = 'Server error, please try later';
        alert(this.message1.descr);
    }

    private showListScreen() {
        if (this.backBtnType === 'VIEW') {
            Gobal.hideBg();
            if (Gobal.loginWrapper.user.type === 'ADMIN') {
                this.divVisible.addbtn = false;
            }
            this.divVisible.listview = false;
            this.divVisible.detailview = true;
            this.divVisible.formview = true;
        }
        if (this.backBtnType === 'EDIT') {
            this.backBtnType = 'VIEW';
            Gobal.showBg();
            this.divVisible.addbtn = true;
            this.divVisible.listview = true;
            this.divVisible.detailview = false;
            this.divVisible.formview = true;
        }
    }

    private  checkValue(txt) {
        let inputdiv = document.getElementById(txt);
        if (inputdiv.value === '') {
            inputdiv.classList.remove("input-green");
            inputdiv.classList.add("input-red");
        } else {
            inputdiv.classList.remove("input-red");
            inputdiv.classList.add("input-green");
        }
    }

    private extractUser(userWrapper: UserWrapper) {
        if (userWrapper.loginStatus === 'VALID') {
            this.user = userWrapper.user;
        } else if (userWrapper.loginStatus === 'EXPIRED') {
            alert('Your memberId is expired, please contact admin');
        } else if (userWrapper.loginStatus === 'INVALID') {
            alert('Your memberId or password is invalid');
        } else if (userWrapper.loginStatus === 'SERVERERROR') {
            alert('server error , please try later');
        }
        document.getElementById('pageloader').style.display = "none";
    }

    private mobileValidation(txt) {
        let inputdiv = document.getElementById(txt);
        if (inputdiv.value === '' || inputdiv.value.length < 10) {
            inputdiv.classList.remove("input-green");
            inputdiv.classList.add("input-red");
        } else {
            inputdiv.classList.remove("input-red");
            inputdiv.classList.add("input-green");
        }
    }
}