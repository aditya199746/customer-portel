module.exports = {
  Customer: [
    {
      id: "1",
      name: "Aditya Kumar",
      email: "aditya@example.com",
    },
    {
      id: "2",
      name: "Aishwarya kendre",
      email: "Aishwarya@example.com",
    },
  ],
  Account: [
    {
      id: "1",
      customerId: "1",
      accountNumber: "1234567890",
      balance: 9999.99,
      currency: "INR",
    },
    {
      id: "2",
      customerId: "2",
      accountNumber: "1234567",
      balance: 99.99,
      currency: "INR",
    },
  ],
  Transaction: [
    {
      id: "1",
      accountId: "1",
      type: "CREDIT",
      amount: 5000,
      description: "Salary credited",
      date: "2024-07-01",
    },
    {
      id: "2",
      accountId: "1",
      type: "DEBIT",
      amount: 2000,
      description: "Amazon purchase",
      date: "2024-07-02",
    },
    {
      id: "3",
      accountId: "1",
      type: "DEBIT",
      amount: 1500,
      description: "Electricity bill",
      date: "2024-07-03",
    },
  ],
};
