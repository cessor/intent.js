# ftest

Functional testing for Node.js and JavaScript.

## Samples

```javascript
test(div, {
  'Dividing numbers': [
    { in: [ 6, 3 ], out: 2 },
    { in: [ 2, 1 ], out: 2 }
  ],
  'Dividing by zero': { in: [ 6, 0 ], error: Error }
});

test(fizzBuzz, {
  'Numbers that can be divided by 3 are fizz': [
    { in : 3, out : 'fizz' },
    { in : 6, out : 'fizz' }
  ],
  'Numbers that can be divided by 5 are buzz': [
    { in :  5, out : 'buzz' },
    { in : 10, out : 'buzz' }
  ],
  'Numbers that can be divided by 3 and 5 are fizzbuzz': [
    { in :  0, out : 'fizzbuzz' },
    { in : 15, out : 'fizzbuzz' },
    { in : 30, out : 'fizzbuzz' }
  ],
  'Numbers that can\'t be divided': { in : 1, out : 1 }
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