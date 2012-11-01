# ftest

Functional testing for JavaScript.

## Samples

```javascript
test(div, {
  'Dividing numbers': [
    { in: [ 6, 3 ], out: 2 },
    { in: [ 2, 1 ], out: 2 }
  ],
  'Dividing by zero': { in: [ 6, 0 ], out: Error }
});

test(fizzBuzz, {
  'Divisible by 3 is Fizz': [
    { in: 3, out: 'Fizz' },
    { in: 6, out: 'Fizz' },
    { in: 9, out: 'Fizz' }
  ],
  'Divisible by 5 is Buzz': [
    { in:  5, out: 'Buzz' },
    { in: 10, out: 'Buzz' }
  ],
  'Divisible by 3 and 5 is FizzBuzz':
    { in: 15, out: 'FizzBuzz' },
  'Divisible neither by 3 nor by 5 is just the number': [
    { in: 7, out: 7 },
    { in: 8, out: 8 }
  ]
});

test(addAsync, {
  'Adds numbers': { in: [ 2, 3, callback({ in: 5, out: 23 }) ], out: 24 }
});
```

That's it :-)!

## License

The MIT License (MIT)
Copyright (c) 2012 Johannes Hofmeister and Golo Roden.
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.