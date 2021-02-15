const modal = {
    open () {
        // Abre o modal
        // adiciona a class active
        document.querySelector('.modal-overlay').classList.add('active')
        
    },
    close () {
        // Fecha o modal
        // remove a class active
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("devfinances:transactions")) || []
    },
    set (transaction) {
        localStorage.setItem("devfinances:transactions",
        JSON.stringify(transaction))
    }
}

const transaction = {
    all: Storage.get(),

    add(transactions) {
        transaction.all.push(transactions),

        App.reload()
    },
    remove(index) {
        transaction.all.splice(index, 1)

        App.reload()
    },
    incomes (){
        // soma as entradas
        let income = 0
        transaction.all.forEach((transactions) => {
            if ( transactions.amount > 0 ) {
                income = income + transactions.amount
            }
             
        })
        return income
    },
    expenses (){
        // soma as saídas
        let expense = 0
        transaction.all.forEach((transactions) => {
            if ( transactions.amount < 0 ) {
                expense = expense + transactions.amount
            }
             
        })
        return expense
    },
    total (){
        // somar as entradas, depois somar as saídas
        //e remover das entradas o valor das saídas,
        // assim, temos o total.
        
        return transaction.incomes() + transaction.expenses()
    }

}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody')
    ,
    addTransaction (transaction, index) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)


    },
    innerHTMLTransaction (transaction, index){
        const CSSClass = transaction.amount > 0 ? 'income' : 'expense'

        // const amount = 

        const html = `
                <tr>
                    <td class="description">${transaction.description}</td>
                    <td class="${CSSClass}">${Utils.formatCurrency(transaction.amount)}</td>
                    <td class="date">${transaction.date}</td>
                    <td> <img id="remove-button" onclick="transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
                </tr>       
                    `
        return html            
    },
    updateBalance () {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(transaction.incomes())  
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(transaction.expenses()) 
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(transaction.total()) 
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency (value) {
        const signal = Number(value) < 0 ? '-' : ''
        
        value = String(value).replace(/\D/g, "")
        
        value = Number(value) / 100

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields(){
        const {description, amount, date} = Form.getValues()
        
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error ("Por favor preencha todos os campos")
        }

    },
    formatValues(){
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return{
            description,
            amount,
            date
        }
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            const Transaction = Form.formatValues()
            transaction.add(Transaction)
            Form.clearFields()
            modal.close()
            
        } catch (error) {
            alert(error.message)
            
        }

        
    },
    
}

const App = {
    innit() {
        // DOM.addTransaction passsado como atalho
        transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()

        Storage.set(transaction.all)

    },
    reload() {
        DOM.clearTransactions()
        App.innit()
        
    }

}

App.innit()

