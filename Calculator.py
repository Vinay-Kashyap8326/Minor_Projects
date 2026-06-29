print(f"{'--- Calculator ---\n':^53}")
print("What You Want To Do ?\n")
Operators = ["Addition", "Subtraction", "Division", "Multiplication"]
# Main loop
while True:
    # Display all operations
    i = 0
    while i < len(Operators):
        print(i + 1, "-", Operators[i])
        i += 1
    # Take valid option
    while True:
        try:
            Operator_Input = int(input("\nEnter Option: "))
            if 1 <= Operator_Input <= len(Operators):
                break
            else:
                print("\nERROR: Invalid Option.\n")
        except ValueError:
            print("\nERROR: Enter Numbers Only.\n")
    # Take valid numbers
    while True:
        try:
            n1 = int(input("\nEnter 1st Number: "))
            n2 = int(input("Enter 2nd Number: "))
            if Operator_Input == 3 and n2 == 0:
                print("\nERROR: Cannot Divide By Zero.\n")
                continue
            break
        except ValueError:
            print("\nERROR: Invalid Number.\n")
    # Perform calculation
    if Operator_Input == 1:
        print(f"\nAnswer is : {n1} + {n2} = {n1 + n2}")
    elif Operator_Input == 2:
        print(f"\nAnswer is : {n1} - {n2} = {n1 - n2}")
    elif Operator_Input == 3:
        print(f"\nAnswer is : {n1} ÷ {n2} = {n1 / n2}")
    elif Operator_Input == 4:
        print(f"\nAnswer is : {n1} × {n2} = {n1 * n2}")
    # Ask user whether to continue
    while True:
        Repeat = input("\nDo You Want To Continue? (Y/N): ").upper()
        if Repeat == "Y":
            print()
            break
        elif Repeat == "N":
            print("\nThank You For Using Calculator.")
            exit()
        else:
            print("\nERROR: Enter Only Y or N.\n")