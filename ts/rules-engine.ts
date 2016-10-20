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

interface IDiscountRule {
    calculateCustomerDiscount(customer: Customer): number;
}

class BirthdayDiscountRule implements IDiscountRule {
    calculateCustomerDiscount(customer: Customer): number {
        return customer.isBirthday() ? 0.1 : 0;
    }
}

class SeniorDiscountRule implements IDiscountRule {
    calculateCustomerDiscount(customer: Customer): number {
        return customer.isSenior() ? 0.05 : 0;
    }
}

class VeteranDiscountRule implements IDiscountRule {
    calculateCustomerDiscount(customer: Customer): number {
        return customer.isVeteran ? 0.1 : 0;
    }
}

class LoyalCustomerRule implements IDiscountRule {

    constructor(private yearsAsCustomer: number, private discount: number) {}

    calculateCustomerDiscount(customer: Customer): number {
        if (customer.hasBeenLoyalForYears(this.yearsAsCustomer)) {
            let birthdayRule = new BirthdayDiscountRule();

            return this.discount + birthdayRule.calculateCustomerDiscount(customer);
        }

        return 0;
    }
}

class NewCustomerDiscountRule implements IDiscountRule {

    constructor() {}

    calculateCustomerDiscount(customer: Customer): number {
        return !customer.dateOfFirstPurchase ? 0.15 : 0;
    }
}

class RulesDiscountCalculator implements IDiscountRule {
    private _rules: Array<IDiscountRule> = new Array<IDiscountRule>();

    constructor() {
        this._rules.push(new BirthdayDiscountRule());
        this._rules.push(new SeniorDiscountRule());
        this._rules.push(new VeteranDiscountRule());
        this._rules.push(new NewCustomerDiscountRule());
        this._rules.push(new LoyalCustomerRule(1, 0.1));
        this._rules.push(new LoyalCustomerRule(5, 0.12));
        this._rules.push(new LoyalCustomerRule(10, 0.2));
    }

    calculateCustomerDiscount(customer: Customer): number
    {
        let discount: number = 0;

        for (let i = 0; i < this._rules.length; i++) {
            discount = Math.max(this._rules[i].calculateCustomerDiscount(customer), discount);
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
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(seniorCustomer)) === 0.05);

console.log("Veteran Customer should has 0.10 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(veteranCustomer)) === 0.10);

console.log("Customer with BD should has 0.10 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(bdCustomer)) === 0.10);

console.log("Customer first purchase should has 0.15 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(firstPurchaseCustomer)) === 0.15);

console.log("Loyal Customer from 1 year should has 0.10 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(loyalCustomerYearsOne)) === 0.10);

console.log("Loyal Customer from 5 years should has 0.12 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(loyalCustomerYearsFive)) === 0.12);

console.log("Loyal Customer from 10 years should has 0.20 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(loyalCustomerYearsTen)) === 0.20);

console.log("Loyal Customer from 10 years with BD should has 0.30 discount: ", 
    ((new RulesDiscountCalculator()).calculateCustomerDiscount(loyalCustomerYearsTenBD)) === 0.30);