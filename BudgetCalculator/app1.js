
// BUDGET CONTROLLER
var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
        this.percentage = -1;
	};
    
    Expense.prototype.calculatePercentage = function(totalIncome) {
        
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100); 
        } else {
            this.percentage = -1;
        }    
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum = sum + cur.value;
		});
		data.totals[type] = sum;
	};

	return{
		addItem: function(type, des, val) {
			var newItem, ID;

			//Create new ID
			if (data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//Create new item based on 'inc' or 'exp' type
			if (type === 'exp'){
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//Push it into our data structure
			data.allItems[type].push(newItem);

			//Return the new element
			return newItem;
		},
        
        deleteItem: function(type, id) {
            
            var ids = data.allItems[type].map(function(current){
               return current.id; 
            });
            
            var index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

		calculateBudget: function() {

			// Calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// Calculate the percentage of income that we spent
			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

        calculatePercentages: function() {
          
            data.allItems.exp.forEach(function(cur){
               cur.calculatePercentage(data.totals.inc); 
            });
            
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentage(); 
            });
            return allPerc;
        },
        
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		}
	}

})();


// UI CONTROLLER
var UIController = (function(){

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
	};
    
    var formatNumber = function(num, type) {
            var numSplit, int, dec, sign, intTemp;
            
            /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            */
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            intTemp = int;
            int = '';
            while(intTemp.length > 3) {
                int = ',' + intTemp.substr(intTemp.length - 3, 3) + int;
                intTemp = intTemp.substr(0, intTemp.length - 3);
            }
            int = intTemp + int;
            
            dec = numSplit[1];
            
            sign = (type === 'exp') ? '-' : '+';
            
            return sign + ' ' + int + '.' + dec;
            
        };

	return{
		getInput: function(){
			return{
				//either inc or exp
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}			
		},

		addListItem: function(obj, type){
			var html, newHtml, element;

			//Create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%">\n'+
				'<div class="item__description">%description%</div>\n'+
				'<div class="right clearfix">\n'+
				'<div class="item__value">%value%</div>\n'+
				'<div class="item__delete">\n'+
				'<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n'+
				'</div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%">\n'+
				'<div class="item__description">%description%</div>\n'+
				'<div class="right clearfix">\n'+
				'<div class="item__value">%value%</div>\n'+
				'<div class="item__percentage">21%</div>\n'+
				'<div class="item__delete">\n'+
				'<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n'+
				'</div></div></div>';
			}
			
			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

		clearFields: function(){
			var fields, fieldsArray;
			fields = document.querySelectorAll(
				DOMstrings.inputDescription +
			 	', ' + DOMstrings.inputValue);

			fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach(function(current, index, array){
				current.value = "";
			});

			fieldsArray[0].focus();
		},

		displayBudget: function(obj) {
            var type = (obj.budget >= 0) ? 'inc' : 'exp';
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			if (obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
			

		},
        
        displayPercentages: function(percentages) {
            [].forEach.call(document.querySelector('.expenses__list').children, function(cur, index) {
                cur.querySelector(DOMstrings.expensesPercLabel).textContent = (percentages[index] > 0) ? (percentages[index] + '%') : ('---') ;
            });
        },
        
        displayMonth: function() {
            var now, year, month, months;
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            month = months[now.getMonth()];
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
        },

		getDOMstrings: function(){
			return DOMstrings;
		},
        
        changedType: function() {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            [].forEach.call(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        }
	};
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function(){

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};

	var updateBudget = function(){

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};
    
    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read precentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        
    }

	var ctrlAddItem = function(){
		var input, newItem;
		//1. Get the filed input data
		input = UICtrl.getInput();

		if(input.description !== "" && !isNaN(input.value)){
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields
			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
		}
	}
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {         
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget   
            updateBudget();         
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
        
    }

	return {
		init: function() {
            UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			console.log('Application has started.');
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();