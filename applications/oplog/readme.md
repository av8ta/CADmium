# oplog & evolution log experiment

![](./streams.png)

```typescript
const plane = await createPlaneFn(
	{
		origin: [0, 0, 0],
		primary: [1, 0, 0],
		secondary: [0, 1, 0],
		tertiary: [0, 0, 1]
	},
	{ id: None, nonce: Some("abc"), targets: None, context: None }
)
```


```json
{
  "id": "99446bdd105f9676cbd84b2c341a44b15cb6a5587dbbffc4a47846897fe01d6c",
  "command": "CreatePlane",
  "data": {
    "plane": {
      "origin": [
        0,
        0,
        0
      ],
      "primary": [
        1,
        0,
        0
      ],
      "secondary": [
        0,
        1,
        0
      ],
      "tertiary": [
        0,
        0,
        1
      ]
    }
  },
  "targets": {},
  "context": {},
  "nonce": {
    "val": "abc"
  }
}
```