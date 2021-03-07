/**
 * info1103 - assignment 1
 * Vlado Smolovic
 * vsmo2071
 */
import java.util.Scanner;

public class CoffeeBot {

	public static void main(String[] args) {
		//Responding to invalid number of arguments.
		if (args.length != 2){
			if (args.length == 0){
				System.out.println("No arguments. System terminating.");
			return;}
			else if (args.length < 2){
				System.out.println("Not enough arguments. System terminating.");
				return;
			}
			else {
				System.out.println("Too many arguments. System terminating.");
				return;
			}
		}
		//Respinding to Negative supplies of coffee cups and/or shots.
		int cof_cups = Integer.parseInt(args[0]);
		int cof_shots = Integer.parseInt(args[1]);
		if ((cof_cups < 0)|| (cof_shots < 0)){
			if ((cof_cups<0)&&(cof_shots>=0)){
			System.out.println("Negative supply of coffee cups. System terminating.");
			return;}
			else if ((cof_cups>= 0)&&(cof_shots<0)){
				System.out.println("Negative supply of coffee shots. System terminating.");
			return;}
			else {System.out.println("Negative supple chain. System terminating.");
				 return;}
		}
		//Taking customer's name.
		Scanner name = new Scanner(System.in);
		System.out.print("Hello, what's your name? ");
		String cust_name = name.next();
		
		//Responding to customers answer to the coffee question.
		System.out.print("Would you like to order some coffee, " + cust_name + "?(y/n) ");
		Scanner yes_or_no = new Scanner(System.in);
		boolean valid = false;
		while ( valid != true){
		String answer = yes_or_no.next();
			if ((!(answer.equals("y")))&&(!(answer.equals("n")))){
				System.out.println("Invalid response. Try again.");
				continue;
			}
			else if (answer.equals("n")== true) {
				System.out.println("Come back next time, " + cust_name + ".");
				return;
			}
			else {
				System.out.println("Great! Let's get started.");
				valid = true ;
				continue;
			}
		}
		//Displaying how much coffee cups and shots in stock.
		System.out.println("               ");
		System.out.println("Order selection");
		System.out.println("---------------");
		System.out.println("               ");
			if ((cof_cups == 1)&&(cof_shots == 1)) {
				System.out.println("There is 1 coffee cup in stock and each costs $2.00.");
			        System.out.println("There is 1 coffee shot in stock and each costs $1.00.");
				}
			else if ((cof_cups == 1)^(cof_shots==1)) {
				if (cof_cups == 1) {
					System.out.println("There is 1 coffee cup in stock and each costs $2.00.");
					System.out.println("There are " + cof_shots + " coffee shots in stock and each costs $1.00"); 
					}  else {
					System.out.println("There are " + cof_cups + " coffee cups in stock and each costs $2.00.");
					System.out.println("There is 1 coffee shot in stock and each costs $1.00.");
				    }
			}
			else { System.out.println("There are " + cof_cups + " coffee cups in stock and each costs $2.00.");
					   System.out.println("There are " + cof_shots + " coffee shots in stock and each costs $1.00");; 
				}
		//Taking cutomers' coffee cup orders and responding to them.
			Scanner order = new Scanner(System.in);
			System.out.print("How many cups of coffee would you like? ");
			int cust_order = order.nextInt();
			if (cust_order == 0){
				System.out.println("No cups, no coffee. Goodbye.");
				return;
			}
			else if (cust_order < 0) {
				System.out.println("Does not compute. System terminating.");
				return;
			}
			else if (cust_order > cof_cups){
				System.out.println("Not enough stock. Come back later.");
				return;
			}
		
		
		//Taking customers' coffee shot orders and responding to them.
		Scanner coffee_s = new Scanner(System.in);
		int i = 1;
		int [] coffee_shot_ar = new int [cust_order];
		while (i<= cust_order){
			System.out.print("How many coffee shots in cup " + i +"? " );
			coffee_shot_ar[i-1] = coffee_s.nextInt();
				if (coffee_shot_ar[i-1] < 0) {
				System.out.println("Does not compute. Try again.");
				continue;
				}
				else if (coffee_shot_ar[i-1] > cof_shots){
					if (cof_shots == 1){
					System.out.println("There is only 1 coffee shot left. Try again.");
						continue;
					}
					else {
						System.out.println("There are only " + cof_shots + " coffee shots left. Try again");
						continue;
					}
	
			}
i++;		
}
		double cofc = 2.00;
		double cofs = 1.00;
		double price = 0.00;
		for (int d = cust_order; d>0; d--){
			int p = cust_order - d;
			if (coffee_shot_ar[p]==1){
			System.out.println("Cup "+ (p+1) + " has 1 shot and will cost $" + (cofc +cofs) );
			price = price + (cofc + cofs);
		    }
			else {
				System.out.println("Cup " + (p+1) + " has " + coffee_shot_ar[p] + " shots and will cost $" +((coffee_shot_ar[p]*cofs)+cofc));
				price = price + ((coffee_shot_ar[p]*cofs)+cofc);				   }
		}
		
		System.out.println(cust_order + " coffees to purchase.");
		System.out.println("Purchase price is $" + price);
		double total = price;
								   
		Scanner pay = new Scanner(System.in);
		boolean response = false;
		while (response = true) {
		System.out.println("Proceed to payment? (y/n)");
		String choosetopay = pay.next();
		if (choosetopay.equals("n")){
			System.out.println("Come back next time, " + cust_name + ".");
			return;
		}
		else if (choosetopay.equals("y")){
			System.out.print("$" + price + " remains to be paid. Enter a coin or note: ");
			response = true;
			break;
		}
		else {
			System.out.println("Invalid response. Try again.");
			continue;
		}
		}
		Scanner notes_and_coins = new Scanner(System.in);
		while (price > 0.00){
			String payment = notes_and_coins.next();
			if (payment.equals("$50.00")){
				price = price - 50.00;
				continue;
			}
			else if (payment.equals("$20.00")){
				price = price - 20.00;
				continue;
				}
			else if (payment.equals("$10.00")){
				price = price - 10.00;
				continue;
			}
			else if (payment.equals("$5.00")){
				price = price - 5.00;
				continue;
			}
			else if (payment.equals("$2.00")){
				price = price - 2.00;
				continue;
			}
			else if (payment.equals("$1.00")){
				price = price - 1.00;
				continue;
			}
			else if (payment.equals("$0.50")){
				price = price - 0.50;
				continue;
			}
			else if (payment.equals("0.20")){
				price = price - 0.20;
				continue;
			}
			else if (payment.equals("$0.10")){
				price = price - 0.10;
				continue;
			}
			else if (payment.equals("$0.05")) {
				price = price - 0.05;
				continue;
			}
			else {
				System.out.println("Invalid coin or note. Try again.");
				continue;
			}
		}
		System.out.println("You gave "+ "$" + (total- price));
		if (price == 0.00){
			System.out.println("Perfect! No change given.");
		}
		else {
			System.out.println("Your change: ");
			double given = total - price; 
			if ((given/50.00)>= 1){
				int stor1 = (int)(given/50.00);
				System.out.println(stor1 + " x $50.00");
			}
			else if ((given/20.00)>= 1){
				int stor2 = (int)(given/20.00);
				System.out.println(stor2 + " x $20.00");
			}
			else if ((given/10.00)>= 1){
				int stor3 = (int)(given/10.00);
				System.out.println(stor3 + " x $10.00");
			}
			else if ((given/5.00)>= 1){
				int stor4 = (int)(given/5.00);
				System.out.println(stor4 + " x $5.00");
			}
			else if ((given/2.00)>= 1){
				int stor5 = (int)(given/2.00);
				System.out.println(stor5 + " x $2.00");
			}
			else if ((given/1.00)>= 1){
				int stor6 = (int)(given/1.00);
				System.out.println(stor6 + " x $1.00");
			}
			else if ((given/0.50)>= 1){
				int stor7 = (int)(given/0.50);
				System.out.println(stor7 + " x $0.50");
			}
			else if ((given/0.20)>= 1){
				int stor8 = (int)(given/0.20);
				System.out.println(stor8 + " x $0.20");
			}
			else if ((given/0.10)>= 1){
				int stor9 = (int)(given/0.10);
				System.out.println(stor9 + " x $0.10");
			}
			else if ((given/0.05)>= 1){
				int stor10 = (int)(given/0.05);
				System.out.println(stor10 + " x $0.50");
			}
		}
		System.out.println("");
		System.out.println("Thank you, " + cust_name);
		System.out.println("See you next time.");
			
		}
		
		
		}
		
		
		
		// TODO
		//	
	
