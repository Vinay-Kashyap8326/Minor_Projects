import java.util.Scanner;
public class MCQ_Game {
  public static void main(String args[]) {
    Scanner sc = new Scanner(System.in);
    int score = 0;
    String questions[] = {
      " 1. Who is known as the Father of Java ?\n",
      " 2. Java programs are executed by which machine ?\n",
      " 3. Which statement is used to print output in Java ?\n",
      " 4. Java is platform _______.\n",
      " 5. Which package contains the Scanner class ?\n",
      " 6. Which loop executes at least once even if condition is false ?\n",
      " 7. Which concept allows same method name with different parameters ?\n",
      " 8. Which exception occurs when a number is divided by zero ?\n",
      " 9. Which operator is used to compare two values ?\n",
      " 10. Which keyword is used to create an object in Java ?\n"
    }; /*questions ko is tarah se likhna or unke options ko likhna sikha*/
    String options[][] = {
      {
        " a. James Gosling",
        " b. Dennis Ritchie",
        " c. Guido van Rossum",
        " d. Bjarne Stroustrup"
      },
      {
        " a. ATM",
        " b. JVM",
        " c. CPU",
        " d. Printer"
      },
      {
        " a. print()",
        " b. echo()",
        " c. System.out.println()",
        " d. display()"
      },
      {
        " a. Dependent",
        " b. Independent",
        " c. Limited",
        " d. Slow"
      },
      {
        " a. java.io",
        " b. java.util",
        " c. java.lang",
        " d. java.net"
      },
      {
        " a. for",
        " b. for-each",
        " c. do-while",
        " d. while"
      },
      {
        " a. Inheritance",
        " b. Encapsulation",
        " c. Overloading",
        " d. Overriding"
      },
      {
        " a. NullPointerException",
        " b. IOException",
        " c. ArithmeticException",
        " d. ClassNotFoundException"
      },
      {
        " a. =",
        " b. ==",
        " c. !",
        " d. &&"
      },
      {
        " a. class",
        " b. new",
        " c. object",
        " d. create"
      }
    };
    char answers[] = {
      'a',
      'b',
      'c',
      'b',
      'b',
      'c',
      'c',
      'c',
      'b',
      'b'
    };
    long startTime = System.currentTimeMillis();
    for (int i = 0; i < questions.length; i++) {
      System.out.println(questions[i]);
      for (int j = 0; j < options[i].length; j++) {
        System.out.println(options[i][j]);
      }/*yaha sikha ki questions with option kaise print kare*/
      boolean timeUp[] = {
        false
      };
      Thread timer = new Thread(() -> {
        for(int t = 10; t > 0; t--) {
          if(t == 10) {
            System.out.println("\nTime Left: " + t + " seconds");
          } else {
            System.out.println("Time Left: " + t + " seconds");
          }
          try {
            Thread.sleep(1000);
          } catch(InterruptedException e) {
            return;
          }
        }
        timeUp[0] = true;
      });
      timer.start();
      System.out.print("\n Enter Your Answer (a/b/c/d): ");
      char userAnswer = Character.toLowerCase(sc.next().charAt(0)); /*iss puri line ka matlab samjho
      isme kaise character input le rahe hai or use lowercase me kaise change kar rahe hai*/
      timer.interrupt();
      if(timeUp[0]) {
        System.out.println("TIME OVER Next Question :-");
        continue;
      }
      if(userAnswer < 'a' || userAnswer > 'd') {
        System.out.println(userAnswer+" Is Invalid Option : Please Choose (a/b/c/d)\n");
        i--;
        continue; //ye baki ki bachhi statments ko execute nhi hone deta abhi to needed nhi hai but lagana best hai.
        /*isme question repeat kaise karna hai agar invalid character dale to*/
      } else if (userAnswer == answers[i]) {
        System.out.println("\n CORRECT\n");
        score++;
      } else {
        System.out.println("\n WRONG : CORRECT Answer is : " + options[i][answers[i] - 'a'] + "\n"); /*kaise right option ko array se lekar print karna hai*/
      }
    }
    long totalTime = (System.currentTimeMillis() - startTime) / 1000; //ye total taken time print karta hai
    System.out.println("Your Total Taken Time : " + totalTime/60 + " Minutes "+totalTime%60+" Seconds ");
    double percentage = (score * 100.0) / questions.length;
    System.out.println("\nYour Total Score : " + score);
    System.out.println("Percentage : " + percentage + "%");
    if(percentage >= 80) {
      System.out.println("Grade : A (Excellent)");
    }
    else if(percentage >= 50) {
      System.out.println("Grade : B (Good)");
    }
    else {
      System.out.println("Grade : C (Needs Improvement)");
    }
    sc.close();
  }
}
// }
