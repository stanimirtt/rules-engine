///<reference path="typings/moment/moment.d.ts" />
var Customer = (function () {
    function Customer(dateOfBirth, dateOfFirstPurchase, isVeteran) {
        this.dateOfBirth = dateOfBirth;
        this.dateOfFirstPurchase = dateOfFirstPurchase;
        this.isVeteran = isVeteran;
    }
    return Customer;
}());
var DiscountCalculator = (function () {
    function DiscountCalculator() {
    }
    DiscountCalculator.prototype.CalculateDiscountPercentage = function (customer) {
        var discount = 0;
        if (moment(customer.dateOfBirth) < moment().add(-65, 'years')) {
            // senior discount 5%
            discount = 0.05;
        }
        if (moment(customer.dateOfBirth).date() == moment().date() &&
            moment(customer.dateOfBirth).get('month') == moment().get('month')) {
            // birthday 10%
            discount = Math.max(discount, 0.10);
        }
        if (customer.dateOfFirstPurchase) {
            if (moment(customer.dateOfFirstPurchase) < moment().add(-1, 'years')) {
                // after 1 year, loyal customers get 10%
                discount = Math.max(discount, 0.10);
                if (moment(customer.dateOfFirstPurchase) < moment().add(-5, 'years')) {
                    // after 5 years, 12%
                    discount = Math.max(discount, 0.12);
                    if (moment(customer.dateOfFirstPurchase) < moment().add(-10, 'years')) {
                        // after 10 years, 20%
                        discount = Math.max(discount, 0.20);
                    }
                }
                if (moment(customer.dateOfBirth).date() == moment().date() &&
                    moment(customer.dateOfBirth).get('month') == moment().get('month')) {
                    // birthday additional 10%
                    discount += 0.10;
                }
            }
        }
        else {
            // first time purchase discount of 15%
            discount = Math.max(discount, 0.15);
        }
        if (customer.isVeteran) {
            // veterans get 10%
            discount = Math.max(discount, 0.10);
        }
        return discount;
    };
    return DiscountCalculator;
}());
// Tests
var seniorCustomer = new Customer(new Date("10/03/1927"), new Date("10/10/2016"), false);
var veteranCustomer = new Customer(new Date("10/03/1927"), new Date("10/10/2016"), true);
var bdCustomer = new Customer(new Date("10/15/1975"), new Date("10/10/2016"), false);
var firstPurchaseCustomer = new Customer(new Date("10/15/1975"), null, false);
var loyalCustomerYearsOne = new Customer(new Date("10/13/1975"), new Date("10/10/2015"), false);
var loyalCustomerYearsFive = new Customer(new Date("10/13/1975"), new Date("10/10/2009"), false);
var loyalCustomerYearsTen = new Customer(new Date("10/13/1975"), new Date("10/10/1999"), false);
var loyalCustomerYearsTenBD = new Customer(new Date("10/15/1975"), new Date("10/10/1999"), false);
console.log("Senior Customer should has 0.05 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(seniorCustomer)) === 0.05);
console.log("Veteran Customer should has 0.10 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(veteranCustomer)) === 0.10);
console.log("Customer with BD should has 0.10 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(bdCustomer)) === 0.10);
console.log("Customer first purchase should has 0.15 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(firstPurchaseCustomer)) === 0.15);
console.log("Loyal Customer from 1 year should has 0.10 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsOne)) === 0.10);
console.log("Loyal Customer from 5 years should has 0.12 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsFive)) === 0.12);
console.log("Loyal Customer from 10 years should has 0.20 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsTen)) === 0.20);
console.log("Loyal Customer from 10 years with BD should has 0.30 discount: ", ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsTenBD)) === 0.30);
