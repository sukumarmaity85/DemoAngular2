import {Injectable} from "@angular/core";
import {Http, Headers, Response}       from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {User} from '../model/user';
import {UserWrapper} from '../model/user.wrapper';
import {AppSettings} from '../../app.settings';

@Injectable()
export class UserService {
    constructor(private http: Http) {
    }

    public getAlluser(): Observable<UserWrapper> {
        let body = '';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
        return this.http.post(`${AppSettings.API_ENDPOINT}/sms-admin-rest/rest/api/demouser/getAll`, body, {
            headers: headers
        })
            .map(this.extractData);
    }
    public getCountry(): Observable<Array> {
        let body = '';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
        return this.http.post(`${AppSettings.API_ENDPOINT}/sms-admin-rest/rest/api/demouser/getAllCountry`, body, {
            headers: headers
        })
            .map(this.extractData);
    }
    public getQualification(): Observable<Array> {
        let body = '';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
        return this.http.post(`${AppSettings.API_ENDPOINT}/sms-admin-rest/rest/api/demouser/getQualification`, body, {
            headers: headers
        })
            .map(this.extractData);
    }

    public addEdituser(user: User): Observable<UserWrapper> {
        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
        return this.http.post(`${AppSettings.API_ENDPOINT}/sms-admin-rest/rest/api/demouser/saveOrUpdate`, body, {
            headers: headers
        })
            .map(this.extractSingleData);
    }


    public deleteUser(userId: number): Observable<UserWrapper> {
        let body = JSON.stringify({userId});
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
        return this.http.post(`${AppSettings.API_ENDPOINT}/sms-admin-rest/rest/api/demouser/delete`, body, {
            headers: headers
        })
            .map(this.extractSingleData);
    }

    public fileUoload(form: FormData): Observable<UserWrapper> {
        form.append("homepath", AppSettings.IMAGEBASEPATH);
        let headers = new Headers();
        // headers.append('Content-Type', 'multipart/form-data');
        headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
        return this.http.post(`${AppSettings.API_ENDPOINT}/sms-rest-api/rest/user/upload`, form, {
            headers: headers
        })
            .map(this.extractSingleData);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        return res.json();
    }

    private extractSingleData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        console.log(res.json());
        return res.json();
    }

    private handleError(error: any) {
        let errMsg = error.message || 'Server error';
        return Observable.throw(errMsg);
    }
}