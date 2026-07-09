# online-shop-project

Manage online-store, includes making a new order, saving carts and manage customers. <br>
<br>
Using express server, .env, writing with JS.

## endpoints list

|METHOD | ENDPOINTS | PURPOSE|
|-|-|-|
|/GET| /| start message|
|/GET|/health|server checking|
|/GET|/products|full products list|
|/GET|/cart|customer current cart|
|/POST|/cart/items|adding item to customer current cart|
|/DELETE|/cart/items/:productId|remove item from customer current cart|
|/GET|/account/balance| showing customer current balance|
|/POST|/orders/checkout| making checkout and creating a new order|
|/GET|/orders|showing customer orders history|

## how to run
``` text
npm start
```