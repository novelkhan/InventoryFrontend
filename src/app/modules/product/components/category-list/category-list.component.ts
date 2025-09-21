import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';
import { Category } from '../../../shared/models/inventory/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to load categories')
    });
  }

  addCategory(): void {
    this.router.navigate(['/inventory/categories/add']);
  }

  editCategory(id: string): void {
    this.router.navigate(['/inventory/categories/edit', id]);
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.sharedService.showNotification(true, 'Success', 'Category deleted successfully');
        this.loadCategories();
      },
      error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to delete category')
    });
  }
}