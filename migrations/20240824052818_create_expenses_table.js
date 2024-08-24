exports.up = function(knex) {
    return knex.schema.createTable('expenses', function(table) {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('id').inTable('users');
      table.string('description').notNullable();
      table.decimal('amount', 14, 2).notNullable();
    });
  };
  exports.down = function(knex) {
    return knex.schema.dropTable('expenses');
  };  
