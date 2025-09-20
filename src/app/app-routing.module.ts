import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthorizationGuard } from './modules/shared/guards/authorization.guard';
import { NotFoundComponent } from './modules/shared/components/errors/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthorizationGuard],
    children: [
      // { path: 'customer', component: CustomerComponent },
      // { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(module => module.AdminModule) },
      // { path: 'packages', loadChildren: () => import('./modules/package/package.module').then(module => module.PackageModule) },
    ]
  },
  // Implenting lazy loading by the following format
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(module => module.AuthModule) },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
