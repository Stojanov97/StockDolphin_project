set type=%1
set command=npx nodemon

start cmd /k "%command% ./services/auth"
start cmd /k "%command% ./services/categories"
start cmd /k "%command% ./services/items"
start cmd /k "%command% ./services/orders"
start cmd /k "%command% ./services/suppliers"
start cmd /k "%command% ./services/invoices"
start cmd /k "%command% ./services/socket"
start cmd /k "%command% ./services/proxy"