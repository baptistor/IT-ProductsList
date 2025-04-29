# Product Listing App

This project is a fullstack web application that displays a product catalog with pagination, category filtering, and price sorting.

- **Frontend**: Angular (Standalone components, custom directive, OnPush change detection)
- **Backend**: Java Spring Boot (REST API with pagination, filtering, and sorting)
- **API Endpoint**: `/products`

---


## How to run the project

### Backend (Spring Boot)

```bash
# Go to the backend directory
cd backProject/productListingAPI/

# Run the application
./mvnw spring-boot:run

```

API will be available at http://localhost:8080/products

### Frontend (Angular)

```bash
# Go to the frontend directory
cd frontProject/product-listing-front/

# Install dependencies
npm install

# Run the Angular app
npm run start --open

```

Frontend will be available at http://localhost:4200 


## Running the tests

### Backend (JUnit)
 ``` bash
 ./mvnw test
 ```

### Frontend (Jasmine/Karma)
 ``` bash
npm run test
 ```