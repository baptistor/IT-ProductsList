import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ApiHelperService } from './service/api-helper.service';
import { CommonModule } from '@angular/common';
import { HoverHighlightDirective } from '../hover-highlight/hover-highlight.directive';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    HoverHighlightDirective,
  ],  
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,


})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  allProducts: any[] = [];
  numberCategory: number = 0;
  allCategories: any[]=[];
  currentCategory: number = 0;
  currentPage: number = 0;
  pageSize: number = 7;
  onSortCategory: boolean = false;
  onSortPrice: boolean = false;
  onNormalConfig: boolean = false;
  currentPageForPrice: number = 0;
  hasError: boolean = false;

  constructor(private apiHelper: ApiHelperService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadAllCategories();
  }

  loadProducts(): void {
    this.apiHelper.get({
      endpoint: '/products',
      queryParams: {
        page: this.currentPage,
        size: this.pageSize,
      },
    }).subscribe({
      next: response => {
        this.products = response.body.content;
        this.onNormalConfig=true;
        this.onSortCategory = false;
        this.onSortPrice = false;
        this.currentCategory = 0;
        this.currentPageForPrice = 0;
        this.cdr.markForCheck();
      },
      error: err => {
        this.hasError = true;
        console.error('Failed to load products', err);
        this.cdr.markForCheck();
      }

    });
  }


  loadProductsFilterPrice(): void {
    this.apiHelper.get({
      endpoint: '/products',
      queryParams: {
        page: this.currentPageForPrice,
        size: this.pageSize,
        sort: "price",
      },
    }).subscribe(response => {
      this.products = response.body.content;
      this.onNormalConfig=false;
      this.onSortCategory = false;
      this.onSortPrice = true;
      this.currentCategory = 0;
      this.currentPage = 0;
      this.cdr.markForCheck();
    });
  }

  filterCategory(): void {
    this.apiHelper.get({
      endpoint: '/products',
      queryParams: {
        size: 9999,
        category: this.allCategories[this.currentCategory],
      },
    }).subscribe(response => {
      this.products = response.body.content;
      this.onSortCategory = true;
      this.onNormalConfig = false;
      this.onSortPrice = false;
      this.currentPage = 0;
      this.currentPageForPrice = 0;
      this.cdr.markForCheck();
    });
  }

  loadAllCategories(): void {
    this.apiHelper.get({
      endpoint: '/products',
      queryParams: {
        size: 99999,
      },
    }).subscribe(response => {
      this.allProducts = response.body.content;
      this.allCategories = [];

      for (let i = 0; i < this.allProducts.length; i++) {
        if (!this.allCategories.includes(this.allProducts[i].category)) {
          this.allCategories.push(this.allProducts[i].category);
        }
      }
    this.allCategories.sort();
    this.numberCategory = this.allCategories.length;
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadProducts();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPageForPrice(): void {
    this.currentPageForPrice++;
    this.loadProductsFilterPrice();
  }

  previousPageForPrice(): void {
    if (this.currentPageForPrice > 0) {
      this.currentPageForPrice--;
      this.loadProductsFilterPrice();
    }
  }
  nextCategory(): void {
    this.currentCategory++;
    this.filterCategory();
  }

  previousCategory(): void {
    if (this.currentCategory > 0) {
      this.currentCategory--;
      this.filterCategory();
    }
  }

  changePageSize(): void {
    this.pageSize = Number((<HTMLInputElement>document.getElementById("pageSize")).value);
    this.currentPage = 0;
    this.loadProducts();
  }

  changePageSizeForPrice(): void {
    this.pageSize = Number((<HTMLInputElement>document.getElementById("pageSize")).value);
    this.currentPageForPrice = 0;
    this.loadProductsFilterPrice();
  }

  trackByProduct(index: number, product: any): number {
    return product.id;
  }
  
}
