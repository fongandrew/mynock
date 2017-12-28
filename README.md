# Mynock

[![Build Status](https://travis-ci.org/fongandrew/mynock.svg?branch=master)](https://travis-ci.org/fongandrew/mynock)
[![npm version](https://badge.fury.io/js/mynock.svg)](https://badge.fury.io/js/mynock)

A simple wrapper to make stubbing / mocking / faking / spying on exported
functions (including class constructors) a little easier.

## Motivation

It is difficult to stub or replace a function exported from an ES6 module
(e.g. `export function` or `export default function`). Stubbing libraries
generally need both a reference to a parent object and the name of a child
property that can be replaced. With ES6 exports, the parent object is the
ES6 module itself. However, code external to the ES6 module have a read-only
view of the module's exports.

Current solutions involve replacing a module's exports after transpiling it
to CommonJS or bundling it with a tool like Webpack. While this works, it
is not, strictly speaking, valid ES6 and makes your test setup much
more complicated that it has to be.

`mynock` takes a simpler approach. It assumes that it is possible to wrap all
exports used by code under test (or to wrap and rewrite the imports), and
to just stub the wrappers instead.

## Setup

```
npm install mynock --save
```

Note that `mynock` should be saved in your regular dependencies, not just your
devDependencies, because it adds a thin wrapper to your non-test code as well.

`mynock` also makes use of the following environment variables:
* `process.env.NODE_ENV` - Required. Set to `'production'` to avoid unnecessary
  wrapping of your code in prod (which may affect performance).
* `process.env.MYNOCK_SYMBOL_CALLEE` - Optional. Mynock returns a wrapped
  function with a `__mynock_callee__` property pointing to the underlying
  function that should be called. It's this property that can be stubbed
  for test purposes. While unlikely, it's possible this string can conflict
  with existing properties on a function. If this environment variable is set,
  Mynock will use an ES6 Symbol instead (which by design should not conflict).
  However, many test frameworks and runtimes don't work completely as expected
  when using a Symbol to identify a function to be stubbed. Hence why we 
  use a string by default.

## Usage

In the exporting function, wrap the function being exported.

```js
import wrap from 'mynock';

export default wrap(function myFunction(a, b) {
  return expensiveCall(a) + nonDeterministicCall(b);
});
```

In your test stub out the `callee` property of your function. `callee` is a
variable exported by `mynock`, not the name of the property itself. In this
example, we use Sinon + Tape, but `mynock` should work with just about any
stubbing / faking library.

```js
import { callee } from 'mynock';
import Sinon from 'sinon';
import test from 'tape';
import myFunction from './path/to/my-function';

test('my test', (t) => {
  const stub = Sinon.stub(myFunction, callee).callsFake((a, b) => a + b);
  t.equals(myFunction(1, 2), 3);
  Sinon.assert.calledWith(stub, 1, 2);
  t.end();
});
```

Mynock also works with classes (which are technically just constructor
functions with prototypes) and static attributes assigned to classes or
functions. For example, the following React example should work. 

```jsx
import wrap from 'mynock';
import React from 'react';
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { prefix: '', suffix: '' };
  }

  render() {
    const { prefix, suffix } = this.state;
    const { content } = this.props;
    return (
      <div>
        { prefix }{ content }{ suffix }
      </div>
    );
  }
}

MyComponent.propTypes = {
  content: PropTypes.string.isRequired,
};
MyComponent.displayName = 'My Component';

export default wrap(MyComponent);
```

When stubbing classes, note that the constructor method is being replaced.
In addition, the `super` function is not available in the stubbed context,
so you will need to call the stubbed parent directly. For an example like
the above, you can try something like this:

```jsx
import { callee } from 'mynock';
import Sinon from 'sinon';
import { shallow } from 'enzyme';
import test from 'tape';
import MyComponent from './path/to/my-component';

test('my component', (t) => {
  const stub = Sinon.stub(MyComponent, callee)
    .callsFake(function constructor(props) {
      React.Component.call(this, props); // Replaces super(props) call
      this.state = {
        prefix: '¡',
        suffix: '!',
      };
    });

  const wrapper = shallow(<MyComponent content="hola" />);
  sinon.assert.calledWith(stub, { content: 'hola' });
  t.equal(wrapper.text(), '¡hola!', 'uses stubbed constructor');
  t.end();
});
```

To replace non-construtor methods, calling your library of choice's stub
function on the class's prototype (e.g.
`stub(MyClass.prototype, 'methodName')`).


## Naming

By default, wrapping a function will return a new function with a different
name (currently `'caller'`). The `wrap` function takes a second argument you
can use to control the name of the returned function.

```js
import wrap from 'mynock';

function leonardo() { return 'swords'; }
leonard.name; // => 'leonardo'

const michaelangelo = wrap(leonardo);
michaelangelo.name; // => 'caller'

const donatello = wrap(leonardo, 'raphael');
donatello.name; // => 'raphael'
```
