def language(items) :
  for i in range(len(items)) : # all elements of list print karne ke liye wo bhi serial NO. ke sath
    print(i + 1, "-", items[i])
lan_List = ["US Dollar (USD)", "Euro (EUR)", "Japanese Yen (JPY)", "British Pound (GBP)", "Chinese Yuan (CNY)", "Swiss Franc (CHF)", "Australian Dollar (AUD)", "Canadian Dollar (CAD)", "Hong Kong Dollar (HKD)", "Singapore Dollar (SGD)", "Indian Rupee (INR)"]
price_list = { # isse me rates ko easily access kar sakta hu
  "US Dollar (USD)" : [1, 0.86, 159.70, 0.74, 6.77, 0.79, 1.40, 1.38, 7.84, 1.28, 95.05],
  "Euro (EUR)" : [1.16, 1, 185.45, 0.86, 7.85, 0.91, 1.62, 1.60, 9.10, 1.48, 110.59],
  "Japanese Yen (JPY)" : [0.0063, 0.0054, 1, 0.0047, 0.0424, 0.0049, 0.0088, 0.0087, 0.0491, 0.0080, 0.59],
  "British Pound (GBP)" : [1.3423, 1.1555, 214.38, 1, 9.0824, 1.0574, 1.8799, 1.8584, 10.5194, 1.7175, 127.92],
  "Chinese Yuan (CNY)" : [0.1478, 0.1273, 23.60, 0.1101, 1, 0.1164, 0.2070, 0.2046, 1.1582, 0.1891, 14.03],
  "Swiss Franc (CHF)" : [1.2695, 1.0929, 202.73, 0.9456, 8.5901, 1, 1.7785, 1.7577, 9.9491, 1.6247, 120.62],
  "Australian Dollar (AUD)" : [0.7141, 0.6147, 114.03, 0.5319, 4.8315, 0.5623, 1, 0.9883, 5.5942, 0.9135, 67.82],
  "Canadian Dollar (CAD)" : [0.7222, 0.6219, 115.34, 0.5381, 4.8879, 0.5689, 1.0118, 1, 5.6599, 0.9242, 68.44],
  "Hong Kong Dollar (HKD)" : [0.1276, 0.1098, 20.38, 0.0951, 0.8634, 0.1005, 0.1787, 0.1767, 1, 0.1630, 12.13],
  "Singapore Dollar (SGD)" : [0.7814, 0.6729, 124.79, 0.5822, 5.2871, 0.6155, 1.0946, 1.0818, 6.1235, 1, 74.02],
  "Indian Rupee (INR)" : [0.011, 0.0090, 1.68, 0.0078, 0.071, 0.0083, 0.015, 0.015, 0.082, 0.014, 1]
}
iftrue = True
while iftrue : # agar user correction karna chahta hai to wo easily kar sakta hai
  language(lan_List) 
  print("\nQ- Which currency do you want to convert ?\n")
  while True : # loop isley taki invalid input hone par ye again input le sake
    input1 = int(input("Please Enter Serial Number: "))
    if(input1 <= 0 or input1 > len(lan_List)) : # ye isley taki 1-10 input aaya to hi code run ho warna again input lo
      print("\nInvalid Number...\n")
      continue # isse baki ki statements skip ho jayegi means ek iteration skip ho jayegi
    option1 = lan_List[input1 - 1] # yaha jo input me currency choose ki hai wo store kar liya hai
    print() # for blank line
    break # isse inner loop me input correct hone par loop ek baar hi chalega
  language(lan_List)
  print("\nQ- What currency do you want to convert to ?\n")
  while True : # again wahi logic
    input2 = int(input("Please Enter Serial Number: "))
    if(input2 <= 0 or input2 > len(lan_List)) :
      print("\nInvalid Number...\n")
      continue
    option2 = lan_List[input2 - 1]
    print()
    break
  print("You want to convert---\n") # confirm karne ke liye 
  print(option1,"=>",option2)
  while True :
    confirmation = input("\nYES OR NO (Y/N): ").lower() # ye input ko lowercase me convert kar deta hai
    if(confirmation == "y") :
      amount = float(input("\nEnter Amount: ")) # input float bhi ho sakta hai isley float me type cast kar diya
      current_price = price_list[option1][input2 - 1] # ye rate ko access kar raha hai jisme user ko convert karna hai
      print("\n1",option1,"=>",current_price,option2) # yaha rate show kar diya hai 
      print("\nYour Result---")
      print(f"\n{amount:.2f} {option1} => {(amount * current_price):.2f} {option2}\n") # yaha fstring ka use kiya hai jisse float value 2 decimals tak hi print kare or result bhi 2 decimals tak hi diya
      iftrue = False # outer loop ko rokne ke liye
      break # ye hone ke baad inner loop close
    elif(confirmation == "n") : # agar user ko koi correction karna hai to wo kar sakta hai
      print("Correction-----")
      break # isse inner loop close and outer loop again chalega 
    else :
      print("\nInvalid Option...")