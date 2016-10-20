///<reference path="typings/moment/moment.d.ts" />

interface ICustomer {
	dateOfBirth: Date;
	dateOfFirstPurchase: Date;
	isVeteran: boolean;
    isSenior(): boolean;
    isBirthday(): boolean;
    isExisting(): boolean;
    hasBeenLoyalForYears(years: number): boolean;
}

class Customer implements ICustomer {
	constructor(public dateOfBirth, public dateOfFirstPurchase, public isVeteran) {}

    isSenior (): boolean {
       return moment(this.dateOfBirth) < moment().add(-65, 'years');
    }

    isBirthday (): boolean {
        return moment(this.dateOfBirth).date() == moment().date() &&
                moment(this.dateOfBirth).get('month') == moment().get('month') ;
    }

    isExisting () {
        return this.dateOfFirstPurchase;
    }

    hasBeenLoyalForYears (years: number) {
        return moment(this.dateOfFirstPurchase) < moment().add(-years, 'years');
    }
}

class DiscountCalculator
{
    public CalculateDiscountPercentage(customer: Customer): number
    {
        let discount: number = 0;

        if (customer.isSenior())
        {
            // senior discount 5%
            discount = 0.05;
        }

        if (customer.isBirthday())
        {
            // birthday 10%
            discount = Math.max(discount, 0.10);
        }

        if (customer.isExisting())
        {
            if (customer.hasBeenLoyalForYears(1))
            {
                // after 1 year, loyal customers get 10%
                discount = Math.max(discount, 0.10);
                if (customer.hasBeenLoyalForYears(5))
                {
                    // after 5 years, 12%
                    discount = Math.max(discount, 0.12);
                    if (customer.hasBeenLoyalForYears(10))
                    {
                        // after 10 years, 20%
                        discount = Math.max(discount, 0.2);
                    }
                }

                if (customer.isBirthday())
                {
                    // birthday additional 10%
                    discount += 0.1;
                }
            }
        }
        else
        {
            // first time purchase discount of 15%
            discount = Math.max(discount, 0.15);
        }
        if (customer.isVeteran)
        {
            // veterans get 10%
            discount = Math.max(discount, 0.10);
        }

        return discount;
    }
}



let seniorCustomer = new Customer(new Date("10/03/1927"), new Date("10/10/2016"), false);
let veteranCustomer = new Customer(new Date("10/03/1927"), new Date("10/10/2016"), true);
let bdCustomer = new Customer(new Date("10/15/1975"), new Date("10/10/2016"), false);
let firstPurchaseCustomer = new Customer(new Date("10/15/1975"), null, false);
let loyalCustomerYearsOne = new Customer(new Date("10/13/1975"), new Date("10/10/2015"), false);
let loyalCustomerYearsFive = new Customer(new Date("10/13/1975"), new Date("10/10/2009"), false);
let loyalCustomerYearsTen = new Customer(new Date("10/13/1975"), new Date("10/10/1999"), false);
let loyalCustomerYearsTenBD = new Customer(new Date("10/15/1975"), new Date("10/10/1999"), false);

console.log("Senior Customer should has 0.05 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(seniorCustomer)) === 0.05);

console.log("Veteran Customer should has 0.10 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(veteranCustomer)) === 0.10);

console.log("Customer with BD should has 0.10 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(bdCustomer)) === 0.10);

console.log("Customer first purchase should has 0.15 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(firstPurchaseCustomer)) === 0.15);

console.log("Loyal Customer from 1 year should has 0.10 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsOne)) === 0.10);

console.log("Loyal Customer from 5 years should has 0.12 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsFive)) === 0.12);

console.log("Loyal Customer from 10 years should has 0.20 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsTen)) === 0.20);

console.log("Loyal Customer from 10 years with BD should has 0.30 discount: ", 
    ((new DiscountCalculator()).CalculateDiscountPercentage(loyalCustomerYearsTenBD)) === 0.30);