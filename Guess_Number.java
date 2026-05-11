import java.util.Random;
import java.util.Scanner;
public class Guess_Number {
  public static void main(String args[]) {
    Random r = new Random();
    Scanner sc = new Scanner(System.in);
    int num = r.nextInt(100);
    while(true) {
      System.out.print("\nEnter Your Number : ");
      int usernum = sc.nextInt();
      if(0 <= usernum && usernum <= 100) {
        if(usernum == num) {
          System.out.println("\nCONGRATULATION... You Found My Number");
          break;
        } else if(usernum <= num) {
          System.out.println("\nEnter Big Number.");
        } else if(usernum >= num) {
          System.out.println("\nEnter Small Number.");
        }
      } else {
        System.out.println("\nInvalid Number.");
      }
    }
  }
}