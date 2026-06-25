print("--- Calculator ---\n")
print("What You Want To Do ?\n")
Operetors = ["Addition", "Subtraction", "Division", "Multiplication"]
i = 0
while(i < len(Operetors)) :
  print(i+1,"- ",Operetors[i])
  i+=1
try:
  Operator_Input = int(input("\nEnter Option: "))
  if((Operator_Input > 0) and (Operator_Input <= len(Operetors))) :
    if(Operator_Input==1):
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      print(f"\nAnswer is : {n1} + {n2} = {n1+n2}")
    elif(Operator_Input==2):
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      print(f"\nAnswer is : {n1} - {n2} = {n1-n2}")
    elif(Operator_Input==3):
      try:
        n1 = int(input("\nEnter 1st Number: "))
        n2 = int(input("\nEnter 2nd Number: "))
        print(f"\nAnswer is : {n1} ÷ {n2} = {n1/n2}")
      except ZeroDivisionError: 
        print("\nERROR: Cannot Divided By Zero")
    elif(Operator_Input==4):
      n1 = int(input("\nEnter 1st Number: "))
      n2 = int(input("\nEnter 2nd Number: "))
      print(f"\nAnswer is : {n1} × {n2} = {n1*n2}")
  else :
    print("\nInvalid Option")
except ValueError:
  print("\nInvalid Character")