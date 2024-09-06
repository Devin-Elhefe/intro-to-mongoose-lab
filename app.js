const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

const Customer = require('./models/customer')

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}

connect()


async function createCustomer() {
    const name = prompt('Enter customer name: ');
    const age = parseInt(prompt('Enter customer age: '), 10);
    
    const customer = new Customer({ name, age });
    await customer.save();
    
    console.log('Customer created successfully!');
  }

  async function viewCustomers() {
    const customers = await Customer.find();
    if (customers.length === 0) {
      console.log('No customers found.');
      return;
    }
    customers.forEach(c => console.log(`ID: ${c._id}, Name: ${c.name}, Age: ${c.age}`));
}

  async function updateCustomer() {
    await viewCustomers();
    const id = prompt('Enter the ID of the customer to update: ');
    const customer = await Customer.findById(id);
    
    if (customer) {
      const name = prompt(`Enter new name (${customer.name}): `) || customer.name;
      const age = parseInt(prompt(`Enter new age (${customer.age}): `), 10) || customer.age;
      
      customer.name = name;
      customer.age = age;
      await customer.save();
      
      console.log('Customer updated successfully!');
    } else {
      console.log('Customer not found.');
    }
  }

  async function deleteCustomer() {
    await viewCustomers();
    const id = prompt('Enter the ID of the customer to delete: ');
    await Customer.findByIdAndDelete(id);
    console.log('Customer deleted successfully!');
  }

async function mainMenu() {
    console.log("Welcome to the CRM");
    console.log("What would you like to do?");

    let quit = false;
    while (!quit) {
        console.log(`
            1. Create a Customer
            2. View Customers
            3. Update a Customer
            4. Delete a Customer
            5. Quit
            `);
            const choice = prompt('Choose an option: ');
            switch (choice) {
                case '1':
                    await createCustomer();
                    break;
                case '2':
                    await viewCustomer();
                    break;
                case '3':
                    await updateCustomer();
                    break;
                case '4':
                    await deleteCustomer();
                    break;
                case '5':
                    quit = true;
                    console.log("Goodbye!");
                    await mongoose.disconnect();
                    console.log('Disconnected from MongoDB');
                    process.exit()
                    break;
                default:
                    console.log("Invalid choice, please choose again.");
            }
    }
    
}

mainMenu()







