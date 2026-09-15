let account =
    localStorage.getItem("account");

let password =
    localStorage.getItem("password");


/* SECOND SECURITY PIN */

let secondPassword =
    localStorage.getItem("secondPassword");


let money =
    Number(localStorage.getItem("money")) || 0;


let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


let currentTransaction = "";


/* TRANSACTION TIMES */

let recentTransactions = [];


/* TRANSACTION WAITING FOR CONFIRMATION */

let pendingTransaction = null;


/* HIGH VALUE LIMIT */

let highValueLimit = 20000;


/* ACCOUNT LOCK STATUS */

let accountLocked =
    localStorage.getItem("accountLocked")
    === "true";



/* CREATE ACCOUNT */

function createAccount() {

    let accountNumber =
        document
        .getElementById("accountNumber")
        .value;


    let createPassword =
        document
        .getElementById("createPassword")
        .value;


    let createSecondPassword =
        document
        .getElementById("createSecondPassword")
        .value;


    let message =
        document
        .getElementById("createMessage");


    if (
        accountNumber === "" ||
        createPassword === "" ||
        createSecondPassword === ""
    ) {

        message.innerText =
            "Please fill all fields.";

        message.style.color =
            "#ff6666";

        return;
    }


    localStorage.setItem(
        "account",
        accountNumber
    );


    localStorage.setItem(
        "password",
        createPassword
    );


    localStorage.setItem(
        "secondPassword",
        createSecondPassword
    );


    localStorage.setItem(
        "money",
        0
    );


    localStorage.setItem(
        "transactions",
        JSON.stringify([])
    );


    localStorage.setItem(
        "accountLocked",
        "false"
    );


    account = accountNumber;

    password = createPassword;

    secondPassword =
        createSecondPassword;

    money = 0;

    transactions = [];

    accountLocked = false;


    message.innerText =
        "Account created successfully!";

    message.style.color =
        "#00ffaa";


    setTimeout(() => {

        showLogin();

    }, 1200);
}



/* SHOW LOGIN */

function showLogin() {

    document
        .getElementById("createSection")
        .classList.add("hidden");


    document
        .getElementById("loginSection")
        .classList.remove("hidden");
}



/* SHOW CREATE */

function showCreate() {

    document
        .getElementById("loginSection")
        .classList.add("hidden");


    document
        .getElementById("createSection")
        .classList.remove("hidden");
}



/* LOGIN */

function login() {

    let loginAccount =
        document
        .getElementById("loginAccount")
        .value;


    let loginPassword =
        document
        .getElementById("loginPassword")
        .value;


    let message =
        document
        .getElementById("loginMessage");


    /* CHECK ACCOUNT LOCK */

   /* CHECK ACCOUNT LOCK */

if (accountLocked) {

    let unlockPin =
        prompt(
            "🚨 Account is locked.\n\nEnter Security PIN to unlock:"
        );

    if (unlockPin === secondPassword) {

        accountLocked = false;

        localStorage.setItem(
            "accountLocked",
            "false"
        );

        alert(
            "✅ Account unlocked successfully!\n\nPlease login again."
        );

    } else {

        message.innerText =
            "❌ Incorrect Security PIN. Account remains locked.";

        message.style.color =
            "#ff6666";
    }

    return;
}


    if (
        loginAccount === account &&
        loginPassword === password
    ) {

        document
            .getElementById("authPage")
            .classList.add("hidden");


        document
            .getElementById("dashboard")
            .classList.remove("hidden");


        updateBalance();

    } else {

        message.innerText =
            "Invalid account number or password.";

        message.style.color =
            "#ff6666";
    }
}



/* LOGOUT */

function logout() {

    document
        .getElementById("dashboard")
        .classList.add("hidden");


    document
        .getElementById("authPage")
        .classList.remove("hidden");


    document
        .getElementById("loginAccount")
        .value = "";


    document
        .getElementById("loginPassword")
        .value = "";
}



/* UPDATE BALANCE */

function updateBalance() {

    document
        .getElementById("balance")
        .innerText =
        money.toLocaleString();


    localStorage.setItem(
        "money",
        money
    );
}



/* OPEN DEPOSIT */

