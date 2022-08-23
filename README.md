# Getting Started with Key Value Storage

## Available Scripts

Start by running `yarn install` to install dependencies and then `yarn start`

### Main application

The application consists of a form where you can enter commands to interact with an in-memory state which will respond.\
You can also see the history of all the commands you submitted in the list below the form.\
There's a tooltip to help you introduce the commands with the correspondig params.\

## Available commands

### Important

keys and values are Case Sensitive. Commands are not.\
Keys and values only accept strings and digits with a maximum of 255 characters each.\
Parenthesis are only to show where parameters start and end, don't use them when submitting commands.\

### Commands

- SET (key) (value)\: Store the value for key
- GET (key)\: Return the current value for key
- DELETE (key)\: Remove the entry for key
- COUNT (value)\: Return the number of keys that have the given value
- BEGIN\: Start a new transaction
- COMMIT\: Complete the current transaction
- ROLLBACK\: Revert to state prior to BEGIN call

### Examples

Set and get a value

```Bash
> SET foo 123
> GET foo
123
```

Delete a value

```Bash
> DELETE foo
> GET foo
key not set
```

Count the number of occurrences of a value

```Bash
> SET foo 123
> SET bar 456
> SET baz 123
> COUNT 123
123
> COUNT 456
456
```

Commit a transaction

```Bash
> BEGIN
> SET foo 456
> COMMIT
> ROLLBACK
no transaction
> GET foo
456
```

Rollback a transaction

```Bash
> SET foo 123
> SET bar abc
> BEGIN
> SET foo 456
> GET foo
456
> SET bar def
> GET bar
def
> ROLLBACK
> GET foo
123
> GET bar
abc
> COMMIT
no transaction
```

Nested transactions

```Bash
> SET foo 123
> BEGIN
> SET bar 456
> SET foo 456
> BEGIN
> COUNT 456
2
> GET foo
456
> SET foo 789
> GET foo
789
> ROLLBACK
> GET foo
456
> ROLLBACK
> GET foo
123
```

### `yarn test`

Launches the test runner in the interactive watch mode.\
You can see the coverage by running with the flag: `yarn test -- --coverage`
