
// Simple calculator logic
(function(){
	const display = document.getElementById('display');
	const buttons = document.querySelectorAll('.btn');
	let expr = '';

	function updateDisplay(){
		display.value = expr || '0';
	}

	function sanitizeAndEval(s){
		// allow only digits, operators, parentheses, decimal point and spaces
		if(!/^[0-9+\-*/(). ]*$/.test(s)){
			throw new Error('Invalid characters in expression');
		}
		// evaluate in a safe-ish way
		// note: this uses Function which is ok for local use but not for untrusted input on servers
		const result = Function('return ' + s)();
		if(!isFinite(result)) throw new Error('Math error');
		return result;
	}

	function tryEvaluate(){
		if(!expr) return;
		try{
			const result = sanitizeAndEval(expr);
			expr = String(result);
			updateDisplay();
		}catch(e){
			display.value = 'Error';
			expr = '';
			console.error(e);
		}
	}

	function appendValue(val){
		// prevent starting with operator other than '-'
		const isOperator = ['+','-','*','/'].includes(val);
		if(expr === '' && isOperator && val !== '-') return;

		// prevent multiple decimals in the current number
		if(val === '.'){
			const parts = expr.split(/[-+*/]/);
			const last = parts[parts.length-1];
			if(last.includes('.')) return;
		}

		expr += val;
		updateDisplay();
	}

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			const action = btn.dataset.action;
			const value = btn.dataset.value;

			if(action === 'clear'){
				expr = '';
				updateDisplay();
				return;
			}

			if(action === 'backspace'){
				expr = expr.slice(0, -1);
				updateDisplay();
				return;
			}

			if(action === 'equals'){
				tryEvaluate();
				return;
			}

			if(value !== undefined){
				appendValue(value);
			}
		});
	});

	// keyboard support
	document.addEventListener('keydown', (e) => {
		const key = e.key;
		if((/^[0-9]$/).test(key) || ['+','-','*','/','(',')','.'].includes(key)){
			appendValue(key);
			e.preventDefault();
			return;
		}

		if(key === 'Enter'){
			tryEvaluate();
			e.preventDefault();
			return;
		}

		if(key === 'Backspace'){
			expr = expr.slice(0, -1);
			updateDisplay();
			e.preventDefault();
			return;
		}

		if(key.toLowerCase() === 'c'){
			expr = '';
			updateDisplay();
			e.preventDefault();
			return;
		}
	});

	// initialize
	updateDisplay();
})();
