import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import {AppComponent} from "./app.component";

import {UserComponent, GuardFilterPipe} from "./user/component/user.component";
import {Pagination} from './util/pagination.component';
import {Pager} from './util/pager.component';
import {routing, appRoutingProviders} from './app.routing';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpModule,
    ],
    declarations: [
        AppComponent,
        UserComponent,
        GuardFilterPipe,
        Pagination,
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}