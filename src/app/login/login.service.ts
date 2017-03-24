import {Injectable} from "@angular/core";
import { Http, Headers, Response}       from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {User} from './user';

@Injectable()
export class LoginService {
	constructor (private http: Http) {
	}
  getLoginDetails(user_id: string, password: string): Observable<User> {
      let body = JSON.stringify({ user_id, password });
      alert(body);
	  let headers = new Headers();
	  headers.append('Content-Type', 'application/json');
	  headers.append('Authorization', 'Basic YWRtaW46MTIzNDU2');
	return this.http.post(`http://localhost:8080/sms-rest-api/rest/user/login`, body, {
	      headers: headers
    })
      .map(this.extractData);
	  }
  private extractData(res: Response) {
	    if (res.status < 200 || res.status >= 300) {
	    	 console.log('Bad response status: ');
	      throw new Error('Bad response status: ' + res.status);
	    }
	    return res.json();
	  }
  private handleError (error: any) {
	    // In a real world app, we might send the error to remote logging infrastructure
	    let errMsg = error.message || 'Server error';
	    console.error(errMsg); // log to console instead
	    return Observable.throw(errMsg);
	  }
}