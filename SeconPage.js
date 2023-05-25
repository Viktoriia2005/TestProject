function calculateSalary() {
    var salary = parseFloat(document.getElementById("salary").value);
    var bonus = salary * 0.15;
    var total = salary + bonus;
    var tax = total * 0.1;
    var remaining = total - tax - 190;
    var result = remaining / 2;
    
    document.getElementById("result").innerHTML = "Ви отримаєте " + result + " грошей.";
  }