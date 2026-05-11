import java.io.*; //ise import isley kiya hai jisse mujhe read write karne ke liye kai chiz alag alag import na karna pade.
import java.util.Scanner;
public class My_ATM {
  private int pin;
  private double Accountbalance;
  public My_ATM () { //is constructer se code run hote hi files se pin and balance read kar lega or fir baki ke code me uska use karega.
    try(Scanner sc = new Scanner(new FileReader("Pin.txt"))) { // yaha par ham pin wali file ko read kar rahe hai.
      this.pin=sc.nextInt(); // then yaha par jo read kiya hai use pin variable me store kar diya hai.
    } catch (Exception e) {
      this.pin = 1234; //Agar file me kuch error hota hai to by default pin ki yahi value hogi.
    }
    try(Scanner sc = new Scanner(new FileReader("Account Balance.txt"))) { // yaha par ham balance wali file ko read kar rahe hai.
      this.Accountbalance = sc.nextDouble(); // Again, yaha par jo read kiya hai use Accountbalance variable me store kar diya hai.
    } catch (Exception e) {
      this.Accountbalance = 10000; //Agar file me kuch error hota hai to by default pin ki yahi value hogi.
    }
  }
  void getBalance() { // is method ki jariye ham account balance print kar sakte hai jo constructor ne read ki thi.
    System.out.println("Your Current Account Balance : " + this.Accountbalance);
  }
  void saveBalance(double UpdatedBalance) { /*ye method deposit and withdraw ke baad current balance ko lekar use Account Balance file me write kar deta hai.
    then baad me constructor usi file se read karta hai jisse real life ki tarah balance update hota hai.*/
    try(FileWriter fw = new FileWriter("Account Balance.txt")) {
      fw.write(String.valueOf(UpdatedBalance)); /*yaha par jo String.valueOf laga hai wo isley hai kyuki file String ya character me hi value leta hai isley iska use
    kiya hai jisse hamara Balance String me convert ho sake and then wo file me write ho sake.*/
    } catch (IOException e) {
      System.out.println("EXCEPTION : " + e.getMessage()); // e.getMessage is used to show the cause or message of exception to user.
      e.printStackTrace(); // this is print the path of occured exception.
    }
  }
  double setDeposit(double depositamount) { // This method for deposit and write balance in file by calling saveBalance method.
    Accountbalance += depositamount;
    saveBalance(Accountbalance);
    return Accountbalance;
  }
  double setWithdraw(double withdrawAmount) { // This method for withdraw and write balance in file by calling saveBalance method.
    Accountbalance -= withdrawAmount;
    saveBalance(Accountbalance);
    return Accountbalance;
  }
  void setPin(int newPin) { // This method is used to change pin (such as real atm by) files.
    try(FileWriter fw = new FileWriter("Pin.txt")) { //File Throws Exception therefore we use try/catch to handel this and import Exception type.
    fw.write(String.valueOf(newPin)); /*yaha par jo String.valueOf laga hai wo isley hai kyuki file String ya character me hi value leta hai isley iska use
    kiya hai jisse hamara Balance String me convert ho sake and then wo file me write ho sake.*/
    this.pin = newPin; //jo new pin user se liya hai wo file me write kar diya and usi pin ko code ke pin variable me bhi save kar diya.

    System.out.println("\nPIN Successfully Changed.");
    } catch (IOException e) {
      System.out.println("EXCEPTION : " + e.getMessage());
      e.printStackTrace();
  }
}
  boolean checkPin(int userpin) { //this method check pin is correct or not.
    if(userpin == this.pin) { // yaha user ka pin and constructor ke liye pin se compare kiya jaa raha hai.
      System.out.println("Confirmation : SUCCESS");
      return false;
    } else {
      System.out.print("Confirmation : CANCEL\n\nEnter PIN Again : ");
      return true;
    }
  }
  public static void main(String args[]) {
      try (Scanner sc = new Scanner(System.in)) { /* jitni bhi aisi chize hoti hai jisme open/close karte hai jaise file handling and scanner class to un 
        sabko try /catch se cover kar dena chahiye ye best practice bana jata hai.*/
          My_ATM obj = new My_ATM(); // Making My_ATM class object.
          System.out.print("Enter Your Name : ");
          String name = sc.nextLine();
          System.out.print("Enter Your 4 Digit PIN - ");
          boolean check = true;
          while(check) { //this loop run until user give right pin.
              int userpin = sc.nextInt();
              check = obj.checkPin(userpin);
          }
          sc.nextLine(); //to clear buffer, its very important.
          System.out.println("\nWELCOME " + name.toUpperCase());
          boolean check4 = false;
          while(!check4) { // this loop run until user want to exit.
              System.out.println("\nWhat do you want to do -");
              System.out.println("\n(a). Money Deposit");
              System.out.println("(b). Cash Withdraw");
              System.out.println("(c). PIN Change");
              System.out.println("(d). Balance Enquiry");
              System.out.println("(e). EXIT");
              System.out.print("\nEnter Only Option : ");
              String option = sc.nextLine();
              switch(option) {
                  case "a" -> {
                      while(true) {
                          System.out.print("\nEnter Amount : ");
                          double depositamount = sc.nextDouble();
                          sc.nextLine();
                          if(depositamount > 0) { //if user's entered amount is less then zero then don't allow to enter.
                              obj.setDeposit(depositamount);
                              System.out.println("\nMoney successfully deposited.");
                              break;
                          } else {
                              System.out.println("Invalid Amount\n\nEnter Amount Again : ");
                          }
                      }
                      obj.getBalance();//in last show current Balance to user.
                  }
                  case "b" -> {
                      System.out.print("\nEnter Amount : ");
                      while(true) {
                          double withdrawAmount = sc.nextDouble();
                          sc.nextLine();
                          if(withdrawAmount <= 0) { //if user's entered amount is less then zero or equal to zero then don't allow to enter.
                              System.out.println("Invalid Amount\n\nEnter Amount Again : ");
                          } else if(withdrawAmount > obj.Accountbalance) { //if user's entered amount is Greater then Balance then don't allow to enter.
                              System.out.println("Insufficient Balance\n\nEnter Amount Again : ");
                          } else {
                              obj.setWithdraw(withdrawAmount); // then allow to enter
                              System.out.println("\nMoney successfully Withdraw.");
                              break;
                          }
                      }
                      obj.getBalance();//in last show current Balance to user.
                  }
                  case "c" -> {
                      boolean check2 = true;
                      System.out.print("Enter previous PIN : ");
                      while(check2) {
                          int oldPin = sc.nextInt();
                          check2 = obj.checkPin(oldPin); /* yaha par function call ko check2 variable me hi dal diya hai jisse variable me true/
                          false initialize ho then loop usi variable ke according loop chalaye.*/
                      }
                      sc.nextLine();
                      boolean check3 = false;
                      while(!check3) {
                          System.out.print("Enter New 4 digit PIN : ");
                          int newPin = sc.nextInt();
                          if(1000 <= newPin && newPin <= 9999) { // yaha is logic ki wajah se user 4 digit hi input de sakta hai.
                              obj.setPin(newPin);
                              sc.nextLine();
                              check3 = true;
                          } else {
                              System.out.println("Invalid PIN, Must Be 4 Digits...");
                          }
                      }   
                    }
                  case "d" -> obj.getBalance();//to print current Balance.
                  case "e" -> {
                      System.out.println("Thanks, Visit Again.");
                      check4 = true;
                  }
                  default -> System.out.print("\nPlease Enter only (a,b,c,d,e) : "); //agar user option ke alawa kuch enter kare to.
              }
          }
      } catch (Exception e) {
        System.out.println("EXCEPTION : " + e.getMessage());
        e.printStackTrace();
    }
  }
}