function openDeposit() {

    currentTransaction =
        "deposit";


    document
        .getElementById("transactionTitle")
        .innerText =
        "Deposit Money";


    document
        .getElementById("transactionButton")
        .innerText =
        "Deposit";


    document
        .getElementById("transactionBox")
        .classList.remove("hidden");


    clearTransactionFields();
}



/* OPEN WITHDRAW */

function openWithdraw() {

    currentTransaction =
        "withdraw";


    document
        .getElementById("transactionTitle")
        .innerText =
        "Withdraw Money";


    document
        .getElementById("transactionButton")
        .innerText =
        "Withdraw";


    document
        .getElementById("transactionBox")
        .classList.remove("hidden");


    clearTransactionFields();
}



/* CHECK HIGH VALUE */

function checkHighValue() {

    let amount =
        Number(
            document
            .getElementById("amount")
            .value
        );


    let second =
        document
        .getElementById("secondPassword");


    if (
        currentTransaction === "withdraw" &&
        amount > highValueLimit
    ) {

        second.hidden = false;

    } else {

        second.hidden = true;

        second.value = "";
    }
}



/* PERFORM TRANSACTION */

function performTransaction() {

    let amount =
        Number(
            document
            .getElementById("amount")
            .value
        );


    let enteredPassword =
        document
        .getElementById("transactionPassword")
        .value;


    let message =
        document
        .getElementById("transactionMessage");


    /* CHECK LOCK */

    if (accountLocked) {

        message.innerText =
            "🚨 Account is locked.";

        message.style.color =
            "#ff6666";

        return;
    }


    /* VALID AMOUNT */

    if (amount <= 0) {

        message.innerText =
            "Enter a valid amount.";

        message.style.color =
            "#ff6666";

        return;
    }


    /* MAIN PIN */

    if (enteredPassword !== password) {

        message.innerText =
            "Wrong main PIN.";

        message.style.color =
            "#ff6666";

        return;
    }


    /* DEPOSIT LIMIT */

    if (
        currentTransaction === "deposit" &&
        amount > 200000
    ) {

        message.innerText =
            "Deposit limit is ₹20,000.";

        message.style.color =
            "#ff6666";

        return;
    }


    /* SECOND PIN FOR HIGH VALUE */

    if (
        currentTransaction === "withdraw" &&
        amount > highValueLimit
    ) {

        let enteredSecondPassword =
            document
            .getElementById("secondPassword")
            .value;


        if (
            enteredSecondPassword !==
            secondPassword
        ) {

            message.innerText =
                "❌ Security PIN failed.";

            message.style.color =
                "#ff6666";

            return;
        }
    }


    /*
       CHECK RAPID TRANSACTIONS
    */

    let now = Date.now();


    recentTransactions =
        recentTransactions.filter(
            time =>
                now - time < 30000
        );


    /*
       IF 2 TRANSACTIONS ALREADY
       HAPPENED IN 30 SECONDS,
       THIS WILL BE THE 3RD.
    */

    if (
        recentTransactions.length >= 2
    ) {

        pendingTransaction = {

            type: currentTransaction,

            amount: amount

        };


        document
            .getElementById("transactionBox")
            .classList.add("hidden");


        document
            .getElementById("fraudBox")
            .classList.remove("hidden");


        return;
    }


    /*
       NORMAL TRANSACTION
    */

    completeTransaction(amount);

}



/* COMPLETE TRANSACTION */

function completeTransaction(amount) {

    /*
       RECORD TRANSACTION TIME
    */

    recentTransactions.push(
        Date.now()
    );


    /* DEPOSIT */

    if (
        currentTransaction === "deposit"
    ) {

        money += amount;


        transactions.push({

            type: "Deposit",

            amount: amount,

            date:
                new Date()
                .toLocaleString()

        });


        showTransactionMessage(
            "₹" + amount +
            " successfully deposited."
        );

    }


    /* WITHDRAW */

    else if (
        currentTransaction === "withdraw"
    ) {

        if (money < amount) {

            showTransactionMessage(
                "Insufficient funds."
            );

            return;
        }


        money -= amount;


        transactions.push({

            type: "Withdraw",

            amount: amount,

            date:
                new Date()
                .toLocaleString()

        });


        showTransactionMessage(
            "₹" + amount +
            " successfully withdrawn."
        );
    }


    /* SAVE DATA */

    localStorage.setItem(
        "money",
        money
    );


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    updateBalance();


    setTimeout(() => {

        closeTransaction();

    }, 1200);
}



