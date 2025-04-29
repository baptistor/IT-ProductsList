import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ApiHelperService } from './service/api-helper.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HoverHighlightDirective } from '../hover-highlight/hover-highlight.directive';
import { ChangeDetectorRef } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let apiHelperSpy: jasmine.SpyObj<ApiHelperService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiHelperService', ['get']);
    apiSpy.get.and.returnValue(of({ body: { content: [] } })); // <<== AJOUT IMPORTANT
  
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HoverHighlightDirective,
        ProductListComponent
      ],
      providers: [
        { provide: ApiHelperService, useValue: apiSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    apiHelperSpy = TestBed.inject(ApiHelperService) as jasmine.SpyObj<ApiHelperService>;
    fixture.detectChanges();
  });
  
  it('should filter products by category correctly', fakeAsync(() => {
    const mockProducts = [
      { id: 1, name: 'Product 1', category: 'Books', price: 10 },
      { id: 2, name: 'Product 2', category: 'Electronics', price: 100 },
      { id: 3, name: 'Product 3', category: 'Books', price: 20 }
    ];
    apiHelperSpy.get.and.returnValue(of({ body: { content: mockProducts } }));

    component.loadAllCategories();
    tick();
    component.allCategories = ['Books', 'Electronics']; // simulate already loaded categories
    component.currentCategory = 0; // filter on 'Books'
    apiHelperSpy.get.and.returnValue(of({ body: { content: mockProducts.filter(p => p.category === 'Books') } }));
    component.filterCategory();
    tick();

    expect(component.products.length).toBe(2);
    expect(component.products.every(p => p.category === 'Books')).toBeTrue();
  }));

  it('should sort products by price correctly', fakeAsync(() => {
    const mockProductsSorted = [
      { id: 1, name: 'Product 1', category: 'Books', price: 10 },
      { id: 3, name: 'Product 3', category: 'Books', price: 20 },
      { id: 2, name: 'Product 2', category: 'Electronics', price: 100 }
    ];
    apiHelperSpy.get.and.returnValue(of({ body: { content: mockProductsSorted } }));

    component.loadProductsFilterPrice();
    tick();

    expect(component.products.length).toBe(3);
    expect(component.products[0].price).toBeLessThanOrEqual(component.products[1].price);
    expect(component.products[1].price).toBeLessThanOrEqual(component.products[2].price);
  }));

  it('should handle error when API call fails', fakeAsync(() => {
    apiHelperSpy.get.and.returnValue(throwError(() => new Error('API Error')));
    component.loadProducts();
    tick();
    expect(component.products.length).toBe(0);
  }));
});
