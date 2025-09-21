import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { SharedService } from '../../../shared/shared.service';
import { Category } from '../../../shared/models/inventory/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)]
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;
    if (this.isEditMode) {
      this.loadCategory();
    }
  }

  loadCategory(): void {
    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => this.categoryForm.patchValue(category),
        error: (err) => this.sharedService.showNotification(false, 'Error', 'Failed to load category')
      });
    }
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;
      if (this.isEditMode && this.categoryId) {
        this.categoryService.updateCategory(this.categoryId, category).subscribe({
          next: () => {
            this.sharedService.showNotification(true, 'Success', 'Category updated successfully');
            this.router.navigate(['/inventory/categories']);
          },
          error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to update category')
        });
      } else {
        this.categoryService.addCategory(category).subscribe({
          next: () => {
            this.sharedService.showNotification(true, 'Success', 'Category added successfully');
            this.router.navigate(['/inventory/categories']);
          },
          error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to add category')
        });
      }
    }
  }
}