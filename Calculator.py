# loop wala banao and comments ache se likho
# all exception handle karo
print(f"{'--- Calculator ---\n':^53}")
print("What You Want To Do ?\n")
Operetors = ["Addition", "Subtraction", "Division", "Multiplication"]
while(True) :
  i = 0
  while(i < len(Operetors)) :
    print(i + 1,"- ",Operetors[i])
    i += 1
  try:# Again waka banao and comments ache se likho
    Operator_Input = int(input("\nEnter Option: "))
    while(True):
      if((Operator_Input > 0) and (Operator_Input <= len(Operetors))) :
        n1 = int(input("\nEnter 1st Number: "))
        n2 = int(input("\nEnter 2nd Number: "))
        if(Operator_Input == 1):
          print(f"\nAnswer is : {n1} + {n2} = {n1+n2}")
          break
        elif(Operator_Input == 2):
          print(f"\nAnswer is : {n1} - {n2} = {n1-n2}")
          break
        elif(Operator_Input == 3):
          try:
            print(f"\nAnswer is : {n1} ÷ {n2} = {n1/n2}")
            break
          except ZeroDivisionError: 
            print("\nERROR: Cannot Divided By Zero\n")
        elif(Operator_Input == 4):
          print(f"\nAnswer is : {n1} × {n2} = {n1*n2}")
          break
      else :
        print("\nInvalid Option\n")
    print("\nDo You Want To Continue ?")
    Repeat = input("\nEnter Yes Or No (Y/N): ").upper()
    if(Repeat == 'Y'):
      print()
      continue
    elif(Repeat == 'N'):
      break
  except ValueError:
    print("\nInvalid Character\n")