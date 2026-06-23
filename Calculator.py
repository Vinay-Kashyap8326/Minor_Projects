print("--- Calculator ---\n")
print("What You Want To Do ?\n")
Operetors = ["Addition", "Subtraction", "Division", "Multiplication"]
i = 0
while(i < len(Operetors)) :
  print(i+1,"- ",Operetors[i])
  i+=1
Operator_Input = int(input("\nEnter Option: "))
if((Operator_Input >= 0) and (Operator_Input <= len(Operetors))) :
  pass
else :
  print("Invalid Option")