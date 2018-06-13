[![https://www.remoteassembly.com](https://www.remoteassembly.com/img/logo_3-bb1a318535.svg)](https://github.com/remoteassembly)

## Installation

1. Install google cloud functions locally (but in the same IP where server runs)
```
npm install -g @google-cloud/functions-emulator
```
or
```
yarn global add @google-cloud/functions-emulator
```

2. Clone project to your "cloudFunctions" directory

3. Run in your project directory

        npm i
    >i = install, this will install all dependencies
4. Then

        npm run deploy
    >*(you need to have your own google cloud developer account.)*
    

    **OR**

        functions start &&
        npm run deploy-dev

    **OR**

        npm run dev

5. Enjoy!


## Usage

> NOW SUPPORTS: mongodb, couchdb, mysql, postgre

1. Basic usage

To replicate(clone, copy) your one database to another, you have to provide this cloud function your credentials for these databases.

The sample *body* of **POST** request:

```
    {
        "db1":
        {
            "host":"127.0.0.1",
            "port":"27017",
            "type":"mongo",
            "db":"test",
            "collection":"collection"
        },
        "db2":
        {
            "host":"127.0.0.1",
            "port":"5984",
            "type":"couchdb",
            "db":"test",
            "collection":""
        }
    }
```

OR

```
    "db1":
	{
		"host":"127.0.0.1",
		"port":"5432",
		"type":"postgre",
		"uname":"your_user_name",
		"password":"your_password",
		"db":"dbname",
		"collection":"collection"
	},
    "db2":
    {
        "host":"localhost",
		"port":"3306",
		"type":"mysql",
		"uname":"your_username",
		"password":"your_password",
		"db":"dbname",
		"collection":"collection",
        "schema":
		{
			"id": 
			{
				"type": "int",
				"addition": "UNSIGNED AUTO_INCREMENT"
			},
			"skey":
			{
				"type": "varchar",
                "size": "15",
                "addition": "NOT NULL"
			},
			"svalue":
			{
				"type": "text"
			},
			"createdAt":
			{
				"type": "datetime"
			},
			"primary": "id",
			"engine": "InnoDB"
		}
    }
```

> This snippet replicates mongo database to couchdb database **OR** table from postgresql database to non-existent(or existent) table in mysql database.

> You can also try replicating data from no-sql databases to sql databases, using schema. And back w/o it.

> If database table not exists you need to provide its **schema** like it shown above. You can use types `[int, float, double, text, varchar, datetime, bool]` which are listed in `interface/typedb.json` and provide same types for both of these databases. You can add yours.
    
- The `engine` field is not required for postgre, but is required for mysql.
- Primary for camelCase columns for **postgre** need to be quoted for each identificator.
- Type is required for every column. If it has not a type, column won't be created.
- Additions for each column are specific for every database keywords, like `AUTO_INCREMENT` in mysql, and are placed after type of column.
- `size` is a length(size) of column values, and `{ "type" : "varchar", "size":"30" }` represents like `VARCHAR(30)`

> NOTE: Non-existent columns won`t be added if you replicate table or objects with undefined fields in target table!


The sample response for this request is:

```
{
    "ok": true,
    "success": true,
    "result": "ok",
    "reason": "successfully replicated"
}
```

or an error:

```
{
    "result": "fail",
    "success": false,
    "ok": false,
    "name": "Error",
    "error": "conflict",
    "reason": "Document update conflict."
}
```

and error for backwards:

```
{
    "result": "fail",
    "success": false,
    "ok": false,
    "name": "MongoError",
    "error": "MongoError",
    "reason": "E11000 duplicate key error collection: test.collection index: _id_ dup key: { : \"id\" }"
}
```

What means that target table with same values (or one same value) already exists.

2. Development

You can also add your own database type to support it.

First, goto `modules`, and create your own `module_name.js` file.

Then, goto `interface` folder, open `unidb_interface.js` and look at its structur.
Your database driver must be derived from this interface.

For more information look at existent db drivers at `modules`, and make smth yours like them.

Last, open `config.js`, and append array of modules with your own:

append head with `import yourModuleName from './modules/your_module'`

and `modules` with:

```
{
    name: 'your_module_name',
    type: 'your_db_type',
    module: yourModuleName  // (Imported as told above)
}
```

And that's all!

Be sure to set `your_db_type` in request for cloud function!

Enjoy!:)

## Dependencies
Use [these instructions](https://cloud.google.com/functions/docs/deploying/) to setup global dependencies.
