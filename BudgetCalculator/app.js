var BudgetController = (function(){

	function BC(){
		//Map is used for making deleting elements easier
		this.incomeAr = new Map();
		//Expenses array stores negative values
		this.expensesAr = new Map();
		this.income = 0;
		this.expenses = 0;
		this.count = 0;
	}

	//Transaction is an object with fields name(string) and value(number)
	BC.prototype.addValue = function(transaction){
		//Count is being used for unique identification of elements
		this.count += 1;
		if (transaction.value >= 0){
			this.incomeAr.set(count, transaction);
			this.income += transaction.value;
		} else {
			this.expensesAr.set(count, transaction);
			this.expenses += transaction.value;
		}
		return count;
	}

	//isIncome is given to the function because it's faster
	//to pass a boolean element to a function
	//than to check whether this key exists in one map or the other
	BC.prototype.deleteValue = function(isIncome, transactionId){
		if(isIncome){
			this.income -= this.incomeAr.get(transactionId).value;
			this.incomeAr.delete(transactionId);
		} else {
			this.expenses -= this.expensesAr.get(transactionId).value;
			this.expensesAr.delete(transactionId);
		}
	}

	return new BC();

})();

var UIController = (function(){

	var incomeList = document.querySelector('.income__list');
	var expensesList = document.querySelector('.expenses__list');

	//constructor
	function UIC(){}

	UIC.prototype.addIncomeTransaction = function(transaction){
		document.createElement('div');
	}



	return new UIC();

})();

var SystemController = (function(budgetCtrl, UICtrl){

	function Transaction(name, value){
		this.name = name;
		this.value = value;
	}

	document.getElementById('add__btn').addEventListener('click', function(){
		var input = UICtrl.getInput();
		budgetCtrl.addValue(input);
		UICtrl.addElement(input);
	});
})(BudgetController, UIController);

SystemController.init();