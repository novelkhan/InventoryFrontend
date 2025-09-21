import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../shared/guards/authorization.guard'; // তোমার গার্ড
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent, canActivate: [AuthorizationGuard] },
  { path: 'products/add', component: ProductFormComponent, canActivate: [AuthorizationGuard] },
  { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [AuthorizationGuard] },
  { path: 'categories', component: CategoryListComponent, canActivate: [AuthorizationGuard] },
  { path: 'categories/add', component: CategoryFormComponent, canActivate: [AuthorizationGuard] },
  { path: 'categories/edit/:id', component: CategoryFormComponent, canActivate: [AuthorizationGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }