# Exercise 2.5 `.deleteOne()` document

The `.deleteOne()` method functions very much like `insertOne()`. Look back at how you used that method and create a `deleteGreeting` function. Don't forget to validate that the document was in fact deleted; use `.deletedCount()` for that.

The proper HTTP code for `DELETE` is `204`.

You should add a `delete` endpoint in `server.js`:

```js
.delete('/ex-2/greeting/:_id', deleteGreeting)
```

## Stretch Goal - Improve `getGreeting`

Can you improve the `getGreeting` function to handle the following usecase?

A user wants to access the hello translation for a specific language, Cambodian, but doesn't know, or can't remember the language code for it. The user would like to enter

```js
"/ex-2/greeting/cambodian";

```
