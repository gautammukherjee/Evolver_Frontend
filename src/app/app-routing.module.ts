import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePasswordComponent } from './manage-password/manage-password.component';
import { NoPageComponent } from './no-page/no-page.component';
import { BioInfomaticsComponent } from './bio-infomatics/bio-infomatics.component';
import { EventChartComponent } from './event-chart/event-chart.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Logout', animation: 'LogoutPage' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'bio_infomatics',
    component: BioInfomaticsComponent
  },
  {
    path: 'manage-password',
    component: ManagePasswordComponent
  },
  {
    path: 'scenario',
    component: ScenarioComponent
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent
  },
  {
    path: 'preview',
    component: PreviewComponent
  },
  {
    path: '**', // 404 page
    component: NoPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