/* SHOW TRANSACTION MESSAGE */

function showTransactionMessage(text) {

    let message =
        document
        .getElementById("transactionMessage");


    message.innerText = text;

    message.style.color =
        "#00ffaa";
}



/*
   USER CONFIRMS
   THE 3RD TRANSACTION
*/

function confirmFraudTransaction() {

    if (!pendingTransaction) {
        return;
    }


    currentTransaction =
        pendingTransaction.type;


    let amount =
        pendingTransaction.amount;


    pendingTransaction = null;


    document
        .getElementById("fraudBox")
        .classList.add("hidden");


    /*
       User confirmed.
       Transaction continues.
    */

    completeTransaction(amount);
}



/*
   USER SAYS IT IS NOT THEM
*/

function rejectFraudTransaction() {

    pendingTransaction = null;


    document
        .getElementById("fraudBox")
        .classList.add("hidden");


    alert(
        "🚨 Transaction blocked.\n\n" +
        "Suspicious activity was reported."
    );
}



/* EMERGENCY LOCK */

function emergencyLock() {

    let securityPin =
        prompt(
            "Enter your Security PIN to activate Emergency Lock:"
        );


    if (securityPin === null) {
        return;
    }


    if (
        securityPin !== secondPassword
    ) {

        alert(
            "❌ Incorrect Security PIN.\n" +
            "Emergency Lock not activated."
        );

        return;
    }


    accountLocked = true;


    localStorage.setItem(
        "accountLocked",
        "true"
    );


    alert(
        "🚨 EMERGENCY LOCK ACTIVATED!\n\n" +
        "Your ATM account is now locked."
    );


    document
        .getElementById("dashboard")
        .classList.add("hidden");


    document
        .getElementById("authPage")
        .classList.remove("hidden");
}



/* DISPLAY BALANCE */

function displayBalance() {

    updateBalance();


    alert(
        "Your current balance is ₹" +
        money.toLocaleString()
    );
}



/* OPEN STATEMENT */

function openStatement() {

    let statementBox =
        document
        .getElementById("statementBox");


    let statementList =
        document
        .getElementById("statementList");


    statementList.innerHTML = "";


    if (transactions.length === 0) {

        statementList.innerHTML =
            `<p style="color:#8299b4">
                No transactions yet.
             </p>`;

    } else {

        transactions.forEach(
            transaction => {

                let className =
                    transaction.type === "Deposit"
                    ? "deposit"
                    : "withdraw";


                let sign =
                    transaction.type === "Deposit"
                    ? "+"
                    : "-";


                statementList.innerHTML += `

                    <div class="statement-item">

                        <div>

                            <strong
                                class="${className}">
                                ${transaction.type}
                            </strong>

                            <br>

                            <small>
                                ${transaction.date}
                            </small>

                        </div>

                        <strong
                            class="${className}">
                            ${sign} ₹${transaction.amount}
                        </strong>

                    </div>

                `;
            }
        );
    }


    document
        .getElementById("statementBalance")
        .innerText =
        money.toLocaleString();


    statementBox
        .classList.remove("hidden");
}



/* CLOSE STATEMENT */

function closeStatement() {

    document
        .getElementById("statementBox")
        .classList.add("hidden");
}



/* CLOSE TRANSACTION */

function closeTransaction() {

    document
        .getElementById("transactionBox")
        .classList.add("hidden");


    clearTransactionFields();
}



/* CLEAR FIELDS */

function clearTransactionFields() {

    document
        .getElementById("amount")
        .value = "";


    document
        .getElementById("transactionPassword")
        .value = "";


    document
        .getElementById("secondPassword")
        .value = "";


    document
        .getElementById("secondPassword")
        .hidden = true;


    document
        .getElementById("transactionMessage")
        .innerText = "";
}