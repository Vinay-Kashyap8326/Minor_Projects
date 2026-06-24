print("--- Calculator ---\n")
print("What You Want To Do ?\n")
Operetors = ["Addition", "Subtraction", "Division", "Multiplication"]
i = 0
while(i < len(Operetors)) :
  print(i+1,"- ",Operetors[i])
  i+=1
Operator_Input = int(input("\nEnter Option: "))
if((Operator_Input >= 0) and (Operator_Input <= len(Operetors))) :
  match Operator_Input: 
    case 1: 
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      print("\nAnswer is :",n1,"+",n2,"=",n1+n2)
    case 2: 
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      print("\nAnswer is :",n1,"-",n2,"=",n1-n2)
    case 3: 
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      if(n2!=0):
        print("\nAnswer is :",n1,"÷",n2,"=",n1/n2)
      else : 
        print("\nCannot Divided By Zero")
    case 4: 
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      print("\nAnswer is :",n1,"×",n2,"=",n1*n2)
    case _:
      print("Invalid Option")
  
else :
  print("Invalid Option")
  