let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
        if (err) throw err;
        console.log("item id" + " | "
                + "product name" + " | "
                + "department name" + " | "
                + "price" + " | "
                + "stock quantity" + "\n");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | "
                + res[i].product_name + " | "
                + res[i].department_name + " | "
                + res[i].price + " | "
                + res[i].stock_quantity + "\n");
          }
          console.log("-----------------------------------");
          customerPrompts();
        });
}

let promptQuestions = [{
    name: "itemId",
    type: "input",
    message: "Please enter the ID of the product you wish to purchase",
}, {
    name: "stockQuantity",
    type: "input",
    message: "Please enter the quantity you would like to purchase"
}];

function customerPrompts() {

    inquirer.prompt(promptQuestions).then(function(answer) {
        connection.query("SELECT * FROM products WHERE item_id = " + answer.itemId, function(err, res) {
            if (err) throw err;
            let itemPrice = res[0].price;
            let total = (answer.stockQuantity * itemPrice);
            if (res[0].stock_quantity < answer.stockQuantity) {
                console.log("\n Insufficient inventory. \n")
                displayProducts();
            } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.stockQuantity + " WHERE item_id = " + answer.itemId, function (err, res) {
                    if (err) throw err;
                    console.log("Thank you for your purchase! \nYour total comes to: $" + total);
                endApp();
                });
            }
        })
    });
}

function endApp() {
    connection.end();
}