A coding sample for Avant using a very simple AngularJS implementation.

### Functional Requirements

    Create an implementation of the following:
    
    A line of credit product.  This is like a credit card except theres no card.
    It should work like this:
    
      - Have a built in APR and credit limit
      - Be able to draw ( take out money ) and make payments.
      - Keep track of principal balance and interest on the line of credit
      - APR Calculation based on the outstanding principal balance over real number of days.
      - Interest is not compounded, so it is only charged on outstanding principal.
      - Keep track of transactions such as payments and draws on the line and when
        they occured.
      - 30 day payment periods.  Basically what this means is that interest will not be
        charged until the closing of a 30 day payment period.  However, when it is charged,
        it should still be based on the principal balance over actual number of days outstanding
        during the period, not just ending principal balance.
    
    Couple of Scenarios how it would play out:
    
    Scenario 1:
    
    Someone creates a line of credit for 1000$ and 35% APR.
    
    He draws 500$ on day one so his remaining credit limit is 500$ and his balance is 500$.  
    He keeps the money drawn for 30 days.  He should owe 500$ * 0.35 / 365 * 30 = 14.38$ worth
    of interest on day 30.  Total payoff amount would be 514.38$
    
    Scenario 2:
    
    Someone creates a line of credit for 1000$ and 35% APR.
    
    He draws 500$ on day one so his remaining credit limit is 500$ and his balance is 500$.
    He pays back 200$ on day 15 and then draws another 100$ on day 25.  His total owed interest on
    day 30 should be 500 * 0.35 / 365 * 15 + 300 * 0.35 / 365 * 10 + 400 * 0.35 / 365 * 5  which is
    11.99.  Total payment should be 411.99.

### Usage

This program tracks accrued interest by creating a new journal entry each day based on the day's ending balance.
To perform the end of day journal entries, click the "Next Day >>" button. Accrued interest is stored as a floating
point number (no rounding) in order to get the desired calculations.


### Notes

I chose AngularJS for this because it seemed to be a good tool for the job. The application could be conviently
run via a web browser, no server side infrastructure required, and Angular's data binding allows for well structured
code that is instantaneously response.

Most of the action here is driven by the code in ```javascripts/avantLOCController.js```. The requirements did not 
say the data had to be persistent, handle multiple accounts, or present invoicing. This is just a demo of basic 
coding logic only. No database. No server side. Reloading the webpage resets the application and all its data! I
also haven't had enough time to implement extensive validation of the data.

I am still new to AngularJS, so this app was good practice for getting familiar with its structure.

### Day Count Semantics

When you initiate a line of credit, the program initiates with "Day Count: 1". Day #1's interest will be accrued
after you hit the "Next Day >>" button. Scenario #2 above counts as if the first day was named "Day Count: 0". By
"day 15", the problem means "15 days after the first day". So if you were to replicate the problem above, the user
would have made the $200 payment when "Day Count: 16" in this program.

### Dependencies

* AngularJS 1.3.15
* Twitter Bootstrap 3.3.4
* JQuery 2.1.4