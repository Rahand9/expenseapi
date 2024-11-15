exports.up = function(knex) {
    // this is the up function it specifies what changes should be added
    return knex.schema.createTable('users', function(table) {
        //this craetes a table named users
      table.increments('id').primary();
      // this creates an id column with auto incrementing also sets it as primary
      // the . increment makes it auto increment hence making each id unique 
    // the . primary is for identifing uniqueness (it enforces that the id values must be unique and cannot be null)
      table.string('username').notNullable().unique();
      // as for this it makes it not to be null and must be unique 
      //.string is to identify that we will store strings within them

      table.string('password').notNullable();
      // same thing here
    });
  };
  
  // To undo the changes made by exports.up (just in ccase we wanted to delete the users table)
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
