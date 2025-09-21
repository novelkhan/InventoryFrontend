import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../../shared/models/inventory/product.model';
import { Category } from '../../../shared/models/inventory/category.model';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  searchQuery: string = '';
  page: number = 1;
  limit: number = 10;
  totalCount: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to load categories')
    });
  }

  loadProducts(): void {
    if (this.searchQuery) {
      this.productService.searchProducts(this.searchQuery, this.page, this.limit).subscribe({
        next: (response) => {
          this.products = response.data;
          this.totalCount = response.totalCount;
        },
        error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to load products')
      });
    } else {
      this.productService.getAllProducts(this.selectedCategoryId, this.minPrice, this.maxPrice, this.page, this.limit).subscribe({
        next: (response) => {
          this.products = response.data;
          this.totalCount = response.totalCount;
        },
        error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to load products')
      });
    }
  }

  onSearch(): void {
    this.page = 1; // সার্চ করার সময় পেজ রিসেট করা
    this.loadProducts();
  }

  onFilter(): void {
    this.page = 1; // ফিল্টার করার সময় পেজ রিসেট করা
    this.loadProducts();
  }

  addProduct(): void {
    this.router.navigate(['/inventory/products/add']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/inventory/products/edit', id]);
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.sharedService.showNotification(true, 'Success', 'Product deleted successfully');
        this.loadProducts();
      },
      error: (err) => this.sharedService.showNotification(false, 'Error', err.error || 'Failed to delete product')
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.page * this.limit < this.totalCount) {
      this.page++;
      this.loadProducts();
    }
  }
}