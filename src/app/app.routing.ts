import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";

const appRoutes: Routes = [
    { path: '', redirectTo: '/about', pathMatch: 'full' },
    /*{path: 'about', component: AboutComponent, data: {title: 'About'}}*/
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
