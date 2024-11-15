exports.up = function(knex) {
    return knex.schema.createTable('expenses', function(table) {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('id').inTable('users');
// .unsigned makes it so that it can only store postive nmbers and no negative numbers
// .references('id') means this column (userId) is linked to the 'id' column 
// in another table. It's like saying, "this userId must match an id from the users table."
// .inTable('users') specifies that the 'id' column being referenced is in the 'users' table.
// This helps ensure that each expense or revenue entry belongs to a valid user.
table.string('description').notNullable();
table.decimal('amount', 14, 2).notNullable();
// The '14' specifies the total number of digits allowed (including both sides of the decimal point).
// The '2' specifies the number of digits allowed after the decimal point.
// why 14 and 2?
// the 2 is because we want the cents in dollar for example 1.99$
// the 14 allows for big numbers (so our code can handle large amounts of expenses)
    });
  };
  exports.down = function(knex) {
    return knex.schema.dropTable('expenses');
  };  