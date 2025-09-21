import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SharedService } from '../../../shared/shared.service';
import { Product } from '../../../shared/models/inventory/product.model';
import { Category } from '../../../shared/models/inventory/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: string | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      categoryId: ['', Validators.required],
      imageBase64: [null]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    if (this.isEditMode) {
      this.loadProduct();
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.sharedService.showNotification(false, 'Error', 'Failed to load categories')
    });
  }

  loadProduct(): void {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.imagePreview = product.imageBase64 ? 'data:image/jpeg;base64,' + product.imageBase64 : null;
        },
        error: (err) => this.sharedService.showNotification(false, 'Error', 'Failed to load product')
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productForm.patchValue({ imageBase64: (reader.result as string).split(',')[1] });
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe({
          next: () => {
            this.sharedService.showNotification(true, 'Success', 'Product updated successfully');
            this.router.navigate(['/inventory/products']);
          },
          error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to update product')
        });
      } else {
        this.productService.addProduct(product).subscribe({
          next: () => {
            this.sharedService.showNotification(true, 'Success', 'Product added successfully');
            this.router.navigate(['/inventory/products']);
          },
          error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to add product')
        });
      }
    }
  }
}