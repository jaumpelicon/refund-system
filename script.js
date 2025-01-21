const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')
const expenseList = document.querySelector('ul')
const expensesSize = document.querySelector('aside header span')
const expensesPrice = document.querySelector('aside header h2')


amount.oninput = () => {
  value = amount.value.replace(/\D+/g, '')
  value = Number(value) / 100
  amount.value = formatCurrencyBRL(value)
}

form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)

  expensesSize.textContent = expenseList.children.length
  expensesPrice.innerHTML = `<small>R$</small>${formatCurrencyBRL(getTotalPrice())}`
}

function getTotalPrice() {
  let total = 0
  for (const expense of expenseList.children) {
    const rawAmount = expense.querySelector('.expense-amount').textContent
    const cleanedAmount = rawAmount.replace(/[R$\s.]/g, '').replace(',', '.');
    total += parseFloat(cleanedAmount)
  }
  return total
}

function expenseAdd(newExpense) {
  try {
    const expenseItem = createExpenseItem(newExpense)

    expenseList.append(expenseItem)
    formClear()

  } catch (error) {
    alert(error.message)
  }
}

function createExpenseItem(newExpense) {

  const expenseItem = document.createElement('li')
  expenseItem.classList.add('expense')

  const expenseIcon = document.createElement('img')
  expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
  expenseIcon.setAttribute('alt', newExpense.category_name)

  const expenseDiv = document.createElement('div')
  expenseDiv.classList.add('expense-info')
  const expenseName = document.createElement('strong')
  const expenseCategory = document.createElement('span')
  expenseName.textContent = newExpense.expense
  expenseCategory.textContent = newExpense.category_name
  expenseDiv.append(expenseName)
  expenseDiv.append(expenseCategory)

  const expenseAmount = document.createElement('span')
  expenseAmount.classList.add('expense-amount')
  expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.replace('R$', '')}`

  const expenseRemoveButton = document.createElement('img')
  expenseRemoveButton.setAttribute('src', 'img/remove.svg')
  expenseRemoveButton.setAttribute('alt', 'remover')
  expenseRemoveButton.classList.add('remove-icon')
  expenseRemoveButton.onclick = () => {
    expenseItem.remove()
    expensesSize.textContent = expenseList.children.length
    expensesPrice.innerHTML = `<small>R$</small>${formatCurrencyBRL(getTotalPrice())}`
  }

  expenseItem.append(expenseIcon, expenseDiv, expenseAmount, expenseRemoveButton)

  return expenseItem
}

function formClear() {
  expense.value = ''
  category.value = ''
  amount.value = ''

  expense.focus()
}

function formatCurrencyBRL(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}