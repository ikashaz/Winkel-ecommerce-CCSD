import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  images = [
    { url: 'assets/images/banner1.jpg', title: 'Urban Chic', description: 'Discover the latest urban fashion trends for men. From streetwear essentials to sleek tailored pieces, our collection combines style and comfort. Elevate your wardrobe with Urban Chic today!' },
    { url: 'assets/images/banner4.jpg', title: 'Classic Essentials', description: 'Timeless elegance meets modern versatility. Explore our curated selection of men’s wardrobe staples—crisp shirts, well-fitted denim, and versatile blazers. Elevate your everyday style with Classic Essentials.'},
    { url: 'assets/images/banner3.jpg', title: 'Adventurer’s Attire', description: 'For the modern man with a wanderlust spirit. Dive into our collection of rugged outdoor wear, functional layers, and adventure-ready accessories. Whether you’re exploring the city or the wilderness, find your perfect gear at Adventurer’s Attire'}
  ];
  
  
  products: Product[] = [];
    currentCategoryId: number = 1;
    theTotalElements: number = 1;
    searchMode: boolean = false;
  
    //new properties for pagination
    thePageNumber: number = 1;
    thePageSize: number = 4;
    previousCategoryId: number = 0;
    previousKeyword: string = "";
    constructor(
      private productService: ProductService,
      private route: ActivatedRoute,
      
    ) {}
    ngOnInit() {
      this.route.paramMap.subscribe(() => {
        this.listProducts();
      });
    }
    //check if "id" parameter is available
    listProducts() {
      this.searchMode = this.route.snapshot.paramMap.has('keyword');
  
      if (this.searchMode) {
        this.handleSearchProducts();
      } else {
        this.handleListProducts();
      }
    }
    handleSearchProducts() {
      const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
      //if we have a different keyword than previous
      //then set thePageNumber to 1
      //now search for the products using keyword
  
      if(this.previousKeyword !=theKeyword){
        this.thePageNumber = 1;
      }
  
      console.log(`keyword=${theKeyword},thePageNumber=${this.thePageNumber}`);
  
      this.previousKeyword = theKeyword;
  
      this.productService.searchProductPaginate(
        this.thePageNumber -1,
        this.thePageSize,
        theKeyword).subscribe(this.processResult());
    }
  
    handleListProducts() {
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      if (hasCategoryId) {
        //get id param string . convert string to  a number using the + symbol
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      } else {
        //not category id available .. default to category id 1
        this.currentCategoryId = 1;
      }
  
      //
      //check if we have a different category than previous
      //Note: Angular will reuse a component if it is currently being viewd
      //
  
      //if we have a different category id than previous
      //then set thePageNumber back to 1
      if (this.previousCategoryId != this.currentCategoryId) {
        this.thePageNumber = 1;
      }
  
      this.previousCategoryId = this.currentCategoryId;
  
      console.log(
        `currentCategoryId=${this.currentCategoryId},thePageNumber=${this.thePageNumber}`
      );
  
      //now get the products for the given category id
      this.productService
        .getProductListPaginate(
          this.thePageNumber - 1,
          this.thePageSize,
          this.currentCategoryId
        )
        .subscribe(this.processResult());
    }
    processResult(){
      return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }; 
    }
    updatePageSize(pageSize: number){
      this.thePageSize = pageSize;
      this.thePageNumber =1;
      this.listProducts();
    }
    
  }
  